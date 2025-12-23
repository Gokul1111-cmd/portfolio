/* eslint-env node */
import express from "express";
import projectsHandler from "./api/projects.js";
import contentHandler from "./api/content.js";
import skillsHandler from "./api/skills.js";
import testimonialsHandler from "./api/testimonials.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow larger payloads for base64 testimonial images (up to 15 MB)
app.use(express.json({ limit: "15mb" }));

// Tiny wrapper so our serverless-style handlers work with express
const route = (handler) => async (req, res) => handler(req, res);

app.all("/api/projects", route(projectsHandler));
app.all("/api/content", route(contentHandler));
app.all("/api/skills", route(skillsHandler));
app.all("/api/testimonials", route(testimonialsHandler));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
