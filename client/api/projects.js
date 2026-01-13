import { adminDb } from "../lib/firebase-admin.js";

// Projects CRUD API using Firebase Firestore Admin SDK
export default async function handler(req, res) {
  // Set CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const projectsRef = adminDb.collection("projects");

  // --- GET REQUEST: Fetch all projects ---
  if (req.method === "GET") {
    try {
      const snapshot = await projectsRef.orderBy("created_at", "desc").get();
      const projects = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Remove any 'id' field from the document data to avoid conflicts
        delete data.id;
        return {
          id: doc.id, // Always use Firestore document ID
          ...data,
        };
      });
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
    
    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      await projectsRef.doc(id).delete();
      return res.status(200).json({ message: "Project deleted", id });
    } catch (error) {
      console.error("DELETE project error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- PUT REQUEST: Update a project ---
  if (req.method === "PUT") {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    try {
      // Check if document exists
      const docSnapshot = await projectsRef.doc(id).get();
      console.log(`[PUT] Checking project ID: ${id}, exists: ${docSnapshot.exists}`);
      
      if (!docSnapshot.exists) {
        // Log all existing project IDs for debugging
        const allProjects = await projectsRef.get();
        const existingIds = allProjects.docs.map(doc => doc.id);
        console.log('[PUT] Project not found. Existing IDs:', existingIds);
        return res.status(404).json({ 
          error: "Project not found", 
          requestedId: id,
          existingIds: existingIds 
        });
      }

      const {
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
      } = req.body;

      // Only update fields that are provided
      const updated = {};
      if (title !== undefined) updated.title = title;
      if (description !== undefined) updated.description = description;
      if (category !== undefined) updated.category = category;
      if (image !== undefined) updated.image = image;
      if (demoUrl !== undefined) updated.demoUrl = demoUrl;
      if (githubUrl !== undefined) updated.githubUrl = githubUrl;
      if (tags !== undefined) updated.tags = Array.isArray(tags) ? tags : [];
      if (highlights !== undefined) updated.highlights = Array.isArray(highlights) ? highlights : [];
      if (featured !== undefined) updated.featured = Boolean(featured);
      if (accentColor !== undefined) updated.accentColor = accentColor;
      if (status !== undefined) updated.status = status;
      if (video !== undefined) updated.video = video;
      
      updated.updated_at = new Date();

      await projectsRef.doc(id).update(updated);
      return res.status(200).json({ id, ...updated });
    } catch (error) {
      console.error("PUT project error:", error);
      return res.status(500).json({ error: error.message, details: error.toString() });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
