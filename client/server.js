/* eslint-env node */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import express from "express";
import projectsHandler from "./api/projects.js";
import contentHandler from "./api/content.js";
import skillsHandler from "./api/skills.js";
import testimonialsHandler from "./api/testimonials.js";
import certificatesHandler from "./api/certificates.js";
import syncHandler from "./api/sync.js";
import settingsHandler from "./api/settings.js";
import proxyImageHandler from "./api/proxy-image.js";
import storageProxyHandler from "./api/storage-proxy.js";
import commentsHandler from "./api/comments.js";
import blogHandler from "./api/blog.js";
import aiBlogHandler from "./api/ai-blog.js";
import blogInteractionsHandler from "./api/blog-interactions.js";

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
app.all("/api/comments", route(commentsHandler));
app.all("/api/blog", route(blogHandler));
app.all("/api/blog-interactions", route(blogInteractionsHandler));
app.all("/api/ai-blog", route(aiBlogHandler));
app.all("/api/certificates", route(certificatesHandler));
app.all("/api/sync", route(syncHandler));
app.all("/api/settings", route(settingsHandler));
app.get("/api/proxy-image", route(proxyImageHandler));
app.get("/api/storage-proxy", route(storageProxyHandler));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close());
process.on("SIGINT", () => server.close());
