import { Router } from "express";
import { terminals } from "../data/terminals.js";

const router = Router();

// Illustrative links for the prototype. Replace with connections confirmed
// by local taxi operators before presenting these as usable journey advice.
const demoConnections = [
  { fromId: 1, toId: 2, transfers: 0, note: "Example connection; confirm locally." },
  { fromId: 1, toId: 3, viaId: 2, transfers: 1, note: "Example transfer; confirm locally." },
  { fromId: 2, toId: 3, transfers: 0, note: "Example connection; confirm locally." },
];

function findTerminal(query: string) {
  const normalized = query
    .split(",", 1)[0]
    .trim()
    .toLocaleLowerCase();

  if (!normalized) return undefined;

  const fields = (terminal: (typeof terminals)[number]) => [
    terminal.name,
    terminal.nameAm,
    terminal.area,
    terminal.areaAm,
  ].map((value) => value.toLocaleLowerCase());

  return terminals.find((terminal) => fields(terminal).includes(normalized))
    ?? terminals.find((terminal) => fields(terminal).some((value) => value.includes(normalized)));
}

router.get("/search", (req, res) => {
  const fromQuery = typeof req.query.from === "string" ? req.query.from : "";
  const toQuery = typeof req.query.to === "string" ? req.query.to : "";

  if (!fromQuery.trim() || !toQuery.trim()) {
    return res.status(400).json({
      success: false,
      messageKey: "enterBoth",
      message: "Enter both a starting point and a destination.",
    });
  }

  const from = findTerminal(fromQuery);
  const to = findTerminal(toQuery);

  if (!from || !to) {
    return res.json({
      success: true,
      verified: false,
      data: [],
      messageKey: "terminalNotFound",
      message: "We couldn't match both places. Try Bole, Mexico, or Megenagna.",
    });
  }

  if (from.id === to.id) {
    return res.json({
      success: true,
      verified: false,
      data: [],
      messageKey: "samePlace",
      message: "Choose two different places to find a route.",
    });
  }

  const connection = demoConnections.find(
    (item) => item.fromId === from.id && item.toId === to.id,
  ) ?? demoConnections.find(
    (item) => item.fromId === to.id && item.toId === from.id,
  );

  if (!connection) {
    return res.json({
      success: true,
      verified: false,
      data: [],
      messageKey: "noConnection",
      message: "No example connection is listed for these places yet.",
    });
  }

  const first = terminals.find((terminal) => terminal.id === connection.fromId)!;
  const second = terminals.find((terminal) => terminal.id === connection.toId)!;
  const via = "viaId" in connection
    ? terminals.find((terminal) => terminal.id === connection.viaId)
    : undefined;
  const stops = from.id === first.id
    ? [first, ...(via ? [via] : []), second]
    : [second, ...(via ? [via] : []), first];

  return res.json({
    success: true,
    verified: false,
    data: [{
      from: { id: from.id, name: from.name, nameAm: from.nameAm, area: from.area, latitude: from.latitude, longitude: from.longitude },
      to: { id: to.id, name: to.name, nameAm: to.nameAm, area: to.area, latitude: to.latitude, longitude: to.longitude },
      stops: stops.map(({ id, name, nameAm, area, latitude, longitude }) => ({
        id, name, nameAm, area, latitude, longitude,
      })),
      transfers: connection.transfers,
      note: connection.note,
      verified: false,
    }],
  });
});

export default router;
