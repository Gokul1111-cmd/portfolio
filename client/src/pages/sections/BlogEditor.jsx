import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  Search,
  X,
  Save,
  Send,
  Image as ImageIcon,
  Copy,
  Sparkles,
  Wand2,
  ArrowRight,
  Loader2,
  Linkedin,
  Upload,
  GripVertical,
} from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebaseClient";

export const BlogEditor = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const coverInputRef = useRef(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const contentTextareaRef = useRef(null);

  // Editor form state
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: [],
    category: "",
    series: "",
    seriesOrder: "",
    readingTime: "",
    views: 0,
    likes: 0,
    author: "",
    authorBio: "",
    seoTitle: "",
    seoDescription: "",
    canonical: "",
    status: "draft",
  });

  const [newTag, setNewTag] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showVisualEditor, setShowVisualEditor] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiBrief, setAiBrief] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // Enhanced AI inputs for personal voice
  const [blogType, setBlogType] = useState("experience");
  const [blogTone, setBlogTone] = useState("conversational");
  const [blogPerson, setBlogPerson] = useState("first");
  const [personalContext, setPersonalContext] = useState("");
  const [keyTakeaways, setKeyTakeaways] = useState("");
  const [challengesFaced, setChallengesFaced] = useState("");
  const [tipsAdvice, setTipsAdvice] = useState("");
  
  // Social media snippets from AI
  const [socialSnippets, setSocialSnippets] = useState(null);
  const [showSnippets, setShowSnippets] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/blog?limit=50");
        if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
        const data = await res.json();
        setPosts(Array.isArray(data?.posts) ? data.posts : []);
      } catch (err) {
        console.error("BlogEditor fetch error", err);
        setError(err.message);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = posts;

    // Filter by status
    if (filter === "published") {
      result = result.filter((p) => p.status === "published");
    } else if (filter === "draft") {
      result = result.filter((p) => p.status === "draft");
    } else if (filter === "featured") {
      result = result.filter((p) => p.featured);
    }

    // Search
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return result;
  }, [filter, searchQuery, posts]);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
      views: posts.reduce((sum, p) => sum + (p.views || 0), 0),
      likes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    };
  }, [posts]);

  const handleNewPost = () => {
    setFormData({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      tags: [],
      category: "",
      series: "",
      seriesOrder: "",
      readingTime: "",
      views: 0,
      likes: 0,
      author: "",
      authorBio: "",
      seoTitle: "",
      seoDescription: "",
      canonical: "",
      status: "draft",
    });
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post) => {
    setFormData({
      id: post.id || "",
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      tags: post.tags || [],
      category: post.category || "",
      series: post.series || "",
      seriesOrder: post.seriesOrder || "",
      readingTime: post.readingTime || "",
      views: post.views || 0,
      likes: post.likes || 0,
      author: post.author || "",
      authorBio: post.authorBio || "",
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      canonical: post.canonical || "",
      status: post.status || "draft",
    });
    setEditingPost(post);
    setShowEditor(true);
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.toLowerCase()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Parse content blocks (text and images)
  const parseContentBlocks = (content) => {
    const blocks = [];
    const parts = content.split(/(!\[[^\]]*\]\([^)]+\)(?:\{width:\d+\})?)/);
    
    parts.forEach((part) => {
      if (part.trim()) {
        const imageMatch = part.match(/^!\[([^\]]*)\]\(([^)]+)\)(?:\{width:(\d+)\})?$/);
        if (imageMatch) {
          blocks.push({
            type: 'image',
            alt: imageMatch[1],
            url: imageMatch[2],
            width: imageMatch[3] ? parseInt(imageMatch[3]) : 800,
          });
        } else {
          blocks.push({ type: 'text', content: part });
        }
      }
    });
    return blocks;
  };

  const blocksToContent = (blocks) => {
    return blocks.map(block => {
      if (block.type === 'image') {
        return `![${block.alt}](${block.url}){width:${block.width}}`;
      }
      return block.content;
    }).join('');
  };

  const updateImageWidth = (index, newWidth) => {
    const blocks = parseContentBlocks(formData.content);
    let imageCount = 0;
    blocks.forEach((block, i) => {
      if (block.type === 'image') {
        if (imageCount === index) {
          blocks[i].width = Math.max(200, Math.min(1200, newWidth));
        }
        imageCount++;
      }
    });
    setFormData({ ...formData, content: blocksToContent(blocks) });
  };

  const moveImage = (fromIndex, toIndex) => {
    const blocks = parseContentBlocks(formData.content);
    const imageBlocks = blocks.filter(b => b.type === 'image');
    const textBlocks = blocks.filter(b => b.type === 'text');
    
    // Swap images
    const [movedImage] = imageBlocks.splice(fromIndex, 1);
    imageBlocks.splice(toIndex, 0, movedImage);
    
    // Rebuild content with images redistributed
    const newBlocks = [];
    let imageIndex = 0;
    blocks.forEach(block => {
      if (block.type === 'image') {
        if (imageIndex < imageBlocks.length) {
          newBlocks.push(imageBlocks[imageIndex++]);
        }
      } else {
        newBlocks.push(block);
      }
    });
    
    setFormData({ ...formData, content: blocksToContent(newBlocks) });
  };

  const insertImageAtBlockIndex = (imageIndex, targetBlockIndex) => {
    const blocks = parseContentBlocks(formData.content);
    
    // Find the image
    let currentImageIndex = 0;
    let imageBlock = null;
    let imageBlockIndex = -1;
    
    blocks.forEach((block, idx) => {
      if (block.type === 'image') {
        if (currentImageIndex === imageIndex) {
          imageBlock = block;
          imageBlockIndex = idx;
        }
        currentImageIndex++;
      }
    });
    
    if (!imageBlock || imageBlockIndex === -1) return;
    
    // Remove from current position
    blocks.splice(imageBlockIndex, 1);
    
    // Adjust target index if needed
    let insertIndex = targetBlockIndex;
    if (imageBlockIndex < targetBlockIndex) {
      insertIndex--;
    }
    
    // Insert at new position
    blocks.splice(insertIndex, 0, imageBlock);
    
    setFormData({ ...formData, content: blocksToContent(blocks) });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageUploadError("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setImageUploadError("");

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const slug = formData.slug || "article";
      const storagePath = `blog-articles/${slug}/${fileName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      // Insert markdown image syntax at cursor position in content with default width
      const altText = file.name.split(".")[0].replace(/[-_]/g, " ");
      const imageMarkdown = `![${altText}](${downloadUrl}){width:800}`;
      const currentContent = formData.content || "";
      
      // Get cursor position from textarea
      const textarea = contentTextareaRef.current;
      let updatedContent;
      
      if (textarea) {
        const cursorPos = textarea.selectionStart || 0;
        const beforeCursor = currentContent.substring(0, cursorPos);
        const afterCursor = currentContent.substring(cursorPos);
        
        // Insert image at cursor position with newlines
        updatedContent = beforeCursor + "\n\n" + imageMarkdown + "\n\n" + afterCursor;
        
        // Set content and restore cursor position after the inserted image
        setFormData((prev) => ({
          ...prev,
          content: updatedContent,
        }));
        
        // Restore focus and set cursor position after the inserted image
        setTimeout(() => {
          if (textarea) {
            textarea.focus();
            const newCursorPos = cursorPos + imageMarkdown.length + 4; // +4 for \n\n before and after
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      } else {
        // Fallback: append to end if textarea ref not available
        updatedContent = currentContent + "\n\n" + imageMarkdown + "\n\n";
        setFormData((prev) => ({
          ...prev,
          content: updatedContent,
        }));
      }

      console.log("Image uploaded successfully:", downloadUrl);
    } catch (err) {
      console.error("Image upload error:", err);
      setImageUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  // Handle video upload (MP4, WebM) and GIF upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setVideoUploadError('Please upload MP4, WebM, or GIF files only');
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for GIFs)
    const maxSize = file.type === 'image/gif' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setVideoUploadError(`File too large. Max size: ${file.type === 'image/gif' ? '10MB' : '50MB'}`);
      return;
    }

    setUploadingVideo(true);
    setVideoUploadError('');

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const slug = formData.slug || 'article';
      const storagePath = `blog-articles/${slug}/${fileName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      // Insert video or GIF markdown at cursor
      const altText = file.name.split('.')[0].replace(/[-_]/g, ' ');
      const isGif = file.type === 'image/gif';
      const mediaMarkdown = isGif 
        ? `![${altText}](${downloadUrl}){width:500}`
        : `@video[${altText}](${downloadUrl}){width:600}`;
      
      const currentContent = formData.content || '';
      const textarea = contentTextareaRef.current;
      let updatedContent;
      
      if (textarea) {
        const cursorPos = textarea.selectionStart || 0;
        const beforeCursor = currentContent.substring(0, cursorPos);
        const afterCursor = currentContent.substring(cursorPos);
        updatedContent = beforeCursor + '\n\n' + mediaMarkdown + '\n\n' + afterCursor;
        
        setFormData((prev) => ({ ...prev, content: updatedContent }));
        
        setTimeout(() => {
          if (textarea) {
            textarea.focus();
            const newCursorPos = cursorPos + mediaMarkdown.length + 4;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }
        }, 0);
      } else {
        updatedContent = currentContent + '\n\n' + mediaMarkdown + '\n\n';
        setFormData((prev) => ({ ...prev, content: updatedContent }));
      }

      console.log(`${isGif ? 'GIF' : 'Video'} uploaded successfully:`, downloadUrl);
    } catch (err) {
      console.error('Video/GIF upload error:', err);
      setVideoUploadError('Failed to upload. Please try again.');
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }
    }
  };

  // Quick insert markdown helpers
  const insertMarkdown = (syntax) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart || 0;
    const currentContent = formData.content || '';
    const beforeCursor = currentContent.substring(0, cursorPos);
    const afterCursor = currentContent.substring(cursorPos);
    
    let insertText = '';
    let cursorOffset = 0;
    
    switch(syntax) {
      case 'giphy':
        insertText = '@video[GIF description](https://giphy.com/embed/YOUR_GIPHY_ID){width:450}';
        cursorOffset = 53; // Position cursor at YOUR_GIPHY_ID
        break;
      case 'video-url':
        insertText = '@video[Video description](https://example.com/video.mp4){width:600}';
        cursorOffset = 23; // Position cursor at URL
        break;
      case 'gif-url':
        insertText = '![GIF description](https://example.com/meme.gif){width:400}';
        cursorOffset = 19; // Position cursor at URL
        break;
      default:
        return;
    }
    
    const updatedContent = beforeCursor + '\n\n' + insertText + '\n\n' + afterCursor;
    setFormData((prev) => ({ ...prev, content: updatedContent }));
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = cursorPos + 2 + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos + (syntax === 'giphy' ? 13 : syntax === 'video-url' ? 30 : 28));
    }, 0);
  };

  const handleSave = () => {
    savePost("draft");
  };

  const handlePublish = () => {
    savePost("published");
  };

  const copyCanonical = () => {
    const url = `https://yoursite.com/blog/${formData.slug}`;
    navigator.clipboard.writeText(url);
    alert("Canonical URL copied!");
  };

  const savePost = async (statusOverride) => {
    if (!formData.title || !formData.slug) {
      alert("Title and slug are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = { ...formData, status: statusOverride || formData.status };
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      const saved = await res.json();
      setPosts((prev) => {
        const others = prev.filter((p) => p.slug !== saved.slug);
        return [saved, ...others];
      });
      setShowEditor(false);
    } catch (err) {
      console.error("Save error", err);
      setError(err.message);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (!post?.slug) return;
    const confirmed = confirm(`Delete "${post.title}"?`);
    if (!confirmed) return;
    setError(null);
    try {
      const res = await fetch(`/api/blog?slug=${encodeURIComponent(post.slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setPosts((prev) => prev.filter((p) => p.slug !== post.slug));
    } catch (err) {
      console.error("Delete error", err);
      setError(err.message);
      alert(err.message);
    }
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file");
      return;
    }

    setUploadingCover(true);
    setUploadError("");
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageRef = ref(storage, `blog-covers/${Date.now()}-${safeName}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const url = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, coverImage: url }));
    } catch (err) {
      console.error("Cover upload failed", err);
      setUploadError("Upload failed. Please try again.");
      alert("Cover upload failed");
    } finally {
      setUploadingCover(false);
      if (event.target) event.target.value = "";
    }
  };

  // AI Generation Functions
  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      alert("Please enter a topic/title");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          topic: aiTopic,
          brief: aiBrief,
          blogType,
          tone: blogTone,
          person: blogPerson,
          personalContext,
          keyTakeaways,
          challengesFaced,
          tipsAdvice,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "AI generation failed");
      }

      const data = await res.json();
      const aiResult = data.result;
      
      console.log("AI Result:", aiResult);
      console.log("Social Snippets:", aiResult.socialSnippets);
      
      // Fill all form fields with AI-generated content
      setFormData((prev) => ({
        ...prev,
        title: aiResult.title || aiTopic,
        slug: aiResult.canonicalUrl || generateSlug(aiResult.title || aiTopic),
        content: aiResult.content || "",
        excerpt: aiResult.excerpt || "",
        category: aiResult.category || "",
        tags: Array.isArray(aiResult.tags) ? aiResult.tags : [],
        readingTime: aiResult.readingTime || "",
        seoTitle: aiResult.seoTitle || aiResult.title || "",
        seoDescription: aiResult.excerpt || "",
        canonical: aiResult.canonicalUrl || "",
      }));
      
      // Generate or use social snippets
      let snippets = aiResult.socialSnippets;
      
      // If AI didn't provide snippets, generate them from the content
      if (!snippets) {
        console.log("Generating fallback social snippets...");
        const title = aiResult.title || aiTopic;
        const excerpt = aiResult.excerpt || "";
        const contentPreview = aiResult.content?.substring(0, 200).replace(/[#*`]/g, '') || "";
        
        snippets = {
          linkedin: `📢 Just published: "${title}"

${excerpt || contentPreview}

What I learned along the way and key takeaways inside.

Read the full story on my portfolio: [PORTFOLIO_LINK]

${aiResult.tags?.slice(0, 3).map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ') || ''}`,
          medium: `${contentPreview}${contentPreview.length >= 200 ? '...' : ''}

This is an excerpt from my latest blog post. Read the complete article with detailed examples, code snippets, and insights on my portfolio.

👉 Continue reading: [PORTFOLIO_LINK]`
        };
      }
      
      if (snippets) {
        console.log("Setting social snippets:", snippets);
        setSocialSnippets(snippets);
        setShowSnippets(true);
      } else {
        console.warn("No social snippets generated");
      }
      
      setShowAiDialog(false);
      setAiTopic("");
      setAiBrief("");
      setPersonalContext("");
      setKeyTakeaways("");
      setChallengesFaced("");
      setTipsAdvice("");
    } catch (err) {
      console.error("AI generation error", err);
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiImprove = async () => {
    if (!formData.content.trim()) {
      alert("No content to improve");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve",
          content: formData.content,
        }),
      });

      if (!res.ok) throw new Error("AI improvement failed");

      const data = await res.json();
      setFormData((prev) => ({ ...prev, content: data.result }));
    } catch (err) {
      console.error("AI improvement error", err);
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiContinue = async () => {
    if (!formData.content.trim()) {
      alert("Start writing first, then I can continue");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "continue",
          content: formData.content,
        }),
      });

      if (!res.ok) throw new Error("AI continuation failed");

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        content: prev.content + "\n\n" + data.result,
      }));
    } catch (err) {
      console.error("AI continuation error", err);
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiGenerateMeta = async () => {
    if (!formData.content.trim() && !formData.title.trim()) {
      alert("Write some content first");
      return;
    }

    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "meta",
          topic: formData.title,
          content: formData.content,
        }),
      });

      if (!res.ok) throw new Error("AI meta generation failed");

      const data = await res.json();
      const meta = data.result;
      setFormData((prev) => ({
        ...prev,
        title: meta.title || prev.title,
        excerpt: meta.description || prev.excerpt,
        tags: meta.tags || prev.tags,
        seoTitle: meta.title || prev.seoTitle,
        seoDescription: meta.description || prev.seoDescription,
      }));
    } catch (err) {
      console.error("AI meta generation error", err);
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingPost ? "Edit Post" : "Create New Post"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editingPost ? `Editing: ${editingPost.title}` : "Write your next article"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAiDialog(true)}
              className="px-3 py-2 rounded-md bg-gradient-to-r from-primary to-purple-600 text-white inline-flex items-center gap-2 hover:opacity-90"
            >
              <Sparkles size={16} />
              AI Assistant
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
            >
              <Eye size={16} />
              {showPreview ? "Editor" : "Preview"}
            </button>
            <button
              onClick={() => setShowEditor(false)}
              className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
            >
              <X size={16} />
              Close
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Editor */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="border bg-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              
              <div>
                <label className="text-sm font-medium">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Your amazing article title..."
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Slug (URL)</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">yoursite.com/blog/</span>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-slug"
                    className="flex-1 px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Excerpt *</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short description (160 chars max)..."
                  rows={2}
                  maxLength={160}
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.excerpt.length}/160
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Reading time</label>
                  <input
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    placeholder="e.g. 5 min"
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Views</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.views}
                    onChange={(e) =>
                      setFormData({ ...formData, views: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Likes</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.likes}
                    onChange={(e) =>
                      setFormData({ ...formData, likes: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="border bg-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Content</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage || !formData.slug}
                    className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                    title="Upload and insert image into article"
                  >
                    {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                    {uploadingImage ? "Uploading..." : "Insert Image"}
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadingVideo || !formData.slug}
                    className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                    title="Upload video/GIF (MP4, WebM, GIF)"
                  >
                    {uploadingVideo ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                    {uploadingVideo ? "Uploading..." : "Insert Video/GIF"}
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,image/gif"
                    onChange={handleVideoUpload}
                    className="hidden"
                    disabled={uploadingVideo}
                  />
                  <div className="relative group">
                    <button
                      className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 transition-colors"
                      title="Quick insert media from URL"
                    >
                      <Plus size={12} />
                      URL Insert
                    </button>
                    <div className="absolute top-full left-0 mt-1 bg-card border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 min-w-[200px]">
                      <button
                        onClick={() => insertMarkdown('giphy')}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Sparkles size={12} />
                        Giphy Embed
                      </button>
                      <button
                        onClick={() => insertMarkdown('video-url')}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <ImageIcon size={12} />
                        Video URL
                      </button>
                      <button
                        onClick={() => insertMarkdown('gif-url')}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <ImageIcon size={12} />
                        GIF URL
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleAiImprove}
                    disabled={aiLoading || !formData.content.trim()}
                    className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    Improve
                  </button>
                  <button
                    onClick={handleAiContinue}
                    disabled={aiLoading || !formData.content.trim()}
                    className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50"
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                    Continue
                  </button>
                  <div className="text-xs text-muted-foreground">
                    {formData.content.split(" ").length} words • ~
                    {Math.ceil(formData.content.split(" ").length / 200)} min read
                  </div>
                </div>
              </div>
              {imageUploadError && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive">
                  {imageUploadError}
                </div>
              )}
              {videoUploadError && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-xs text-destructive">
                  {videoUploadError}
                </div>
              )}
              
              {/* Editor Mode Toggle */}
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setShowVisualEditor(false)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    !showVisualEditor
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setShowVisualEditor(true)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    showVisualEditor
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Visual Editor
                </button>
              </div>
              
              {showVisualEditor ? (
                <div className="border rounded-md bg-background min-h-[400px] p-4 space-y-4">
                  {parseContentBlocks(formData.content).map((block, idx) => {
                    if (block.type === 'image') {
                      const imageIndex = parseContentBlocks(formData.content)
                        .slice(0, idx)
                        .filter(b => b.type === 'image').length;
                      const isSelected = selectedImageIndex === imageIndex;
                      const isDragging = draggedImageIndex === imageIndex;
                      const isDragOver = draggedImageIndex !== null && draggedImageIndex !== imageIndex;
                      
                      return (
                        <div key={idx} className="relative mb-6">
                          {/* Large Drop Zone Indicator */}
                          {isDragOver && (
                            <div 
                              className="absolute -inset-4 border-4 border-dashed border-primary rounded-xl bg-primary/20 animate-pulse z-40 flex items-center justify-center"
                            >
                              <div className="bg-primary text-white text-sm font-bold px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                DROP HERE TO PLACE IMAGE
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          <div
                            draggable
                            onDragStart={(e) => {
                              setDraggedImageIndex(imageIndex);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                            onDragEnter={(e) => {
                              e.preventDefault();
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.dataTransfer.dropEffect = 'move';
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (draggedImageIndex !== null && draggedImageIndex !== imageIndex) {
                                moveImage(draggedImageIndex, imageIndex);
                              }
                              setDraggedImageIndex(null);
                            }}
                            onDragEnd={() => setDraggedImageIndex(null)}
                            onClick={(e) => {
                              if (!e.target.closest('.resize-controls')) {
                                setSelectedImageIndex(imageIndex);
                              }
                            }}
                            className={`relative group cursor-move border-2 rounded-lg p-6 transition-all ${
                              isDragging ? 'opacity-10 scale-75' : ''
                            } ${
                              isDragOver ? 'opacity-50' : ''
                            } ${
                              isSelected && !isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-card'
                            }`}
                          >
                            {/* Drag Handle - Always visible with animation */}
                            <div
                              className={`absolute top-2 left-2 bg-primary hover:bg-primary/80 p-2 rounded shadow-lg z-10 cursor-grab active:cursor-grabbing transition-all ${
                                draggedImageIndex !== null && !isDragging ? 'animate-bounce' : ''
                              }`}
                              title="🖱️ Drag to reorder"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <GripVertical size={20} className="text-white" />
                            </div>
                            
                            {/* Image Position Badge - Always visible during drag */}
                            <div className={`absolute top-2 right-2 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10 transition-opacity ${
                              draggedImageIndex !== null ? 'opacity-100' : 'opacity-0'
                            }`}>
                              Image #{imageIndex + 1}
                            </div>
                            
                            <img
                              src={block.url}
                              alt={block.alt}
                              style={{ width: `${block.width}px`, maxWidth: '100%' }}
                              className="rounded mx-auto shadow-sm"
                              draggable="false"
                            />
                            
                            {isSelected && !isDragging && (
                              <div 
                                className="resize-controls mt-4 flex items-center gap-3 justify-center bg-background/80 backdrop-blur p-4 rounded-lg border-2 border-primary/30 shadow-md"
                                draggable="false"
                                onDragStart={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <label className="text-sm font-medium flex items-center gap-3">
                                  Width:
                                  <input
                                    type="range"
                                    min="200"
                                    max="1200"
                                    step="50"
                                    value={block.width}
                                    onChange={(e) => updateImageWidth(imageIndex, parseInt(e.target.value))}
                                    className="w-40 cursor-ew-resize"
                                    draggable="false"
                                    onDragStart={(e) => e.preventDefault()}
                                  />
                                  <input
                                    type="number"
                                    min="200"
                                    max="1200"
                                    value={block.width}
                                    onChange={(e) => updateImageWidth(imageIndex, parseInt(e.target.value))}
                                    className="w-24 px-3 py-2 text-sm border-2 rounded font-mono"
                                    draggable="false"
                                    onDragStart={(e) => e.preventDefault()}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <span className="text-muted-foreground font-mono">px</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    
                    // Text blocks - make them droppable
                    const isTextDragOver = draggedImageIndex !== null;
                    return (
                      <div 
                        key={idx} 
                        className="relative mb-4"
                        onDragOver={(e) => {
                          if (draggedImageIndex !== null) {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                          }
                        }}
                        onDrop={(e) => {
                          if (draggedImageIndex !== null) {
                            e.preventDefault();
                            e.stopPropagation();
                            insertImageAtBlockIndex(draggedImageIndex, idx);
                            setDraggedImageIndex(null);
                          }
                        }}
                      >
                        {isTextDragOver && (
                          <div className="absolute -inset-2 border-2 border-dashed border-green-500 rounded-lg bg-green-500/10 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              DROP IMAGE HERE
                            </span>
                          </div>
                        )}
                        <div className={`prose dark:prose-invert max-w-none transition-opacity ${
                          isTextDragOver ? 'opacity-50' : ''
                        }`}>
                          {block.content.split('\n\n').map((para, pIdx) => (
                            <p key={pIdx} className="my-2 text-sm">{para}</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-xs text-muted-foreground text-center py-4 border-t">
                    💡 Click images to resize • Drag images to reorder
                  </div>
                </div>
              ) : (
                <div
                  className="relative"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (files && files[0]) {
                      // Trigger the image upload handler
                      const fakeEvent = { target: { files: [files[0]] } };
                      handleImageUpload(fakeEvent);
                    }
                  }}
                >
                  <textarea
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article in Markdown...

💡 TIP: You can drag & drop images directly here!

## Example Heading

Your content here with **bold**, *italic*, and \`code\`.

## Example Heading

Your content here with **bold**, *italic*, and `code`.

\`\`\`javascript
const example = 'code block';
\`\`\`

> Blockquotes for important notes

- Bullet points
- For lists

1. Numbered
2. Lists too
"
                    rows={20}
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background font-mono text-sm"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-md flex items-center justify-center pointer-events-none">
                      <div className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Uploading image...
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText size={14} />
                  Supports Markdown formatting
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiImprove}
                    disabled={aiLoading || !formData.content.trim()}
                    className="px-3 py-1.5 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                    title="Polish and improve the writing while keeping your voice"
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    Refine Content
                  </button>
                  <button
                    onClick={handleAiContinue}
                    disabled={aiLoading || !formData.content.trim()}
                    className="px-3 py-1.5 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50 transition-colors"
                    title="AI continues writing in your style"
                  >
                    {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <ArrowRight size={12} />}
                    Continue Writing
                  </button>
                </div>
              </div>
            </div>

            {/* Social Media Snippets - Generated by AI */}
            {showSnippets && socialSnippets && (
              <div className="border bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="text-primary" size={18} />
                    Social Media Snippets
                  </h3>
                  <button
                    onClick={() => setShowSnippets(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  📣 Ready-to-share snippets to drive traffic back to your portfolio. Just copy & paste!
                </p>

                {/* LinkedIn Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Linkedin size={14} className="text-blue-600" />
                      LinkedIn Post
                    </label>
                    <button
                      onClick={() => {
                        const linkedinText = socialSnippets.linkedin.replace(
                          '[PORTFOLIO_LINK]',
                          `${window.location.origin}/blog/${formData.slug}`
                        );
                        navigator.clipboard.writeText(linkedinText);
                        alert('LinkedIn post copied! Paste it on LinkedIn.');
                      }}
                      className="px-2 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                  <div className="p-3 rounded-md bg-background border text-sm font-mono whitespace-pre-wrap">
                    {socialSnippets.linkedin.replace(
                      '[PORTFOLIO_LINK]',
                      `${window.location.origin}/blog/${formData.slug}`
                    )}
                  </div>
                </div>

                {/* Medium Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium flex items-center gap-2">
                      📝 Medium Introduction
                    </label>
                    <button
                      onClick={() => {
                        const mediumText = socialSnippets.medium.replace(
                          '[PORTFOLIO_LINK]',
                          `${window.location.origin}/blog/${formData.slug}`
                        );
                        navigator.clipboard.writeText(mediumText);
                        alert('Medium intro copied! Use when cross-posting to Medium.');
                      }}
                      className="px-2 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  </div>
                  <div className="p-3 rounded-md bg-background border text-sm">
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      {socialSnippets.medium.replace(
                        '[PORTFOLIO_LINK]',
                        `${window.location.origin}/blog/${formData.slug}`
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2 rounded">
                    💡 <strong>Remember:</strong> Set canonical URL in Medium to: {window.location.origin}/blog/{formData.slug}
                  </p>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            <div className="border bg-card rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">SEO Optimization</h3>
                <button
                  onClick={handleAiGenerateMeta}
                  disabled={aiLoading || (!formData.content.trim() && !formData.title.trim())}
                  className="px-3 py-1 text-xs rounded-md border inline-flex items-center gap-1 hover:bg-primary/10 disabled:opacity-50"
                >
                  {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  Auto-Generate
                </button>
              </div>
              
              <div>
                <label className="text-sm font-medium">SEO Title</label>
                <input
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Optimized title for search engines (60 chars)"
                  maxLength={60}
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.seoTitle.length}/60
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder="Meta description for search results (160 chars)"
                  rows={3}
                  maxLength={160}
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {formData.seoDescription.length}/160
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Canonical URL</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    value={formData.canonical}
                    onChange={(e) => setFormData({ ...formData, canonical: e.target.value })}
                    placeholder="https://yoursite.com/blog/slug"
                    className="flex-1 px-3 py-2 rounded-md border bg-background"
                  />
                  <button
                    onClick={copyCanonical}
                    className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
                  >
                    <Copy size={16} /> Copy
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use this when cross-posting to Medium/Dev.to
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="border bg-card rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-sm">Publish</h3>
              <div className="text-xs text-muted-foreground mb-1">Author (locked)</div>
              <input
                value={formData.author || "Me"}
                onChange={() => {}}
                readOnly
                className="w-full px-3 py-2 rounded-md border bg-muted cursor-not-allowed"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border bg-background"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full px-4 py-2 rounded-md border inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={16} /> Save Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={saving}
                className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send size={16} /> Publish
              </button>
            </div>

            {/* Cover Image */}
            <div className="border bg-card rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-sm">Cover Image</h3>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
              {formData.coverImage ? (
                <div className="space-y-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploadingCover}
                      className="flex-1 px-3 py-1.5 rounded-md border text-sm disabled:opacity-60"
                    >
                      {uploadingCover ? "Uploading…" : "Replace"}
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, coverImage: "" })}
                      disabled={uploadingCover}
                      className="flex-1 px-3 py-1.5 rounded-md border text-sm disabled:opacity-60"
                    >
                      Remove
                    </button>
                  </div>
                  {uploadError && <div className="text-xs text-red-500">{uploadError}</div>}
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="w-full px-4 py-8 rounded-md border-2 border-dashed inline-flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
                >
                  <ImageIcon size={32} />
                  <span className="text-sm">{uploadingCover ? "Uploading…" : "Upload cover image"}</span>
                  {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
                </button>
              )}
            </div>

            {/* Categorization */}
            <div className="border bg-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-sm">Categorization</h3>
              
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                >
                  <option value="">Select category</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Backend">Backend</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Finance">Finance</option>
                  <option value="Frontend">Frontend</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2 mt-1">
                  <input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (addTag(), e.preventDefault())}
                    placeholder="Add tag..."
                    className="flex-1 px-3 py-2 rounded-md border bg-background"
                  />
                  <button
                    onClick={addTag}
                    className="px-3 py-2 rounded-md border inline-flex items-center gap-2"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-sm"
                    >
                      #{tag}
                      <button onClick={() => removeTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Series (optional)</label>
                <input
                  value={formData.series}
                  onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                  placeholder="e.g., DevOps Journey"
                  className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                />
              </div>

              {formData.series && (
                <div>
                  <label className="text-sm font-medium">Part Number</label>
                  <input
                    type="number"
                    value={formData.seriesOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, seriesOrder: e.target.value })
                    }
                    placeholder="1"
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Dialog - Full Featured */}
        {showAiDialog && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border rounded-xl p-6 max-w-3xl w-full space-y-5 my-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  AI Personal Blog Generator
                </h3>
                <button onClick={() => setShowAiDialog(false)} className="hover:bg-muted p-2 rounded-md">
                  <X size={18} />
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm font-medium mb-1">✨ Write naturally, AI will polish it</p>
                <p className="text-xs text-muted-foreground">
                  Share your raw thoughts, experiences, and learnings in informal English. 
                  AI will preserve your voice while creating an engaging, human-written blog.
                </p>
              </div>

              {/* Blog Type & Voice Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">📝 Blog Type</label>
                  <select
                    value={blogType}
                    onChange={(e) => setBlogType(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  >
                    <option value="experience">🎯 Personal Experience</option>
                    <option value="learning">📚 Learning Journey</option>
                    <option value="roadmap">🗺️ Roadmap/Guide</option>
                    <option value="opinion">💭 Opinion/Thoughts</option>
                    <option value="tutorial">🛠️ Tutorial</option>
                    <option value="lessons">📖 Lessons Learned</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">🎨 Tone</label>
                  <select
                    value={blogTone}
                    onChange={(e) => setBlogTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  >
                    <option value="casual">Casual & Friendly</option>
                    <option value="conversational">Conversational</option>
                    <option value="semi-formal">Semi-formal</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">👤 Voice</label>
                  <select
                    value={blogPerson}
                    onChange={(e) => setBlogPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  >
                    <option value="first">First Person (I/My)</option>
                    <option value="third">Third Person</option>
                  </select>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">📌 Blog Title *</label>
                  <input
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g., How I Built My First Full-Stack App"
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background"
                    disabled={aiLoading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">💬 Your Story (in your own words) *</label>
                  <textarea
                    value={personalContext}
                    onChange={(e) => setPersonalContext(e.target.value)}
                    placeholder="Write informally about what happened, what you did, or what you're sharing...\n\nExample: 'so i finally decided to learn react and build something real. i spent like 3 weeks watching tutorials but never actually coded. then i just started building a todo app and everything clicked. i made tons of mistakes but thats how i learned...'}"
                    rows={6}
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  />
                </div>
              </div>

              {/* Personal Context Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">💡 Key Takeaways</label>
                  <textarea
                    value={keyTakeaways}
                    onChange={(e) => setKeyTakeaways(e.target.value)}
                    placeholder="What did you learn? Main points...\ne.g., 'dont watch too many tutorials, just build. making mistakes is the best teacher. state management is not that hard once you try it'"
                    rows={4}
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">⚠️ Challenges You Faced</label>
                  <textarea
                    value={challengesFaced}
                    onChange={(e) => setChallengesFaced(e.target.value)}
                    placeholder="What problems did you encounter?\ne.g., 'struggled with hooks at first, deployment was confusing, cors errors drove me crazy'"
                    rows={4}
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium">💎 Tips & Advice</label>
                  <textarea
                    value={tipsAdvice}
                    onChange={(e) => setTipsAdvice(e.target.value)}
                    placeholder="What would you tell others? Your recommendations...\ne.g., 'start small, use vite not CRA, console.log everything when debugging, read the error messages carefully'"
                    rows={3}
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                    disabled={aiLoading}
                  />
                </div>
              </div>

              {/* Optional Brief */}
              <details className="border rounded-lg p-3">
                <summary className="text-sm font-medium cursor-pointer">📋 Additional Context (Optional)</summary>
                <textarea
                  value={aiBrief}
                  onChange={(e) => setAiBrief(e.target.value)}
                  placeholder="Any additional details, technical specs, links, or context you want to include..."
                  rows={3}
                  className="w-full mt-2 px-3 py-2 rounded-md border bg-background text-sm"
                  disabled={aiLoading}
                />
              </details>

              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md text-xs">
                <strong className="text-amber-600">🎯 How it works:</strong>
                <ul className="mt-1 space-y-1 text-muted-foreground ml-4 list-disc">
                  <li>AI reads your informal story and extracts key insights</li>
                  <li>Preserves your personal voice and experiences</li>
                  <li>Structures content with headings, examples, and flow</li>
                  <li>Generates SEO-optimized metadata automatically</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading || !aiTopic.trim() || !personalContext.trim()}
                  className="flex-1 px-4 py-3 rounded-md bg-gradient-to-r from-primary to-purple-600 text-white font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating your blog...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Personal Blog
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowAiDialog(false)}
                  disabled={aiLoading}
                  className="px-4 py-3 rounded-md border hover:bg-muted disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <FileText size={16} /> Blog Management
          </div>
          <h1 className="text-2xl font-bold">All Posts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your blog content, drafts, and published articles
          </p>
        </div>
        <button
          onClick={handleNewPost}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground inline-flex items-center gap-2"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading posts…</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <div className="p-4 border bg-card rounded-lg">
          <div className="text-xs text-muted-foreground">Total Posts</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="p-4 border bg-card rounded-lg">
          <div className="text-xs text-muted-foreground">Published</div>
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
        </div>
        <div className="p-4 border bg-card rounded-lg">
          <div className="text-xs text-muted-foreground">Drafts</div>
          <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
        </div>
        <div className="p-4 border bg-card rounded-lg">
          <div className="text-xs text-muted-foreground">Total Views</div>
          <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
        </div>
        <div className="p-4 border bg-card rounded-lg">
          <div className="text-xs text-muted-foreground">Total Likes</div>
          <div className="text-2xl font-bold">{stats.likes.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border bg-card">
          <Search size={16} className="text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex gap-2">
          {["all", "published", "draft", "featured"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md border text-sm ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {filtered.length === 0 && !loading && (
          <div className="p-6 border bg-card rounded-xl text-muted-foreground text-sm">
            No posts yet. Use “New Post” to create your first article.
          </div>
        )}
        {filtered.map((post) => (
          <motion.div
            key={post.id}
            className="border bg-card rounded-xl p-5 hover:shadow-lg transition-shadow"
            whileHover={{ y: -2 }}
          >
            <div className="flex gap-4">
              <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} /> {post.views ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp size={12} /> {post.likes ?? 0}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {post.readingTime || "—"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md font-medium ${
                        post.status === "published"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-orange-500/10 text-orange-600"
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.featured && (
                      <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                        Featured
                      </span>
                    )}
                    <span className="text-muted-foreground">{post.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                      className="px-3 py-1.5 rounded-md border inline-flex items-center gap-2 text-sm"
                    >
                      <Eye size={14} /> Preview
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="px-3 py-1.5 rounded-md border inline-flex items-center gap-2 text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post)}
                      className="px-3 py-1.5 rounded-md border inline-flex items-center gap-2 text-sm text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye size={12} /> {post.views}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TrendingUp size={12} /> {post.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {post.readingTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlogEditor;
