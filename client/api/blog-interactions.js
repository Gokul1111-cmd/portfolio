/* eslint-env node */
import { adminDb } from "./firebase-admin.js";

const collection = adminDb.collection("blogPosts");

export default async function handler(req, res) {
  const { method } = req;
  const { slug, action } = req.query;

  if (!slug) {
    return res.status(400).json({ error: "Missing slug" });
  }

  try {
    // Find the post
    const snapshot = await collection.where("slug", "==", slug).limit(1).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: "Post not found" });
    }

    const docRef = collection.doc(snapshot.docs[0].id);
    const doc = snapshot.docs[0];
    const data = doc.data();

    if (method === "POST") {
      // Increment view count
      if (action === "view") {
        const currentViews = Number(data.views) || 0;
        await docRef.update({
          views: currentViews + 1,
          updatedAt: new Date()
        });
        
        return res.status(200).json({ 
          views: currentViews + 1,
          success: true 
        });
      }

      // Toggle like (increment or decrement)
      if (action === "like") {
        const { increment = true } = req.body || {};
        const currentLikes = Number(data.likes) || 0;
        const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        
        await docRef.update({
          likes: newLikes,
          updatedAt: new Date()
        });
        
        return res.status(200).json({ 
          likes: newLikes,
          success: true 
        });
      }

      return res.status(400).json({ error: "Invalid action" });
    }

    if (method === "GET") {
      // Get current stats
      return res.status(200).json({
        views: Number(data.views) || 0,
        likes: Number(data.likes) || 0,
        comments: Number(data.comments) || 0
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Blog interaction error:", error);
    return res.status(500).json({ error: error.message });
  }
}
