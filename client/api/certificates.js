import { adminDb } from "./firebase-admin.js";

// Certificates CRUD API using Firebase Firestore Admin SDK
export default async function handler(req, res) {
  const certsRef = adminDb.collection("certificates");

  try {
    if (req.method === "GET") {
      const snapshot = await certsRef.orderBy("createdAt", "desc").get();
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(items);
    }

    if (req.method === "POST") {
      const {
        title,
        category,
        provider = "",
        fileName = "",
        url = "",
        type = "image",
        featured = false,
        tags = [],
      } = req.body || {};

      if (!title) return res.status(400).json({ error: "title is required" });
      const newDoc = {
        title,
        category: category || "",
        provider,
        fileName,
        url,
        type,
        featured: Boolean(featured),
        tags: Array.isArray(tags) ? tags : [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await certsRef.add(newDoc);
      return res.status(201).json({ id: docRef.id, ...newDoc });
    }

    if (req.method === "PUT") {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: "id is required" });
      const { title, category, provider, fileName, url, type, featured, tags } =
        req.body || {};

      const updateData = { updatedAt: new Date() };
      if (title !== undefined) updateData.title = title;
      if (category !== undefined) updateData.category = category;
      if (provider !== undefined) updateData.provider = provider;
      if (fileName !== undefined) updateData.fileName = fileName;
      if (url !== undefined) updateData.url = url;
      if (type !== undefined) updateData.type = type;
      if (featured !== undefined) updateData.featured = Boolean(featured);
      if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

      await certsRef.doc(id).update(updateData);
      return res.status(200).json({ id, ...updateData });
    }

    if (req.method === "DELETE") {
      const { id } = req.query || {};
      if (!id) return res.status(400).json({ error: "id is required" });
      await certsRef.doc(id).delete();
      return res.status(200).json({ message: "Deleted successfully" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Certificates API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
