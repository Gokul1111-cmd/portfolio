/* eslint-env node */
import { adminDb } from "../lib/firebase-admin.js";

const collection = adminDb.collection("newsletter");

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { email } = body;

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      // Check if email already exists
      const existing = await collection.where("email", "==", email.toLowerCase()).limit(1).get();
      if (!existing.empty) {
        return res.status(200).json({ 
          success: true, 
          message: "You're already subscribed!" 
        });
      }

      // Add new subscriber
      await collection.add({
        email: email.toLowerCase(),
        subscribedAt: new Date(),
        status: "active",
        source: "blog_newsletter_cta"
      });

      return res.status(200).json({ 
        success: true, 
        message: "Successfully subscribed!" 
      });

    } catch (error) {
      console.error("Newsletter subscription error:", error);
      return res.status(500).json({ error: "Subscription failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
