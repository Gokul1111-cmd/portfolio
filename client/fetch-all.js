/* eslint-env node */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { adminDb, admin } from "./api/firebase-admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// If nothing is provided via env or app options, we fall back to the known bucket.
// Update this to match your Firebase Storage bucket if different.
const FALLBACK_BUCKET = "gokul-portfolio-23143.firebasestorage.app";

const appOptions = admin.app().options || {};
const projectId =
  appOptions.projectId ||
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT;

const bucketName =
  appOptions.storageBucket ||
  process.env.FIREBASE_STORAGE_BUCKET ||
  (projectId ? `${projectId}.appspot.com` : "") ||
  FALLBACK_BUCKET;

const isTimestamp = (v) => v instanceof admin.firestore.Timestamp;

const normalize = (value) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(normalize);
  if (isTimestamp(value)) return value.toDate().toISOString();
  if (typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = normalize(v);
    }
    return out;
  }
  return value;
};

async function fetchFirestore() {
  const result = {};
  const collections = await adminDb.listCollections();
  for (const col of collections) {
    const snap = await col.get();
    result[col.id] = snap.docs.map((doc) => ({
      id: doc.id,
      ...normalize(doc.data()),
    }));
  }
  return result;
}

async function fetchStorage() {
  if (!bucketName) {
    throw new Error(
      "Storage bucket name is missing. Set FIREBASE_STORAGE_BUCKET or include storageBucket in firebase-admin initialization.",
    );
  }

  const bucket = admin.storage().bucket(bucketName);
  try {
    const [files] = await bucket.getFiles();
    return {
      bucket: bucket.name,
      files: files.map((f) => ({
        name: f.name,
        size: Number(f.metadata?.size || 0),
        contentType: f.metadata?.contentType || null,
        updated: f.metadata?.updated || null,
        md5Hash: f.metadata?.md5Hash || null,
      })),
    };
  } catch (err) {
    console.error("⚠️  Storage fetch failed:", err.message);
    return { bucket: bucket.name, files: [], error: err.message };
  }
}

async function main() {
  console.log("📥 Fetching Firestore and Storage...");
  const [firestore, storage] = await Promise.all([
    fetchFirestore(),
    fetchStorage(),
  ]);

  const output = {
    fetchedAt: new Date().toISOString(),
    firestore,
    storage,
  };

  const outPath = path.join(__dirname, "fetched-data.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`✅ Data written to ${outPath}`);
}

main().catch((err) => {
  console.error("❌ Fetch failed:", err);
  process.exit(1);
});
