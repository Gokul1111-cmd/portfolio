/* eslint-env node */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import express from "express";
import projectsHandler from "./api/projects.js";
import portfolioDataHandler from "./api/portfolio-data.js";
import blogHandler from "./api/blog.js";
import blogDataHandler from "./api/blog-data.js";
import aiBlogHandler from "./api/ai-blog.js";
import mediaProxyHandler from "./api/media-proxy.js";
import adminHandler from "./api/admin.js";
import newsletterHandler from "./api/newsletter.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Allow larger payloads for base64 testimonial images (up to 15 MB)
app.use(express.json({ limit: "15mb" }));

// Tiny wrapper so our serverless-style handlers work with express
const route = (handler) => async (req, res) => handler(req, res);

// New consolidated endpoints
app.all("/api/projects", route(projectsHandler));
app.all("/api/portfolio-data", route(portfolioDataHandler));
app.all("/api/blog", route(blogHandler));
app.all("/api/blog-data", route(blogDataHandler));
app.all("/api/ai-blog", route(aiBlogHandler));
app.all("/api/media-proxy", route(mediaProxyHandler));
app.all("/api/admin", route(adminHandler));
app.all("/api/newsletter", route(newsletterHandler));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
