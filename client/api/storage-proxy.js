/* eslint-env node */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Missing 'name' parameter" });
  }

  const bucket = "gokul-portfolio-23143.firebasestorage.app";
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/static-sync%2F${name}.json?alt=media`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Storage fetch failed" });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: error.message });
  }
}
