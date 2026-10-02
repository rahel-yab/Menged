import "dotenv/config";
import express from "express";
import cors from "cors";
import terminalRoutes from "./routes/terminalRoutes.js";

const app = express();

const PORT = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173"
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Menged API is running."
  });
});

// Terminal endpoints
app.use("/api/terminals", terminalRoutes);

// Handle unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found."
  });
});

app.listen(PORT, () => {
  console.log(`Menged API running at http://localhost:${PORT}`);
});