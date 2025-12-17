import express from "express";
import dotenv from "dotenv";
import projectsHandler from "./api/projects.js";
import contentHandler from "./api/content.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Tiny wrapper so our serverless-style handlers work with express
const route = (handler) => async (req, res) => handler(req, res);

app.all("/api/projects", route(projectsHandler));
app.all("/api/content", route(contentHandler));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
