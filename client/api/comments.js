import { admin, adminDb } from "./firebase-admin.js";

const collection = adminDb.collection("comments");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "slug is required" });
    try {
      let snapshot;
      try {
        snapshot = await collection
          .where("slug", "==", slug)
          .orderBy("createdAtMs", "asc")
          .get();
      } catch (primaryError) {
        console.warn("comments GET primary query failed, retrying without order", primaryError.message);
        snapshot = await collection.where("slug", "==", slug).get();
      }
      const comments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt:
            data.createdAt?.toDate?.() instanceof Date
              ? data.createdAt.toDate().toISOString()
              : data.createdAt,
        };
      });
      return res.status(200).json(comments);
    } catch (error) {
      console.error("GET comments error:", error);
      return res.status(200).json([]);
    }
  }

  if (req.method === "POST") {
    const { slug, author, text } = req.body || {};
    const trimmedText = (text || "").trim();
    const name = (author || "Guest").trim();

    if (!slug || !trimmedText) {
      return res.status(400).json({ error: "slug and text are required" });
    }

    try {
      const now = new Date();
      const newComment = {
        slug,
        author: name,
        text: trimmedText,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAtMs: now.getTime(),
      };

      const docRef = await collection.add(newComment);
      return res.status(201).json({
        id: docRef.id,
        ...newComment,
        createdAt: now.toISOString(),
      });
    } catch (error) {
      console.error("POST comment error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
