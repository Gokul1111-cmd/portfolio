/* eslint-env node */
// Proxy endpoint to fetch Firebase Storage images server-side, bypassing CORS for localhost development.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "url query parameter is required" });
  }

  try {
    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      return res
        .status(imageRes.status)
        .json({ error: `Failed to fetch image: ${imageRes.status}` });
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const buffer = await imageRes.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("Proxy image fetch failed", error);
    res.status(500).json({ error: error.message });
  }
}
