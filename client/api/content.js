import { adminDb } from './firebase-admin.js';

// Simple key-value content store using Firestore Admin SDK
export default async function handler(req, res) {
  const { key } = req.query || {};

  if (req.method === 'GET') {
    try {
      if (key) {
        // Get specific content by key
        const docSnap = await adminDb.collection('content').doc(key).get();
        
        if (docSnap.exists) {
          return res.status(200).json({ data: docSnap.data() });
        } else {
          return res.status(200).json({});
        }
      }
      
      // Get all content
      const snapshot = await adminDb.collection('content').get();
      const rows = snapshot.docs.map(doc => ({
        key: doc.id,
        data: doc.data()
      }));
      return res.status(200).json(rows);
    } catch (error) {
      console.error('GET content error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    if (!key) return res.status(400).json({ error: 'key is required' });
    const { data } = req.body || {};
    if (!data) return res.status(400).json({ error: 'data is required' });

    try {
      await adminDb.collection('content').doc(key).set(data, { merge: true });
      
      return res.status(200).json({ 
        key, 
        data, 
        updated_at: new Date().toISOString() 
      });
    } catch (error) {
      console.error('PUT content error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
