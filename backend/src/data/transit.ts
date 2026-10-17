import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const dataDirectory = fileURLToPath(new URL("../../data/gtfs/", import.meta.url));

function readCsv(file: string): Record<string, string>[] {
  const source = readFileSync(`${dataDirectory}${file}`, "utf8").replace(/^\uFEFF/, "").trim();
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }

  if (row.length || cell) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])));
}

export type TransitStop = {
  id: number;
  stopId: string;
  name: string;
  latitude: number;
  longitude: number;
  routeNames: Set<string>;
};

export type TransitTrip = {
  routeId: string;
  routeName: string;
  routeLongName: string;
  headsign: string;
  stopIds: string[];
  shapePoints: [number, number][];
  headwayMinutes: number | null;
};

const routeRows = readCsv("routes.txt");
const tripRows = readCsv("trips.txt");
const timeRows = readCsv("stop_times.txt");
const stopRows = readCsv("stops.txt");
const frequencyRows = readCsv("frequencies.txt");
const shapeRows = readCsv("shapes.txt");

const stopsByGtfsId = new Map<string, TransitStop>();
const stops: TransitStop[] = stopRows
  .filter((row) => row.location_type === "0" && row.stop_name.trim())
  .map((row, index) => {
    const stop: TransitStop = {
      id: index + 1,
      stopId: row.stop_id,
      name: row.stop_name.trim(),
      latitude: Number(row.stop_lat),
      longitude: Number(row.stop_lon),
      routeNames: new Set<string>(),
    };
    stopsByGtfsId.set(stop.stopId, stop);
    return stop;
  });

const routesById = new Map(routeRows.map((route) => [route.route_id, route]));
const timesByTripId = new Map<string, { sequence: number; stopId: string }[]>();
for (const row of timeRows) {
  const entries = timesByTripId.get(row.trip_id) ?? [];
  entries.push({ sequence: Number(row.stop_sequence), stopId: row.stop_id });
  timesByTripId.set(row.trip_id, entries);
}

const frequencyByTripId = new Map(frequencyRows.map((row) => [row.trip_id, Math.round(Number(row.headway_secs) / 60)]));
const shapePointsById = new Map<string, { sequence: number; point: [number, number] }[]>();
for (const row of shapeRows) {
  const points = shapePointsById.get(row.shape_id) ?? [];
  points.push({ sequence: Number(row.shape_pt_sequence), point: [Number(row.shape_pt_lat), Number(row.shape_pt_lon)] });
  shapePointsById.set(row.shape_id, points);
}
for (const points of shapePointsById.values()) points.sort((left, right) => left.sequence - right.sequence);

export const transitTrips: TransitTrip[] = tripRows.flatMap((trip) => {
  const route = routesById.get(trip.route_id);
  const orderedStopIds = (timesByTripId.get(trip.trip_id) ?? [])
    .sort((left, right) => left.sequence - right.sequence)
    .map((item) => item.stopId)
    .filter((stopId) => stopsByGtfsId.has(stopId));

  if (!route || orderedStopIds.length < 2) return [];
  for (const stopId of orderedStopIds) stopsByGtfsId.get(stopId)?.routeNames.add(route.route_short_name);

  return [{
    routeId: trip.route_id,
    routeName: route.route_short_name || route.route_id,
    routeLongName: route.route_long_name,
    headsign: trip.trip_headsign,
    stopIds: orderedStopIds,
    shapePoints: (shapePointsById.get(trip.shape_id) ?? []).map(({ point }) => point),
    headwayMinutes: frequencyByTripId.get(trip.trip_id) ?? null,
  }];
});

export const transitStops = stops;
export const transitStopsById = stopsByGtfsId;
