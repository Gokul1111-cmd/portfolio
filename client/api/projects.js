import pool from './db.js';

// Projects CRUD API (serverless) used by admin dashboard and public projects grid
export default async function handler(req, res) {
  // Ensure table exists (auto-setup for first run)
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        image TEXT,
        demoUrl TEXT,
        githubUrl TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tags JSONB DEFAULT '[]'::jsonb,
        highlights JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        accentColor TEXT,
        status TEXT,
        video TEXT
      );
    `);

    // Backfill new columns if table already existed
    await pool.query(`
      ALTER TABLE projects
        ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS accentColor TEXT,
        ADD COLUMN IF NOT EXISTS status TEXT,
        ADD COLUMN IF NOT EXISTS video TEXT;
    `);
  } catch (err) {
    console.error("Table creation error:", err);
  }

  // --- GET REQUEST: Fetch all projects ---
  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST REQUEST: Add a new project ---
  if (req.method === 'POST') {
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
      video = ""
    } = req.body;
    try {
      const { rows } = await pool.query(
        `INSERT INTO projects (
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
          video
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
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
          video
        ]
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- DELETE REQUEST: Remove a project ---
  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      await pool.query('DELETE FROM projects WHERE id = $1', [id]);
      return res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // --- PUT REQUEST: Update a project ---
  if (req.method === 'PUT') {
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
      video = ""
    } = req.body;

    try {
      const { rows } = await pool.query(
        `UPDATE projects SET 
          title = $1,
          description = $2,
          category = $3,
          image = $4,
          demoUrl = $5,
          githubUrl = $6,
          tags = $7,
          highlights = $8,
          featured = $9,
          accentColor = $10,
          status = $11,
          video = $12
         WHERE id = $13
         RETURNING *`,
        [
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
          id
        ]
      );
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}