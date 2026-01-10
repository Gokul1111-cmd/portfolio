/* eslint-env node */
import { adminDb } from "../lib/firebase-admin.js";

const collection = adminDb.collection("blogPosts");

const normalizePost = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    publishedAt:
      data.publishedAt?.toDate?.() instanceof Date
        ? data.publishedAt.toDate().toISOString()
        : data.publishedAt,
    updatedAt:
      data.updatedAt?.toDate?.() instanceof Date
        ? data.updatedAt.toDate().toISOString()
        : data.updatedAt,
  };
};

const parseBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      console.error("Failed to parse body", error);
      return {};
    }
  }
  return req.body;
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { slug, limit = 12, cursor } = req.query;
    try {
      if (slug) {
        const snapshot = await collection.where("slug", "==", slug).limit(1).get();
        if (snapshot.empty) return res.status(404).json({ error: "Post not found" });
        const post = normalizePost(snapshot.docs[0]);
        return res.status(200).json({ post });
      }

      const limitNum = Number(limit) || 12;
      let queryRef = collection.orderBy("publishedAt", "desc").limit(limitNum);

      if (cursor) {
        const cursorDate = new Date(cursor);
        queryRef = queryRef.startAfter(cursorDate);
      }

      const snapshot = await queryRef.get();
      const posts = snapshot.docs.map(normalizePost);
      const nextCursor = snapshot.docs.length === limitNum ? posts[posts.length - 1]?.publishedAt : null;

      return res.status(200).json({ posts, nextCursor });
    } catch (error) {
      console.error("Blog API error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (method === "POST") {
    const body = parseBody(req);
    const {
      id,
      title,
      slug,
      excerpt = "",
      content = "",
      coverImage = "",
      tags = [],
      category = "",
      series = "",
      seriesOrder = "",
      seoTitle = "",
      seoDescription = "",
      canonical = "",
      status = "draft",
      publishedAt,
      readingTime = "—",
      views = 0,
      likes = 0,
      author,
      authorBio,
    } = body || {};

    if (!title || !slug) {
      return res.status(400).json({ error: "Title and slug are required" });
    }

    const now = new Date();

    try {
      let docRef;

      if (id) {
        docRef = collection.doc(id);
      } else {
        const existingSnap = await collection.where("slug", "==", slug).limit(1).get();
        docRef = existingSnap.empty ? collection.doc(slug) : collection.doc(existingSnap.docs[0].id);
      }

      await docRef.set(
        {
          title,
          slug,
          excerpt,
          content,
          coverImage,
          tags,
          category,
          series,
          seriesOrder,
          readingTime,
          views: Number(views) || 0,
          likes: Number(likes) || 0,
          author: author || (typeof process !== "undefined" ? process.env.BLOG_AUTHOR_NAME : "") || "Me",
          authorBio: authorBio || (typeof process !== "undefined" ? process.env.BLOG_AUTHOR_BIO : "") || "",
          seoTitle,
          seoDescription,
          canonical,
          status,
          publishedAt: status === "published" ? (publishedAt ? new Date(publishedAt) : now) : publishedAt ? new Date(publishedAt) : null,
          updatedAt: now,
        },
        { merge: true }
      );

      const saved = await docRef.get();
      return res.status(200).json(normalizePost(saved));
    } catch (error) {
      console.error("Blog save error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (method === "DELETE") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "Missing slug" });

    try {
      const snapshot = await collection.where("slug", "==", slug).limit(1).get();
      if (snapshot.empty) return res.status(404).json({ error: "Post not found" });
      await collection.doc(snapshot.docs[0].id).delete();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Blog delete error:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
