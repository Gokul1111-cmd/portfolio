/* eslint-env node */
// AI Blog Writing Assistant using Google Gemini API (Free tier) - REST API
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    action,
    topic,
    brief,
    content,
    selection,
    // Enhanced personal blog inputs
    blogType = "experience",
    tone = "conversational",
    person = "first",
    personalContext = "",
    keyTakeaways = "",
    challengesFaced = "",
    tipsAdvice = ""
  } = req.body || {};

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY not configured. Please add it to your .env.local file"
    });
  }

  console.log("AI Blog Request:", { action, topic: topic?.substring(0, 50) });
  console.log("API Key present:", !!process.env.GEMINI_API_KEY);

  try {
    let prompt = "";

    switch (action) {
      case "generate": {
        // Enhanced personal blog generation with authentic human voice
        const blogTypeDescriptions = {
          experience: "a personal experience story where the author shares what they built, tried, or faced",
          learning: "a learning journey documenting how the author learned something new",
          roadmap: "a roadmap or guide showing the author's path to mastering a skill",
          opinion: "a personal opinion or thoughts piece expressing the author's beliefs",
          tutorial: "a step-by-step tutorial teaching others how to do something",
          lessons: "a lessons learned article sharing discoveries and insights"
        };

        const toneInstructions = {
          casual: "very casual and friendly, like talking to a friend over coffee",
          conversational: "conversational and approachable, like a blog post or medium article",
          "semi-formal": "semi-formal but still personal and relatable"
        };

        const personPerspective = person === "first"
          ? "Write in FIRST PERSON using 'I', 'my', 'we'. Make it feel personal and authentic."
          : "Write in third person, but keep it relatable.";

        prompt = `You are a skilled blog writer who transforms raw, informal thoughts into engaging blog posts while preserving the author's authentic voice and personality.

**CONTEXT:**
Blog Type: ${blogTypeDescriptions[blogType] || blogTypeDescriptions.experience}
Title: ${topic || ""}
Tone: ${toneInstructions[tone] || toneInstructions.conversational}
Voice: ${personPerspective}

**AUTHOR'S RAW INPUT (informal, unpolished - PRESERVE THIS VOICE):**
${personalContext || brief || ""}

${keyTakeaways ? `**KEY TAKEAWAYS THE AUTHOR WANTS TO SHARE:**
${keyTakeaways}
` : ""}

${challengesFaced ? `**CHALLENGES THEY FACED:**
${challengesFaced}
` : ""}

${tipsAdvice ? `**TIPS & ADVICE THEY WANT TO GIVE:**
${tipsAdvice}
` : ""}

**YOUR TASK:**
Transform the author's informal thoughts into a compelling blog post that:

1. **PRESERVES AUTHENTICITY**: Keep the author's personality, casual language, and personal anecdotes. Don't make it sound corporate or overly polished.

2. **MAINTAINS VOICE**: If they said "i struggled with this" or "it was super hard", keep that energy. Use contractions (I'm, don't, it's), conversational phrases ("So here's what happened...", "Turns out...", "Honestly...").

3. **STRUCTURE WITH STORY**: 
   - Start with a hook (personal moment, frustration, or realization)
   - Share the journey chronologically or thematically
   - Include specific examples and details from their experience
   - End with reflection and advice

4. **ENHANCE, DON'T REWRITE**: Fix grammar and add structure, but keep their words and style. If they wrote informally, the blog should feel informal.

5. **MAKE IT HUMAN**: Add transitions like "So...", "But here's the thing...", "What I learned was...", "Looking back...". Include emotions (frustration, excitement, relief).

**FORMAT AS JSON:**
{
  "title": "Catchy, SEO-friendly title (50-60 chars) that captures the personal story",
  "seoTitle": "SEO variation with keywords",
  "content": "Full blog post in Markdown (800-1500 words). Use ##headings, **bold**, code blocks if relevant. Write like a human sharing their story, not a textbook.",
  "excerpt": "Compelling hook that makes people want to read (150-160 chars)",
  "category": "Most relevant category (e.g., Web Development, Career, Learning, Tutorial)",
  "tags": ["relevant", "searchable", "tags", "max 5-7"],
  "readingTime": "X min read",
  "canonicalUrl": "url-slug-from-title",
  "socialSnippets": {
    "linkedin": "LinkedIn post (exactly 100 words max) with hook + key insight + CTA to read full article on portfolio. Make it punchy and engaging. Include 2-3 line breaks for readability. End with: 'Read the full story on my portfolio: [PORTFOLIO_LINK]'",
    "medium": "Medium introduction (first 150-200 words from the blog) that hooks readers, followed by: 'This is an excerpt. Read the complete article with examples on my portfolio: [PORTFOLIO_LINK]'"
  }
}

**CRITICAL**: This should read like a REAL PERSON wrote it based on their actual experience. Don't make it sound like generic AI content. Use their exact examples, their struggles, their wins.

**IMPORTANT**: You MUST include the "socialSnippets" field with both "linkedin" and "medium" properties. This is required.

Return ONLY the JSON object with ALL fields including socialSnippets.`;
        break;
      }

      case "improve": {
        // Improve selected text while maintaining personal voice
        prompt = `You are editing a personal blog post. The author wants to improve this section while keeping their authentic voice and style.

**ORIGINAL TEXT:**
${selection || content || ""}

**YOUR TASK:**
Improve this text by:
- Fixing grammar and typos
- Making it flow better
- Adding clarity where needed
- Keeping the author's conversational tone and personality
- NOT making it sound corporate or overly formal
- Preserving first-person perspective if present
- Keeping casual language and contractions

Return ONLY the improved text, no explanations or markdown formatting.`;
        break;
      }

      case "continue": {
        // Continue writing from current content, maintaining style
        prompt = `You are continuing a personal blog post. Read the existing content and continue writing naturally in the same voice and style.

**EXISTING CONTENT:**
${content || ""}

**YOUR TASK:**
Add 2-3 more paragraphs that:
- Flow naturally from where the content left off
- Match the author's tone and writing style
- Continue the narrative or expand on the ideas
- Maintain first-person perspective if that's what they're using
- Keep the same level of formality/informality
- Add value (examples, insights, or next steps)

Return ONLY the continuation text (2-3 paragraphs), no explanations.`;
        break;
      }

      case "meta":
        // Generate title, description, and tags
        prompt = `Based on this blog content, generate:
1. A compelling SEO-friendly title (max 60 characters)
2. A concise meta description (max 160 characters)
3. 5-7 relevant tags (comma-separated)

Blog Content:
${content || topic || ""}

Format your response as JSON:
{
  "title": "...",
  "description": "...",
  "tags": ["tag1", "tag2", ...]
}`;
        break;

      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    // Call Gemini REST API
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Status:", response.status);
      console.error("Gemini API Error Response:", errorText);
      return res.status(response.status).json({
        error: `Gemini API error: ${response.status}`,
      });
    }

    const result = await response.json();
    let text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // For generate and meta actions, parse JSON
    if (action === "generate" || action === "meta") {
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          text = jsonMatch[1];
        }
        const parsed = JSON.parse(text);
        console.log("Parsed AI Response:", JSON.stringify(parsed, null, 2));
        console.log("Has socialSnippets?", !!parsed.socialSnippets);
        return res.status(200).json({ result: parsed });
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw text:", text);
        // Fallback: try to extract manually
        return res.status(200).json({
          result: {
            title: topic || "Untitled Blog Post",
            content: text,
            excerpt: brief || "",
            category: "General",
            tags: [],
            readingTime: "5 min read",
            canonicalUrl: topic?.toLowerCase().replace(/\s+/g, '-') || "blog-post",
            socialSnippets: {
              linkedin: `Check out my new blog post: "${topic || "Untitled Blog Post"}"\n\n${brief || "Read my latest insights and learnings."}\n\nRead the full story on my portfolio: [PORTFOLIO_LINK]`,
              medium: `${text.substring(0, 200)}...\n\nThis is an excerpt. Read the complete article with examples on my portfolio: [PORTFOLIO_LINK]`
            }
          }
        });
      }
    }

    return res.status(200).json({ result: text });

  } catch (error) {
    console.error("AI generation error:", error);
    return res.status(500).json({
      error: error.message || "AI generation failed"
    });
  }
}
