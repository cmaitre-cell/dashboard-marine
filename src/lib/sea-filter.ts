/**
 * Filtre maritime — double approche :
 * 1. EXCLUSION : zones terrestres intérieures connues → toujours rejeté
 * 2. INCLUSION : zones maritimes mondiales → accepté si hors exclusion
 *
 * Le croisement des deux donne un résultat précis sans dépendance externe.
 */

type BBox = { minLat: number; maxLat: number; minLon: number; maxLon: number };

// ── ZONES TERRESTRES INTÉRIEURES (exclusion absolue) ─────────────────────────
const LAND_ZONES: BBox[] = [
  // Amérique du Nord — intérieur
  { minLat: 36, maxLat: 55, minLon: -110, maxLon: -78 },
  { minLat: 55, maxLat: 68, minLon: -120, maxLon: -80 },
  // Mexique intérieur / Amérique centrale
  { minLat: 15, maxLat: 25, minLon: -100, maxLon: -86 },
  // Amazonie / Brésil intérieur
  { minLat: -12, maxLat: 3,  minLon: -70,  maxLon: -46 },
  // Centre-Amérique du Sud
  { minLat: -28, maxLat: -5, minLon: -64,  maxLon: -42 },
  // Patagonie intérieure
  { minLat: -48, maxLat: -28,minLon: -68,  maxLon: -56 },
  // Sahara (Afrique du Nord intérieure)
  { minLat: 16,  maxLat: 30, minLon: -5,   maxLon: 33  },
  // Afrique de l'Ouest intérieure
  { minLat: 8,   maxLat: 16, minLon: -8,   maxLon: 15  },
  // Afrique centrale (Congo / bassin)
  { minLat: -8,  maxLat: 8,  minLon: 14,   maxLon: 30  },
  // Afrique de l'Est intérieure
  { minLat: -8,  maxLat: 12, minLon: 28,   maxLon: 40  },
  // Afrique australe intérieure
  { minLat: -28, maxLat: -14,minLon: 18,   maxLon: 34  },
  // Péninsule Arabique intérieure
  { minLat: 20,  maxLat: 30, minLon: 44,   maxLon: 56  },
  // Sous-continent indien intérieur
  { minLat: 20,  maxLat: 32, minLon: 68,   maxLon: 88  },
  // Asie centrale (Kazakhstan, Mongolie…)
  { minLat: 38,  maxLat: 55, minLon: 52,   maxLon: 95  },
  // Sibérie intérieure
  { minLat: 55,  maxLat: 75, minLon: 60,   maxLon: 140 },
  // Chine intérieure
  { minLat: 30,  maxLat: 50, minLon: 88,   maxLon: 118 },
  // Indochine intérieure (Myanmar, Laos, Thaïlande nord)
  { minLat: 16,  maxLat: 26, minLon: 97,   maxLon: 106 },
  // Europe centrale / est (hors côtes)
  { minLat: 44,  maxLat: 57, minLon: 12,   maxLon: 35  },
  // Russie européenne intérieure
  { minLat: 48,  maxLat: 62, minLon: 30,   maxLon: 55  },
  // Outback australien
  { minLat: -33, maxLat: -18,minLon: 120,  maxLon: 140 },
  // Groenland intérieur
  { minLat: 68,  maxLat: 83, minLon: -50,  maxLon: -20 },
];

// ── ZONES MARITIMES (inclusion) ───────────────────────────────────────────────
const SEA_ZONES: BBox[] = [
  // Atlantique Nord (côtes USA/Canada/Europe/Afrique)
  { minLat: 0,   maxLat: 72,  minLon: -80,  maxLon: -5   },
  // Atlantique Sud
  { minLat: -60, maxLat: 0,   minLon: -60,  maxLon: 20   },
  // Méditerranée (Adriatique, Tyrrhénienne, Égée, Ionienne)
  { minLat: 30,  maxLat: 47,  minLon: -6,   maxLon: 37   },
  // Mer Noire
  { minLat: 40,  maxLat: 48,  minLon: 27,   maxLon: 42   },
  // Mer Caspienne (navires fluviaux)
  { minLat: 36,  maxLat: 47,  minLon: 49,   maxLon: 55   },
  // Mer Rouge
  { minLat: 11,  maxLat: 30,  minLon: 32,   maxLon: 44   },
  // Golfe d'Aden
  { minLat: 10,  maxLat: 16,  minLon: 42,   maxLon: 52   },
  // Golfe Persique
  { minLat: 22,  maxLat: 30,  minLon: 48,   maxLon: 60   },
  // Mer d'Arabie (côtes Oman/Inde/Pakistan)
  { minLat: 5,   maxLat: 26,  minLon: 56,   maxLon: 78   },
  // Océan Indien (centre + côtes)
  { minLat: -60, maxLat: 10,  minLon: 40,   maxLon: 120  },
  // Golfe du Bengale
  { minLat: 5,   maxLat: 23,  minLon: 78,   maxLon: 100  },
  // Mer d'Andaman / Détroit de Malacca
  { minLat: 1,   maxLat: 16,  minLon: 95,   maxLon: 106  },
  // Mer de Chine méridionale
  { minLat: 0,   maxLat: 25,  minLon: 104,  maxLon: 122  },
  // Mer de Chine orientale + Mer Jaune
  { minLat: 20,  maxLat: 42,  minLon: 118,  maxLon: 135  },
  // Mer du Japon (mer de l'Est)
  { minLat: 33,  maxLat: 52,  minLon: 128,  maxLon: 142  },
  // Pacifique Ouest (côtes Asie/Australie)
  { minLat: -50, maxLat: 65,  minLon: 120,  maxLon: 180  },
  // Pacifique Est (côtes Amérique)
  { minLat: -60, maxLat: 65,  minLon: -180, maxLon: -70  },
  // Mer des Caraïbes
  { minLat: 10,  maxLat: 24,  minLon: -88,  maxLon: -60  },
  // Golfe du Mexique
  { minLat: 18,  maxLat: 31,  minLon: -98,  maxLon: -80  },
  // Mer du Nord
  { minLat: 50,  maxLat: 62,  minLon: -5,   maxLon: 12   },
  // Mer Baltique
  { minLat: 53,  maxLat: 67,  minLon: 10,   maxLon: 32   },
  // Manche / Mer Celtique
  { minLat: 48,  maxLat: 56,  minLon: -12,  maxLon: 3    },
  // Mer d'Irlande
  { minLat: 51,  maxLat: 56,  minLon: -7,   maxLon: -3   },
  // Mer de Norvège / Mer de Barents (côtes)
  { minLat: 60,  maxLat: 78,  minLon: -5,   maxLon: 35   },
  // Mer de Java / Banda
  { minLat: -10, maxLat: 5,   minLon: 105,  maxLon: 135  },
  // Mer de Corail / Tasman
  { minLat: -38, maxLat: 5,   minLon: 142,  maxLon: 170  },
  // Océan Arctique (zones navigables)
  { minLat: 72,  maxLat: 90,  minLon: -180, maxLon: 180  },
  // Océan Austral / Antarctique
  { minLat: -90, maxLat: -55, minLon: -180, maxLon: 180  },
];

function inBox(lat: number, lon: number, zones: BBox[]): boolean {
  return zones.some(
    (z) => lat >= z.minLat && lat <= z.maxLat && lon >= z.minLon && lon <= z.maxLon
  );
}

/**
 * Retourne true uniquement si :
 *  - La position est dans une zone maritime reconnue
 *  - ET n'est PAS dans une zone terrestre intérieure connue
 */
export function isAtSea(lat: number, lon: number): boolean {
  if (inBox(lat, lon, LAND_ZONES)) return false;
  return inBox(lat, lon, SEA_ZONES);
}
