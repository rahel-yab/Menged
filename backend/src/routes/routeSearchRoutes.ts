import { Router } from "express";
import { transitStops, transitStopsById, transitTrips, type TransitStop, type TransitTrip } from "../data/transit.js";

const router = Router();
const tripsAtStop = new Map<string, { trip: TransitTrip; index: number }[]>();

for (const trip of transitTrips) {
  trip.stopIds.forEach((stopId, index) => {
    const entries = tripsAtStop.get(stopId) ?? [];
    entries.push({ trip, index });
    tripsAtStop.set(stopId, entries);
  });
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

function scoreStop(stop: TransitStop, query: string) {
  const name = normalize(stop.name);
  if (name === query) return 0;
  if (name.startsWith(query) || query.startsWith(name)) return 1;
  if (name.includes(query)) return 2;
  const queryWords = query.split(" ");
  if (queryWords.every((word) => name.includes(word))) return 3;
  return Number.POSITIVE_INFINITY;
}

function findStops(query: string) {
  const normalized = normalize(query);
  if (!normalized) return [];
  return transitStops
    .map((stop) => ({ stop, score: scoreStop(stop, normalized) }))
    .filter(({ score }) => Number.isFinite(score))
    .sort((left, right) => left.score - right.score || left.stop.name.localeCompare(right.stop.name))
    .slice(0, 30);
}

function stopView(stopId: string) {
  const stop = transitStopsById.get(stopId)!;
  return { id: stop.id, name: stop.name, nameAm: stop.name, area: stop.name, latitude: stop.latitude, longitude: stop.longitude };
}

type Leg = {
  routeName: string;
  routeLongName: string;
  headsign: string;
  from: ReturnType<typeof stopView>;
  to: ReturnType<typeof stopView>;
  stops: ReturnType<typeof stopView>[];
  shape: [number, number][];
  headwayMinutes: number | null;
};

function nearestShapeIndex(shape: [number, number][], stopId: string, fromIndex = 0) {
  const stop = transitStopsById.get(stopId)!;
  let nearestIndex = fromIndex;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (let index = fromIndex; index < shape.length; index += 1) {
    const [latitude, longitude] = shape[index];
    const distance = (latitude - stop.latitude) ** 2 + (longitude - stop.longitude) ** 2;
    if (distance < nearestDistance) {
      nearestIndex = index;
      nearestDistance = distance;
    }
  }
  return nearestIndex;
}

function makeLeg(trip: TransitTrip, fromIndex: number, toIndex: number): Leg {
  const stopIds = trip.stopIds.slice(fromIndex, toIndex + 1);
  const startShapeIndex = nearestShapeIndex(trip.shapePoints, stopIds[0]);
  const endShapeIndex = nearestShapeIndex(trip.shapePoints, stopIds[stopIds.length - 1], startShapeIndex);
  const shape = trip.shapePoints.length > 1
    ? trip.shapePoints.slice(startShapeIndex, endShapeIndex + 1)
    : stopIds.map((stopId) => {
        const stop = transitStopsById.get(stopId)!;
        return [stop.latitude, stop.longitude] as [number, number];
      });
  return {
    routeName: trip.routeName,
    routeLongName: trip.routeLongName,
    headsign: trip.headsign,
    from: stopView(stopIds[0]),
    to: stopView(stopIds[stopIds.length - 1]),
    stops: stopIds.map(stopView),
    shape,
    headwayMinutes: trip.headwayMinutes,
  };
}

type Candidate = {
  from: ReturnType<typeof stopView>;
  to: ReturnType<typeof stopView>;
  stops: ReturnType<typeof stopView>[];
  legs: Leg[];
  transfers: number;
  note: string;
  verified: false;
  score: number;
};

router.get("/search", (req, res) => {
  const fromQuery = typeof req.query.from === "string" ? req.query.from : "";
  const toQuery = typeof req.query.to === "string" ? req.query.to : "";

  if (!fromQuery.trim() || !toQuery.trim()) {
    return res.status(400).json({ success: false, messageKey: "enterBoth", message: "Enter both a starting point and a destination." });
  }

  const origins = findStops(fromQuery);
  const destinations = findStops(toQuery);
  if (!origins.length || !destinations.length) {
    return res.json({
      success: true,
      verified: false,
      data: [],
      messageKey: "terminalNotFound",
      message: "We couldn't match both places to a mapped minibus stop. Try choosing a name from the suggestions.",
    });
  }

  if (normalize(fromQuery) === normalize(toQuery)) {
    return res.json({ success: true, verified: false, data: [], messageKey: "samePlace", message: "Choose two different places to find a route." });
  }

  const destinationById = new Map(destinations.map((entry) => [entry.stop.stopId, entry.score]));
  const candidates = new Map<string, Candidate>();

  const addCandidate = (legs: Leg[], matchScore: number) => {
    const first = legs[0];
    const last = legs[legs.length - 1];
    const stops = [...first.stops, ...legs.slice(1).flatMap((leg) => leg.stops.slice(1))];
    const transfers = legs.length - 1;
    const key = legs.map((leg) => `${leg.routeName}:${leg.from.id}-${leg.to.id}`).join("|");
    const candidate: Candidate = {
      from: first.from,
      to: last.to,
      stops,
      legs,
      transfers,
      note: "Mapped from the AddisMapTransit minibus GTFS feed. Check locally for current service and boarding details.",
      verified: false,
      score: matchScore * 100 + transfers * 8 + stops.length,
    };
    const existing = candidates.get(key);
    if (!existing || candidate.score < existing.score) candidates.set(key, candidate);
  };

  for (const { stop: origin, score: originScore } of origins) {
    for (const boarding of tripsAtStop.get(origin.stopId) ?? []) {
      const { trip, index: boardIndex } = boarding;
      for (let alightIndex = boardIndex + 1; alightIndex < trip.stopIds.length; alightIndex += 1) {
        const destinationScore = destinationById.get(trip.stopIds[alightIndex]);
        if (destinationScore === undefined) continue;
        addCandidate([makeLeg(trip, boardIndex, alightIndex)], originScore + destinationScore);
      }
    }
  }

  // Find one-transfer journeys by connecting two directional GTFS trips at a shared stop.
  for (const { stop: origin, score: originScore } of origins) {
    for (const firstBoarding of tripsAtStop.get(origin.stopId) ?? []) {
      const { trip: firstTrip, index: firstBoardIndex } = firstBoarding;
      for (let transferIndex = firstBoardIndex + 1; transferIndex < firstTrip.stopIds.length; transferIndex += 1) {
        const transferId = firstTrip.stopIds[transferIndex];
        for (const secondBoarding of tripsAtStop.get(transferId) ?? []) {
          const { trip: secondTrip, index: secondBoardIndex } = secondBoarding;
          if (secondTrip.routeId === firstTrip.routeId) continue;
          for (let alightIndex = secondBoardIndex + 1; alightIndex < secondTrip.stopIds.length; alightIndex += 1) {
            const destinationScore = destinationById.get(secondTrip.stopIds[alightIndex]);
            if (destinationScore === undefined) continue;
            addCandidate([
              makeLeg(firstTrip, firstBoardIndex, transferIndex),
              makeLeg(secondTrip, secondBoardIndex, alightIndex),
            ], originScore + destinationScore);
          }
        }
      }
    }
  }

  const results = [...candidates.values()]
    .sort((left, right) => left.score - right.score)
    .slice(0, 5)
    .map(({ score: _score, ...result }) => result);

  return res.json({
    success: true,
    verified: false,
    data: results,
    ...(results.length ? {} : {
      messageKey: "noConnection",
      message: "No mapped minibus route was found between those stops. Try a nearby stop name.",
    }),
  });
});

export default router;
