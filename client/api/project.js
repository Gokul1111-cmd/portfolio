import pool from './db.js';

export default async function handler(req, res) {
  // Ensure table exists (Auto-setup)
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
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
    const { title, description, category, image, demoUrl, githubUrl } = req.body;
    try {
      const { rows } = await pool.query(
        'INSERT INTO projects (title, description, category, image, demoUrl, githubUrl) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, description, category, image, demoUrl, githubUrl]
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

  return res.status(405).json({ error: 'Method not allowed' });
}