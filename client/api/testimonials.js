import { adminDb } from './firebase-admin.js';

// Testimonials CRUD API using Firebase Firestore Admin SDK
export default async function handler(req, res) {
  const testimonialsRef = adminDb.collection('testimonials');

  // --- GET REQUEST: Fetch all testimonials ---
  if (req.method === 'GET') {
    try {
      const snapshot = await testimonialsRef.orderBy('createdAt', 'desc').get();
      const testimonials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return res.status(200).json(testimonials);
    } catch (error) {
      console.error('GET testimonials error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- POST REQUEST: Add a new testimonial ---
  if (req.method === 'POST') {
    const { name, role, relationship, link, content, rating, image } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ error: 'name and content are required' });
    }

    try {
      const newTestimonial = {
        name,
        role: role || '',
        relationship: relationship || '',
        link: link || '',
        content,
        rating: rating || 5,
        image: image || '',
        createdAt: new Date()
      };
      
      const docRef = await testimonialsRef.add(newTestimonial);
      return res.status(201).json({ id: docRef.id, ...newTestimonial });
    } catch (error) {
      console.error('POST testimonial error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- DELETE REQUEST: Remove a testimonial ---
  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });
    
    try {
      await testimonialsRef.doc(id).delete();
      return res.status(200).json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      console.error('DELETE testimonial error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // --- PUT REQUEST: Update a testimonial ---
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { name, role, relationship, link, content, rating, image } = req.body;
    
    if (!id) return res.status(400).json({ error: 'id is required' });

    try {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (role !== undefined) updateData.role = role;
      if (relationship !== undefined) updateData.relationship = relationship;
      if (link !== undefined) updateData.link = link;
      if (content !== undefined) updateData.content = content;
      if (rating !== undefined) updateData.rating = rating;
      if (image !== undefined) updateData.image = image;
      updateData.updatedAt = new Date();

      await testimonialsRef.doc(id).update(updateData);
      return res.status(200).json({ id, ...updateData });
    } catch (error) {
      console.error('PUT testimonial error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
