# MARITIME RF INTELLIGENCE — DGA

Dashboard d'identification passive et de détection d'anomalies maritimes pour le **Ministère des Armées français** (Direction Générale de l'Armement / Cellule SURMAR).

Plateforme codée en **Next.js 14** (TypeScript) avec un design type "command center" : sombre, dense, opérationnel — sans bruit visuel inutile.

---

## 🚀 Démarrage

```bash
cd dashboard-marine
npm install
npm run dev
```

→ Ouvrir [http://localhost:3000](http://localhost:3000)

Pour un build de production :
```bash
npm run build
npm start
```

---

## 🎯 Les 4 onglets

### 1. **Synthèse opérationnelle** (`S/01`)
Vue d'ensemble : KPI globaux, alertes prioritaires (uniquement critiques + high), liste des bâtiments à surveiller, état du réseau de capteurs, activité RF des dernières 24h.
→ **Le seul écran où les alertes "crient"** — partout ailleurs, c'est calme.

### 2. **Identification RF** (`S/02`)
**Colonne gauche** : panel complet de KPI pour reconnaître un signal :
- Scatter K-Means (clusters fréquence × puissance)
- Distribution des fréquences moyennes par pavillon
- Tableau des profils de référence avec mean/std/SNR/modulation
- Suspects mis en évidence par contour rouge et fond rouge clair

**Colonne droite** : panneau de saisie pour entrer une nouvelle signature et lancer l'identification :
- 4 presets opérationnels (cargo, tanker suspect, passenger, orphan)
- Champs fréquence/bandwidth/power/modulation/pulse pattern
- Bouton "LANCER L'IDENTIFICATION" → renvoie le top 5 des candidats avec score de confiance
- Verdict final (match probable ou signature atypique)

### 3. **Localisation & triangulation** (`S/03`)
Carte Leaflet plein écran avec :
- 5 capteurs (côtiers, frégate, satellite) avec leur portée affichée
- Tous les navires AIS (gris = nominal, orange = suspect, plus opaque = AIS off)
- Lignes de triangulation depuis chaque capteur vers la position estimée
- Position RF triangulée avec cercle de CEP (uncertainty)
- Sliders RSSI ajustables pour chaque capteur — la triangulation se recalcule en live
- Sélecteur de navire pour comparer position AIS vs position RF → écart en km affiché avec code couleur

Méthode : **multilatération par path loss free-space**, barycentre pondéré par 1/d².

### 4. **Détection d'anomalies** (`S/04`)
6 scénarios de détection, chacun avec sa propre méthode :
- **Faux pavillon** : écart > 2σ avec la norme de fréquence du pavillon
- **Saut de fréquence** : changement brutal > 2σ historique
- **AIS désactivé** : coupure > 24h
- **Écart de position** : AIS vs RF > 1 km
- **MMSI orphelin** : signature sans navire associé au registre
- **Changement de nom** : > 2 noms historiques (pattern d'identity laundering)

Pour chaque anomalie sélectionnée :
- Bandeau résumé avec sévérité, confiance, source, position
- Si pertinent : graphique d'évolution RF 48h avec saut marqué en rouge
- Chaîne d'analyse étape par étape (Equasis → OFAC → satellite → escalade)
- Boutons d'action : escalader CO-MAR, marquer faux positif, demander overpass, exporter rapport

---

## 🎨 Direction artistique

- **Palette** : charbon (#0a0c10 à #2a303f) + acier (gris bleutés) + 5 niveaux d'alerte (critical → nominal)
- **Typo** : Space Grotesk (display) / IBM Plex Sans (body) / JetBrains Mono (data)
- **Effets** : quadrillage opérationnel discret, scanlines bleues sur cartes critiques, pulse pour les alertes actives
- **Pas de purple gradient, pas d'Inter générique, pas d'emoji** — c'est un outil de travail pour la Marine

---

## 📁 Architecture

```
src/
├── app/
│   ├── layout.tsx          → root layout
│   ├── page.tsx            → orchestre les onglets
│   └── globals.css         → styles globaux + thème
├── components/
│   ├── TopBar.tsx          → bandeau + nav onglets + horloge UTC
│   ├── SyntheseView.tsx    → onglet 1
│   ├── IdentificationView.tsx → onglet 2 (KPI + panel saisie)
│   ├── LocalisationView.tsx   → onglet 3 (carte + triangulation)
│   ├── LeafletMap.tsx      → carte interactive (chargée dynamiquement)
│   └── AnomaliesView.tsx   → onglet 4 (scénarios + détail)
└── lib/
    ├── data.ts             → 10 navires + 5 capteurs + 7 anomalies réalistes
    └── engine.ts           → identification, triangulation, scoring
```

---

## ⚠️ Données

Toutes les données sont **fictives mais réalistes** :
- MMSI cohérents avec les préfixes pays UIT (227/228 France, 273 Russia, 371 Panama, etc.)
- Capteurs positionnés sur les vraies installations DGA Méditerranée (Toulon Cap Sicié, Marseille Pomègues, Ajaccio La Parata, FREMM, satellite CSO)
- Routes maritimes plausibles Méditerranée occidentale
- 4 navires marqués `is_suspicious` avec patterns réalistes (RF aberrant, multiples changements de nom, AIS off)

Pour brancher des données réelles, voir le fichier `lib/data.ts` et remplacer les constantes par des fetch vers VesselAPI / OpenSanctions / Equasis.

---

## 🛠️ Stack technique

| Lib | Usage |
|---|---|
| Next.js 14 | Framework |
| TypeScript | Types stricts sur navires/anomalies/résultats |
| Tailwind CSS | Styling (custom palette militaire) |
| Recharts | Scatter K-Means, BarChart pavillons, ComposedChart évolution RF |
| React-Leaflet + Leaflet | Carte interactive Méditerranée |
| Lucide-react | Icônes |

---

## 📌 Notes design

- **Alertes** : seules les `critical` et `high` apparaissent en page d'accueil avec bordure colorée. `medium` et `low` restent accessibles dans l'onglet anomalies mais sans crier.
- **Densité** : chaque écran a du contenu, mais hiérarchisé. Le titre de chaque panel suit la convention militaire (LABEL EN MAJUSCULES + sous-titre `label-tag`).
- **Données chiffrées** : toujours en `font-mono` avec `tabular-nums` pour l'alignement.
- **Pas d'animations gratuites** : seules les alertes actives pulsent.
