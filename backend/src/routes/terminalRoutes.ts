import { Router } from "express";
import { terminals } from "../data/terminals.js";

const router = Router();

// GET /api/terminals
router.get("/", (_req, res) => {
  res.json({
    success: true,
    count: terminals.length,
    data: terminals
  });
});

// GET /api/terminals/:id
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid terminal ID."
    });
  }

  const terminal = terminals.find((item) => item.id === id);

  if (!terminal) {
    return res.status(404).json({
      success: false,
      message: "Terminal not found."
    });
  }

  return res.json({
    success: true,
    data: terminal
  });
});

export default router;