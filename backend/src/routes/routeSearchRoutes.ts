import { Router } from "express";
import { terminals } from "../data/terminals.js";

const router = Router();

// Demonstration connections only. Confirm these taxi links with local operators
// before treating them as real or using them to plan a journey.
const demoConnections = [
  { fromId: 1, toId: 2, transfers: 0, note: "Illustrative direct connection" },
  { fromId: 1, toId: 3, viaId: 2, transfers: 1, note: "Illustrative connection; ask locally about transfers" },
  { fromId: 2, toId: 3, transfers: 0, note: "Illustrative direct connection" },
];

function findTerminal(query: string) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return undefined;
  return terminals.find((terminal) =>
    `${terminal.name} ${terminal.nameAm} ${terminal.area} ${terminal.areaAm}`
      .toLocaleLowerCase()
      .includes(normalized),
  );
}

router.get("/search", (req, res) => {
  const fromQuery = typeof req.query.from === "string" ? req.query.from : "";
  const toQuery = typeof req.query.to === "string" ? req.query.to : "";

  if (!fromQuery.trim() || !toQuery.trim()) {
    return res.status(400).json({ success: false, message: "Enter both a starting point and a destination." });
  }

  const from = findTerminal(fromQuery);
  const to = findTerminal(toQuery);
  if (!from || !to) {
    return res.json({ success: true, verified: false, data: [], message: "No matching demo terminal. Try Bole, Mexico, or Megenagna." });
  }
  if (from.id === to.id) {
    return res.json({ success: true, verified: false, data: [], message: "Choose two different places to find a route." });
  }

  const connection = demoConnections.find(
    (item) => item.fromId === from.id && item.toId === to.id,
  ) ?? demoConnections.find(
    (item) => item.fromId === to.id && item.toId === from.id,
  );

  if (!connection) {
    return res.json({ success: true, verified: false, data: [], message: "No demo connection found for these places." });
  }

  const first = terminals.find((item) => item.id === connection.fromId)!;
  const second = terminals.find((item) => item.id === connection.toId)!;
  const via = "viaId" in connection
    ? terminals.find((item) => item.id === connection.viaId)
    : undefined;
  const ordered = from.id === first.id
    ? [first, ...(via ? [via] : []), second]
    : [second, ...(via ? [via] : []), first];

  return res.json({
    success: true,
    verified: false,
    data: [{
      from: { id: from.id, name: from.name, area: from.area },
      to: { id: to.id, name: to.name, area: to.area },
      stops: ordered.map(({ id, name, area }) => ({ id, name, area })),
      transfers: connection.transfers,
      note: connection.note,
      verified: false,
    }],
  });
});

export default router;
