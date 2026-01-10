import { adminDb } from "../lib/firebase-admin.js";

// Projects CRUD API using Firebase Firestore Admin SDK
export default async function handler(req, res) {
  const projectsRef = adminDb.collection("projects");

  // --- GET REQUEST: Fetch all projects ---
  if (req.method === "GET") {
    try {
      const snapshot = await projectsRef.orderBy("created_at", "desc").get();
      const projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return res.status(200).json(projects);
    } catch (error) {
      console.error("GET projects error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST REQUEST: Add a new project ---
  if (req.method === "POST") {
    const {
      title,
      description,
      category,
      image,
      demoUrl,
      githubUrl,
      tags = [],
      highlights = [],
      featured = false,
      accentColor = "from-blue-500 to-cyan-600",
      status = "Live",
      video = "",
    } = req.body;

    try {
      const newProject = {
        title,
        description,
        category,
        image,
        demoUrl,
        githubUrl,
        tags,
        highlights,
        featured,
        accentColor,
        status,
        video,
        created_at: new Date(),
      };

      const docRef = await projectsRef.add(newProject);
      return res.status(201).json({ id: docRef.id, ...newProject });
    } catch (error) {
      console.error("POST project error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- DELETE REQUEST: Remove a project ---
  if (req.method === "DELETE") {
    const { id } = req.query;
    try {
      await projectsRef.doc(id).delete();
      return res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      console.error("DELETE project error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- PUT REQUEST: Update a project ---
  if (req.method === "PUT") {
    const { id } = req.query;
    const {
      title,
      description,
      category,
      image,
      demoUrl,
      githubUrl,
      tags = [],
      highlights = [],
      featured = false,
      accentColor = "from-blue-500 to-cyan-600",
      status = "Live",
      video = "",
    } = req.body;

    try {
      const updated = {
        title,
        description,
        category,
        image,
        demoUrl,
        githubUrl,
        tags,
        highlights,
        featured,
        accentColor,
        status,
        video,
      };

      await projectsRef.doc(id).update(updated);
      return res.status(200).json({ id, ...updated });
    } catch (error) {
      console.error("PUT project error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
