import { adminDb } from "./firebase-admin.js";

// Skills CRUD API using Firebase Firestore Admin SDK
export default async function handler(req, res) {
  const skillsRef = adminDb.collection("skills");

  // --- GET REQUEST: Fetch all skills ---
  if (req.method === "GET") {
    try {
      const snapshot = await skillsRef.orderBy("createdAt", "desc").get();
      const skills = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json(skills);
    } catch (error) {
      console.error("GET skills error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST REQUEST: Add a new skill ---
  if (req.method === "POST") {
    const { name, category, level, icon, iconSize } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "name and category are required" });
    }

    try {
      const newSkill = {
        name,
        category,
        level: level || 50,
        icon: icon || "",
        iconSize: iconSize || 100,
        createdAt: new Date(),
      };

      const docRef = await skillsRef.add(newSkill);
      return res.status(201).json({ id: docRef.id, ...newSkill });
    } catch (error) {
      console.error("POST skill error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- DELETE REQUEST: Remove a skill ---
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id is required" });

    try {
      await skillsRef.doc(id).delete();
      return res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
      console.error("DELETE skill error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- PUT REQUEST: Update a skill ---
  if (req.method === "PUT") {
    const { id } = req.query;
    const { name, category, level, icon, iconSize } = req.body;

    if (!id) return res.status(400).json({ error: "id is required" });

    try {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (category !== undefined) updateData.category = category;
      if (level !== undefined) updateData.level = level;
      if (icon !== undefined) updateData.icon = icon;
      if (iconSize !== undefined) updateData.iconSize = iconSize;
      updateData.updatedAt = new Date();

      await skillsRef.doc(id).update(updateData);
      return res.status(200).json({ id, ...updateData });
    } catch (error) {
      console.error("PUT skill error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
