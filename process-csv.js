// Script de traitement des CSV réels → génère src/lib/real-data.ts
// Usage : node process-csv.js

const fs = require('fs');
const path = require('path');

// ── CSV parser (gère les champs entre guillemets) ──────────────────────────
function parseCSVLine(line) {
  const result = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (values[i] || '').trim().replace(/^"|"$/g, ''); });
    return obj;
  }).filter(r => Object.values(r).some(v => v));
}

// ── Chargement ──────────────────────────────────────────────────────────────
const BASE = 'C:/Users/admin/Desktop/rf-platform/';
console.log('📂 Chargement des CSV...');
const ships       = parseCSV(BASE + 'ships_large.csv');
const aisData     = parseCSV(BASE + 'ais_data_large (1).csv');
const anomalies   = parseCSV(BASE + 'anomalies_large.csv');
const radioSigs   = parseCSV(BASE + 'radio_signatures_large.csv');

console.log(`  Ships: ${ships.length} | AIS: ${aisData.length} | Anomalies: ${anomalies.length} | Radio: ${radioSigs.length}`);

// ── Dernière position AIS par MMSI ─────────────────────────────────────────
const latestAIS = {};
aisData.forEach(r => {
  if (!latestAIS[r.mmsi] || r.timestamp > latestAIS[r.mmsi].timestamp) {
    latestAIS[r.mmsi] = r;
  }
});

// ── Dernière signature radio par MMSI ──────────────────────────────────────
const latestRadio = {};
radioSigs.forEach(r => {
  if (!latestRadio[r.mmsi] || r.timestamp > latestRadio[r.mmsi].timestamp) {
    latestRadio[r.mmsi] = r;
  }
});

// ── Sévérité depuis confidence ──────────────────────────────────────────────
function getSeverity(c) {
  const v = parseFloat(c);
  if (v >= 0.9)  return 'critical';
  if (v >= 0.75) return 'high';
  if (v >= 0.6)  return 'medium';
  return 'low';
}

// ── Navires suspicieux depuis ships.csv ────────────────────────────────────
const suspiciousMmsis = new Set(ships.filter(s => s.is_suspicious === 'True').map(s => s.mmsi));

// ── Anomalies avec position ────────────────────────────────────────────────
// Source de position: 1) AIS  2) signature radio
const anomaliesWithPos = anomalies.map(a => {
  const pos   = latestAIS[a.mmsi];
  const radio = latestRadio[a.mmsi];
  const ship  = ships.find(s => s.mmsi === a.mmsi);

  const lat = pos ? parseFloat(pos.latitude)  : radio ? parseFloat(radio.location_lat) : null;
  const lon = pos ? parseFloat(pos.longitude) : radio ? parseFloat(radio.location_lon) : null;

  if (!lat || !lon || isNaN(lat) || isNaN(lon)) return null;

  // Spoofing = émetteur non identifié (source physique inconnue)
  const UNKNOWN_TYPES = ['Spoofing'];
  const isVessel = !UNKNOWN_TYPES.includes(a.type);

  return {
    id:          a.anomaly_id,
    mmsi:        parseInt(a.mmsi) || 0,
    vesselName:  ship?.name || (isVessel ? `NAVIRE-${a.mmsi.slice(-4)}` : 'INCONNU'),
    flag:        ship?.flag || (isVessel ? 'Unknown' : '—'),
    type:        a.type,
    description: a.description,
    confidence:  parseFloat(a.confidence),
    severity:    getSeverity(a.confidence),
    timestamp:   a.timestamp,
    lat,
    lon,
    source:      a.source,
    isVessel,
  };
}).filter(Boolean);

console.log(`  Anomalies avec position: ${anomaliesWithPos.length}/${anomalies.length}`);

// ── Navires pour la carte ──────────────────────────────────────────────────
// Priorité: navires avec anomalies, puis is_suspicious, puis sample d'autres
const anomalyMmsiSet = new Set(anomaliesWithPos.map(a => a.mmsi.toString()));

const shipsWithPos = ships.filter(s => latestAIS[s.mmsi]);

const shipsAnomaly    = shipsWithPos.filter(s => anomalyMmsiSet.has(s.mmsi));
const shipsSuspicious = shipsWithPos.filter(s => s.is_suspicious === 'True' && !anomalyMmsiSet.has(s.mmsi));
const shipsOther      = shipsWithPos.filter(s => s.is_suspicious !== 'True' && !anomalyMmsiSet.has(s.mmsi));

// 80 navires avec anomalie + 40 suspects + 80 normaux = ~200 navires max
const selectedShips = [
  ...shipsAnomaly,
  ...shipsSuspicious.slice(0, 40),
  ...shipsOther.slice(0, 80),
];

const vessels = selectedShips.map(s => {
  const pos   = latestAIS[s.mmsi];
  const radio = latestRadio[s.mmsi];
  return {
    mmsi:         parseInt(s.mmsi),
    name:         s.name,
    flag:         s.flag,
    type:         s.type,
    destination:  s.destination || 'N/A',
    isSuspicious: s.is_suspicious === 'True',
    lat:          parseFloat(pos.latitude),
    lon:          parseFloat(pos.longitude),
    speed:        parseFloat(pos.speed) || 0,
    course:       parseFloat(pos.course) || 0,
    aisActive:    pos.ais_active === 'True',
    freqMean:     radio ? parseFloat(radio.frequency) : 156.8,
    signalMean:   radio ? parseFloat(radio.signal_strength) : -70,
  };
}).filter(v => !isNaN(v.lat) && !isNaN(v.lon));

console.log(`  Navires sélectionnés: ${vessels.length}`);

// ── Emprise géographique ───────────────────────────────────────────────────
const allLats = vessels.map(v => v.lat);
const allLons = vessels.map(v => v.lon);
const centerLat = (Math.min(...allLats) + Math.max(...allLats)) / 2;
const centerLon = (Math.min(...allLons) + Math.max(...allLons)) / 2;
console.log(`  Centre carte: ${centerLat.toFixed(2)}, ${centerLon.toFixed(2)}`);

// ── Génération TypeScript ──────────────────────────────────────────────────
const ts = `// AUTO-GENERATED — ne pas éditer manuellement
// Généré par process-csv.js depuis les CSV rf-platform

export type RealVessel = {
  mmsi: number;
  name: string;
  flag: string;
  type: string;
  destination: string;
  isSuspicious: boolean;
  lat: number;
  lon: number;
  speed: number;
  course: number;
  aisActive: boolean;
  freqMean: number;
  signalMean: number;
};

export type RealAnomaly = {
  id: string;
  mmsi: number;
  vesselName: string;
  flag: string;
  type: string;
  description: string;
  confidence: number;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  lat: number;
  lon: number;
  source: string;
  isVessel: boolean;
};

export const REAL_VESSELS: RealVessel[] = ${JSON.stringify(vessels, null, 2)};

export const REAL_ANOMALIES: RealAnomaly[] = ${JSON.stringify(anomaliesWithPos, null, 2)};

export const MAP_CENTER: [number, number] = [${centerLat.toFixed(4)}, ${centerLon.toFixed(4)}];
`;

const outPath = path.join(__dirname, 'src/lib/real-data.ts');
fs.writeFileSync(outPath, ts, 'utf-8');
console.log(`\n✅ Fichier généré: ${outPath}`);
console.log(`   ${vessels.length} navires | ${anomaliesWithPos.length} anomalies`);
