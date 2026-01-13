/* eslint-env node */
import { admin, adminDb } from "../lib/firebase-admin.js";

// Consolidated Blog Data API
// Handles: views, likes, comments
export default async function handler(req, res) {
    const { action, slug } = req.query || {};

    if (!action) {
        return res.status(400).json({ error: "action parameter is required (view|like|stats|comments|comment)" });
    }

    try {
        // VIEW INCREMENT
        if (action === "view") {
            if (!slug) return res.status(400).json({ error: "slug is required" });
            const collection = adminDb.collection("blogPosts");
            const snapshot = await collection.where("slug", "==", slug).limit(1).get();

            if (snapshot.empty) {
                return res.status(404).json({ error: "Post not found" });
            }

            const docRef = collection.doc(snapshot.docs[0].id);
            const data = snapshot.docs[0].data();
            const currentViews = Number(data.views) || 0;

            await docRef.update({
                views: currentViews + 1,
                updatedAt: new Date()
            });

            return res.status(200).json({ views: currentViews + 1, success: true });
        }

        // LIKE TOGGLE
        if (action === "like") {
            if (!slug) return res.status(400).json({ error: "slug is required" });
            const collection = adminDb.collection("blogPosts");
            const snapshot = await collection.where("slug", "==", slug).limit(1).get();

            if (snapshot.empty) {
                return res.status(404).json({ error: "Post not found" });
            }

            const docRef = collection.doc(snapshot.docs[0].id);
            const data = snapshot.docs[0].data();
            const { increment = true } = req.body || {};
            const currentLikes = Number(data.likes) || 0;
            const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);

            await docRef.update({
                likes: newLikes,
                updatedAt: new Date()
            });

            return res.status(200).json({ likes: newLikes, success: true });
        }

        // GET STATS
        if (action === "stats") {
            if (!slug) return res.status(400).json({ error: "slug is required" });
            const collection = adminDb.collection("blogPosts");
            const snapshot = await collection.where("slug", "==", slug).limit(1).get();

            if (snapshot.empty) {
                return res.status(404).json({ error: "Post not found" });
            }

            const data = snapshot.docs[0].data();
            return res.status(200).json({
                views: Number(data.views) || 0,
                likes: Number(data.likes) || 0,
                comments: Number(data.comments) || 0
            });
        }

        // GET COMMENTS
        if (action === "comments") {
            if (!slug) return res.status(400).json({ error: "slug is required" });
            const collection = adminDb.collection("comments");

            let snapshot;
            try {
                snapshot = await collection
                    .where("slug", "==", slug)
                    .orderBy("createdAtMs", "asc")
                    .get();
            } catch (primaryError) {
                console.warn("comments GET primary query failed, retrying without order", primaryError.message);
                snapshot = await collection.where("slug", "==", slug).get();
            }

            const comments = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate?.() instanceof Date
                        ? data.createdAt.toDate().toISOString()
                        : data.createdAt,
                };
            });

            return res.status(200).json(comments);
        }

        // POST COMMENT
        if (action === "comment") {
            if (req.method !== "POST") {
                return res.status(405).json({ error: "Method not allowed" });
            }

            const { slug: bodySlug, author, text } = req.body || {};
            const commentSlug = bodySlug || slug;
            const trimmedText = (text || "").trim();
            const name = (author || "Guest").trim();

            if (!commentSlug || !trimmedText) {
                return res.status(400).json({ error: "slug and text are required" });
            }

            const collection = adminDb.collection("comments");
            const now = new Date();
            const newComment = {
                slug: commentSlug,
                author: name,
                text: trimmedText,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                createdAtMs: now.getTime(),
            };

            const docRef = await collection.add(newComment);
            return res.status(201).json({
                id: docRef.id,
                ...newComment,
                createdAt: now.toISOString(),
            });
        }

        return res.status(400).json({ error: "Invalid action" });
    } catch (error) {
        console.error(`Blog Data API error (${action}):`, error);
        return res.status(500).json({ error: error.message });
    }
}
