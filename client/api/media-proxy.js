/* eslint-env node */
// Consolidated Media Proxy API
// Handles: image proxy, storage proxy
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { type, url, name } = req.query || {};

    if (!type) {
        return res.status(400).json({ error: "type parameter is required (image|storage)" });
    }

    try {
        // IMAGE PROXY
        if (type === "image") {
            if (!url) {
                return res.status(400).json({ error: "url query parameter is required" });
            }

            const imageRes = await fetch(url);
            if (!imageRes.ok) {
                return res.status(imageRes.status).json({ error: `Failed to fetch image: ${imageRes.status}` });
            }

            const contentType = imageRes.headers.get("content-type") || "image/jpeg";
            const buffer = await imageRes.arrayBuffer();

            res.setHeader("Content-Type", contentType);
            res.setHeader("Cache-Control", "public, max-age=3600");
            return res.send(Buffer.from(buffer));
        }

        // STORAGE PROXY
        if (type === "storage") {
            if (!name) {
                return res.status(400).json({ error: "Missing 'name' parameter" });
            }

            const bucket = "gokul-portfolio-23143.firebasestorage.app";
            const storageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/static-sync%2F${name}.json?alt=media`;

            const response = await fetch(storageUrl);
            if (!response.ok) {
                return res.status(response.status).json({ error: "Storage fetch failed" });
            }

            const data = await response.json();
            res.setHeader("Cache-Control", "public, max-age=3600");
            return res.status(200).json(data);
        }

        return res.status(400).json({ error: "Invalid type. Use 'image' or 'storage'" });
    } catch (error) {
        console.error(`Media Proxy API error (${type}):`, error);
        return res.status(500).json({ error: error.message });
    }
}
