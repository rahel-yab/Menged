import type { Terminal } from "../types/terminal.js";

// Illustrative demo records only.
// These coordinates, routes, and estimates must be verified
// before being presented as real transport information.

export const terminals: Terminal[] = [
  {
    id: 1,
    name: "Bole Medhanialem",
    nameAm: "ቦሌ መድኃኒዓለም",
    area: "Bole",
    areaAm: "ቦሌ",
    latitude: 8.9958,
    longitude: 38.7873,
    routes: [],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false
  },
  {
    id: 2,
    name: "Mexico Square",
    nameAm: "ሜክሲኮ አደባባይ",
    area: "Mexico",
    areaAm: "ሜክሲኮ",
    latitude: 9.0107,
    longitude: 38.7525,
    routes: [],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false
  },
  {
    id: 3,
    name: "Megenagna",
    nameAm: "መገናኛ",
    area: "Megenagna",
    areaAm: "መገናኛ",
    latitude: 9.0204,
    longitude: 38.8075,
    routes: [],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false
  }
];