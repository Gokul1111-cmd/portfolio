import { adminDb } from "../lib/firebase-admin.js";

// Consolidated Portfolio Data API
// Handles: skills, certificates, testimonials, content
export default async function handler(req, res) {
    const { type, id, key } = req.query || {};

    if (!type) {
        return res.status(400).json({ error: "type parameter is required (skills|certificates|testimonials|content)" });
    }

    try {
        // SKILLS
        if (type === "skills") {
            const skillsRef = adminDb.collection("skills");

            if (req.method === "GET") {
                const snapshot = await skillsRef.orderBy("createdAt", "desc").get();
                const skills = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                return res.status(200).json(skills);
            }

            if (req.method === "POST") {
                const { name, category, level, icon, iconSize } = req.body;
                if (!name || !category) {
                    return res.status(400).json({ error: "name and category are required" });
                }
                const newSkill = {
                    name, category,
                    level: level || 50,
                    icon: icon || "",
                    iconSize: iconSize || 100,
                    createdAt: new Date(),
                };
                const docRef = await skillsRef.add(newSkill);
                return res.status(201).json({ id: docRef.id, ...newSkill });
            }

            if (req.method === "PUT") {
                if (!id) return res.status(400).json({ error: "id is required" });
                const { name, category, level, icon, iconSize } = req.body;
                const updateData = { updatedAt: new Date() };
                if (name !== undefined) updateData.name = name;
                if (category !== undefined) updateData.category = category;
                if (level !== undefined) updateData.level = level;
                if (icon !== undefined) updateData.icon = icon;
                if (iconSize !== undefined) updateData.iconSize = iconSize;
                await skillsRef.doc(id).update(updateData);
                return res.status(200).json({ id, ...updateData });
            }

            if (req.method === "DELETE") {
                if (!id) return res.status(400).json({ error: "id is required" });
                await skillsRef.doc(id).delete();
                return res.status(200).json({ message: "Skill deleted successfully" });
            }
        }

        // CERTIFICATES
        if (type === "certificates") {
            const certsRef = adminDb.collection("certificates");

            if (req.method === "GET") {
                const snapshot = await certsRef.get();
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                // Sort by order field if it exists, otherwise by createdAt desc
                items.sort((a, b) => {
                    if (a.order !== undefined && b.order !== undefined) {
                        return a.order - b.order;
                    }
                    if (a.order !== undefined) return -1;
                    if (b.order !== undefined) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                return res.status(200).json(items);
            }

            if (req.method === "POST") {
                const { title, category, provider = "", fileName = "", url = "", type: certType = "image", featured = false, tags = [] } = req.body || {};
                if (!title) return res.status(400).json({ error: "title is required" });
                const newDoc = {
                    title, category: category || "", provider, fileName, url,
                    type: certType, featured: Boolean(featured),
                    tags: Array.isArray(tags) ? tags : [],
                    createdAt: new Date(), updatedAt: new Date(),
                };
                const docRef = await certsRef.add(newDoc);
                return res.status(201).json({ id: docRef.id, ...newDoc });
            }

            if (req.method === "PUT") {
                if (!id) return res.status(400).json({ error: "id is required" });
                const { title, category, provider, fileName, url, type: certType, featured, tags, order } = req.body || {};
                const updateData = { updatedAt: new Date() };
                if (title !== undefined) updateData.title = title;
                if (category !== undefined) updateData.category = category;
                if (provider !== undefined) updateData.provider = provider;
                if (fileName !== undefined) updateData.fileName = fileName;
                if (url !== undefined) updateData.url = url;
                if (certType !== undefined) updateData.type = certType;
                if (featured !== undefined) updateData.featured = Boolean(featured);
                if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
                if (order !== undefined) updateData.order = order;
                await certsRef.doc(id).update(updateData);
                return res.status(200).json({ id, ...updateData });
            }

            if (req.method === "DELETE") {
                if (!id) return res.status(400).json({ error: "id is required" });
                await certsRef.doc(id).delete();
                return res.status(200).json({ message: "Deleted successfully" });
            }
        }

        // TESTIMONIALS
        if (type === "testimonials") {
            const testimonialsRef = adminDb.collection("testimonials");

            if (req.method === "GET") {
                const snapshot = await testimonialsRef.orderBy("createdAt", "desc").get();
                const testimonials = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                return res.status(200).json(testimonials);
            }

            if (req.method === "POST") {
                const { name, role, relationship, link, content, rating, image } = req.body;
                if (!name || !content) {
                    return res.status(400).json({ error: "name and content are required" });
                }
                const newTestimonial = {
                    name, role: role || "", relationship: relationship || "",
                    link: link || "", content, rating: rating || 5,
                    image: image || "", createdAt: new Date(),
                };
                const docRef = await testimonialsRef.add(newTestimonial);
                return res.status(201).json({ id: docRef.id, ...newTestimonial });
            }

            if (req.method === "PUT") {
                if (!id) return res.status(400).json({ error: "id is required" });
                const { name, role, relationship, link, content, rating, image } = req.body;
                const updateData = { updatedAt: new Date() };
                if (name !== undefined) updateData.name = name;
                if (role !== undefined) updateData.role = role;
                if (relationship !== undefined) updateData.relationship = relationship;
                if (link !== undefined) updateData.link = link;
                if (content !== undefined) updateData.content = content;
                if (rating !== undefined) updateData.rating = rating;
                if (image !== undefined) updateData.image = image;
                await testimonialsRef.doc(id).update(updateData);
                return res.status(200).json({ id, ...updateData });
            }

            if (req.method === "DELETE") {
                if (!id) return res.status(400).json({ error: "id is required" });
                await testimonialsRef.doc(id).delete();
                return res.status(200).json({ message: "Testimonial deleted successfully" });
            }
        }

        // CONTENT
        if (type === "content") {
            if (req.method === "GET") {
                if (key) {
                    const docSnap = await adminDb.collection("content").doc(key).get();
                    if (docSnap.exists) {
                        return res.status(200).json({ data: docSnap.data() });
                    } else {
                        return res.status(200).json({});
                    }
                }
                const snapshot = await adminDb.collection("content").get();
                const rows = snapshot.docs.map((doc) => ({ key: doc.id, data: doc.data() }));
                return res.status(200).json(rows);
            }

            if (req.method === "PUT" || req.method === "POST") {
                if (!key) return res.status(400).json({ error: "key is required" });
                const { data } = req.body || {};
                if (!data) return res.status(400).json({ error: "data is required" });
                await adminDb.collection("content").doc(key).set(data, { merge: true });
                return res.status(200).json({ key, data, updated_at: new Date().toISOString() });
            }
        }

        return res.status(405).json({ error: "Method not allowed" });
    } catch (error) {
        console.error(`Portfolio Data API error (${type}):`, error);
        return res.status(500).json({ error: error.message });
    }
}
