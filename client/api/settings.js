/* eslint-env node */
import { adminDb } from "./firebase-admin.js";

const settingsRef = adminDb.collection("settings").doc("sync");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const snap = await settingsRef.get();
    return res
      .status(200)
      .json(snap.exists ? snap.data() : { useSyncedData: false });
  }

  if (req.method === "PUT") {
    const body = req.body || {};
    const update = {};
    if (body.useSyncedData !== undefined)
      update.useSyncedData = Boolean(body.useSyncedData);
    if (body.lastSyncedAt !== undefined)
      update.lastSyncedAt = body.lastSyncedAt;
    if (body.lastSummary !== undefined) update.lastSummary = body.lastSummary;
    await settingsRef.set(update, { merge: true });
    const snap = await settingsRef.get();
    return res.status(200).json(snap.data());
  }

  return res.status(405).json({ error: "Method not allowed" });
}
