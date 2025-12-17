import pool from './db.js';

// Simple key-value content store: key TEXT primary key, data JSONB
export default async function handler(req, res) {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('content table creation error:', err);
  }

  const { key } = req.query || {};

  if (req.method === 'GET') {
    try {
      if (key) {
        const { rows } = await pool.query('SELECT data FROM site_content WHERE key = $1', [key]);
        const row = rows[0];
        return res.status(200).json(row ? row : {});
      }
      const { rows } = await pool.query('SELECT key, data FROM site_content');
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!key) return res.status(400).json({ error: 'key is required' });
    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });

    try {
      const { rows } = await pool.query(
        `INSERT INTO site_content (key, data, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
         RETURNING key, data, updated_at`,
        [key, data]
      );
      return res.status(200).json(rows[0]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
