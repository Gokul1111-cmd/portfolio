/* eslint-env node */
import { adminDb, admin } from "../lib/firebase-admin.js";

// Consolidated Admin API
// Handles: sync, settings
export default async function handler(req, res) {
    const { action, target } = req.query || {};

    if (!action) {
        return res.status(400).json({ error: "action parameter is required (sync|settings)" });
    }

    try {
        // SYNC
        if (action === "sync") {
            if (req.method !== "POST") {
                return res.status(405).json({ error: "Method not allowed" });
            }

            const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || "gokul-portfolio-23143.firebasestorage.app";
            const bucket = admin.storage().bucket(bucketName);

            const COLLECTIONS = {
                certificates: () => adminDb.collection("certificates").orderBy("createdAt", "desc"),
                projects: () => adminDb.collection("projects").orderBy("created_at", "desc"),
                skills: () => adminDb.collection("skills").orderBy("createdAt", "desc"),
                testimonials: () => adminDb.collection("testimonials").orderBy("createdAt", "desc"),
            };

            const CONTENT_KEYS = ["hero", "about", "approach", "contact", "site", "timeline"];

            const fetchCollection = async (name) => {
                try {
                    const snap = await COLLECTIONS[name]().get();
                    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                } catch (err) {
                    console.warn(`Collection ${name} orderBy failed, fetching without sort`, err);
                    const snap = await adminDb.collection(name).get();
                    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
                }
            };

            const fetchContent = async () => {
                const result = {};
                for (const key of CONTENT_KEYS) {
                    try {
                        const doc = await adminDb.collection("content").doc(key).get();
                        if (doc.exists) {
                            result[key] = doc.data();
                        } else {
                            console.warn(`Content doc "${key}" not found, skipping`);
                        }
                    } catch (err) {
                        console.error(`Failed to fetch content "${key}":`, err.message);
                    }
                }
                return result;
            };

            const writeJson = async (path, data) => {
                const file = bucket.file(path);
                await file.save(JSON.stringify(data), {
                    contentType: "application/json",
                    cacheControl: "public, max-age=3600",
                    metadata: { cacheControl: "public, max-age=3600" },
                });
                try {
                    await file.makePublic();
                    console.log(`✅ Made public: ${path}`);
                } catch (err) {
                    console.warn(`⚠️ makePublic failed for ${path}, file is private:`, err.message);
                }
            };

            const targets = ["certificates", "projects", "skills", "testimonials", "content"];
            const toSync = target === "all" ? targets : targets.filter((t) => t === target);

            if (!toSync.length) {
                return res.status(400).json({ error: "Invalid target" });
            }

            const summary = {
                synced: [],
                errors: [],
                bucket: bucketName,
                generatedAt: Date.now(),
            };

            for (const t of toSync) {
                try {
                    if (t === "content") {
                        const data = await fetchContent();
                        await writeJson(`static-sync/${t}.json`, { generatedAt: Date.now(), data });
                        summary.synced.push({ target: t, count: Object.keys(data).length });
                    } else {
                        const data = await fetchCollection(t);
                        await writeJson(`static-sync/${t}.json`, { generatedAt: Date.now(), items: data });
                        summary.synced.push({ target: t, count: data.length });
                    }
                } catch (err) {
                    console.error(`Sync failed for ${t}`, err);
                    summary.errors.push({ target: t, message: err.message });
                }
            }

            const settingsRef = adminDb.collection("settings").doc("sync");
            await settingsRef.set(
                {
                    useSyncedData: true,
                    lastSyncedAt: Date.now(),
                    lastSummary: summary,
                },
                { merge: true }
            );

            return res.status(summary.errors.length ? 207 : 200).json(summary);
        }

        // SETTINGS
        if (action === "settings") {
            const settingsRef = adminDb.collection("settings").doc("sync");

            if (req.method === "GET") {
                const snap = await settingsRef.get();
                return res.status(200).json(snap.exists ? snap.data() : { useSyncedData: false });
            }

            if (req.method === "PUT") {
                const body = req.body || {};
                const update = {};
                if (body.useSyncedData !== undefined) update.useSyncedData = Boolean(body.useSyncedData);
                if (body.lastSyncedAt !== undefined) update.lastSyncedAt = body.lastSyncedAt;
                if (body.lastSummary !== undefined) update.lastSummary = body.lastSummary;
                await settingsRef.set(update, { merge: true });
                const snap = await settingsRef.get();
                return res.status(200).json(snap.data());
            }

            return res.status(405).json({ error: "Method not allowed" });
        }

        return res.status(400).json({ error: "Invalid action" });
    } catch (error) {
        console.error(`Admin API error (${action}):`, error);
        return res.status(500).json({ error: error.message });
    }
}
