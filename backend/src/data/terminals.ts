import type { Terminal } from "../types/terminal.js";

// Starter records for the prototype. Names and map pins need confirmation
// from local operators before being used as official transport information.
export const terminals: Terminal[] = [
  {
    id: 1,
    name: "Bole Medhanialem",
    nameAm: "ቦሌ መድኃኒዓለም",
    area: "Bole",
    areaAm: "ቦሌ",
    latitude: 8.9958,
    longitude: 38.7873,
    routes: ["Example connection to Mexico Square", "Example transfer to Megenagna via Mexico Square"],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false,
  },
  {
    id: 2,
    name: "Mexico Square",
    nameAm: "ሜክሲኮ አደባባይ",
    area: "Mexico",
    areaAm: "ሜክሲኮ",
    latitude: 9.0107,
    longitude: 38.7525,
    routes: ["Example connection to Bole Medhanialem", "Example connection to Megenagna"],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false,
  },
  {
    id: 3,
    name: "Megenagna",
    nameAm: "መገናኛ",
    area: "Megenagna",
    areaAm: "መገናኛ",
    latitude: 9.0204,
    longitude: 38.8075,
    routes: ["Example connection to Mexico Square", "Example transfer to Bole via Mexico Square"],
    crowdLevel: "unknown",
    estimatedWaitMinutes: null,
    verified: false,
  },
];
