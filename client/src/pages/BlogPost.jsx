import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, MessageCircle, TrendingUp } from "lucide-react";
import { StickySidebar } from "@/components/blog/StickySidebar";
import { RightSidebar } from "@/components/blog/RightSidebar";
import { NewsletterCTA } from "@/components/blog/NewsletterCTA";
import { PostContent } from "@/components/blog/PostContent";
import { PostFooterNav } from "@/components/blog/PostFooterNav";
import { PostHeader } from "@/components/blog/PostHeader";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};

const upsertMeta = ({ name, property, content }) => {
  if (!content) return;
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    if (name) tag.setAttribute("name", name);
    if (property) tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const upsertCanonical = (href) => {
  if (!href) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
};

const normalizePost = (raw, slug) => {
  if (!raw) return null;
  const safeAuthor = raw.author || "Unknown";
  return {
    title: raw.title || "Untitled Post",
    excerpt: raw.excerpt || "",
    content: raw.content || "",
    author: safeAuthor,
    authorBio: raw.authorBio || "",
    readingTime: raw.readingTime || "—",
    publishedAt: raw.publishedAt || new Date().toISOString(),
    category: raw.category || "Uncategorized",
    series: raw.series || "",
    seriesOrder: raw.seriesOrder || 1,
    views: raw.views || 0,
    likes: raw.likes || 0,
    comments: raw.comments || 0,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    coverImage: raw.coverImage || "/placeholder-cover.png",
    slug: raw.slug || slug,
  };
};

export const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState(null);

  const [liked, setLiked] = useState(() => {
    if (typeof window !== "undefined" && slug) {
      return localStorage.getItem(`blog-liked-${slug}`) === "true";
    }
    return false;
  });
  const [bookmarked, setBookmarked] = useState(() => {
    if (typeof window !== "undefined" && slug) {
      const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
      return bookmarks.includes(slug);
    }
    return false;
  });

  // Handle bookmark toggle with localStorage persistence
  const handleBookmarkToggle = () => {
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);

    // Get existing bookmarks
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');

    if (newBookmarked) {
      // Add to bookmarks if not already there
      if (!bookmarks.includes(slug)) {
        bookmarks.push(slug);
        localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
      }
    } else {
      // Remove from bookmarks
      const filtered = bookmarks.filter(s => s !== slug);
      localStorage.setItem('blog-bookmarks', JSON.stringify(filtered));
    }
  };
  const [showCopied, setShowCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(() => {
    if (typeof window !== "undefined" && slug) {
      return localStorage.getItem(`blog-reaction-${slug}`) || null;
    }
    return null;
  });
  const [guestName, setGuestName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState(null);
  const [showStickySidebar, setShowStickySidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const commentInputRef = useRef(null);
  const headerRef = useRef(null);
  const articleRef = useRef(null);
  const rightSidebarRef = useRef(null);

  // Click-outside handler to close comment sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!showRightSidebar) return;

      // Check if click is outside the sidebar
      if (rightSidebarRef.current && !rightSidebarRef.current.contains(event.target)) {
        // Also check if the click is not on a comment button (to prevent immediate close)
        const isCommentButton = event.target.closest('[data-comment-trigger]');
        if (!isCommentButton) {
          setShowRightSidebar(false);
        }
      }
    };

    const handleScroll = () => {
      if (showRightSidebar) {
        setShowRightSidebar(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showRightSidebar]);

  // Initialize user state (likes, bookmarks) from localStorage
  useEffect(() => {
    if (!slug) return;

    // Restore Liked State
    const savedLiked = localStorage.getItem(`blog-liked-${slug}`) === "true";
    setLiked(savedLiked);

    // Restore Reaction
    const savedReaction = localStorage.getItem(`blog-reaction-${slug}`);
    if (savedReaction) setSelectedReaction(savedReaction);

    // Restore Bookmarked State
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    setBookmarked(bookmarks.includes(slug));

  }, [slug]);

  useEffect(() => {
    const savedName = localStorage.getItem("blogGuestName");
    if (savedName) {
      setGuestName(savedName);
      setIsEditingName(false);
    } else {
      setIsEditingName(true);
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowStickySidebar(headerBottom < 0);
      }

      // Don't auto-close sidebar on scroll - let user close it manually
    };

    const handleArticleClick = (e) => {
      if (showRightSidebar && articleRef.current?.contains(e.target)) {
        setShowRightSidebar(false);
      }
    };

    document.addEventListener("click", handleArticleClick, true);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("click", handleArticleClick, true);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slug, showRightSidebar]);

  // Scroll to top only when navigating to a new post (slug changes)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Track page view
  useEffect(() => {
    if (!slug || !post) return;

    const trackView = async () => {
      try {
        await fetch(`/api/blog-data?slug=${encodeURIComponent(slug)}&action=view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [slug, post]);

  useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      setLoadingPost(true);
      setPostError(null);
      try {
        const res = await fetch(`/api/blog?slug=${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          const loadedPost = normalizePost(data?.post || data);
          if (!cancelled) setPost(loadedPost || null);
          return;
        }
        throw new Error(`Post load failed (${res.status})`);
      } catch (error) {
        console.error("Post fetch error", error);
        if (!cancelled) {
          setPost(null);
          setPostError(error.message);
        }
      } finally {
        if (!cancelled) setLoadingPost(false);
      }
    };

    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const url = `${window.location.origin}/blog/${slug}`;
    document.title = `${post.title} | Blog`;
    upsertCanonical(url);
    const description = post.excerpt || post.subtitle || post.title;

    upsertMeta({ name: "description", content: description });
    upsertMeta({ property: "og:title", content: post.title });
    upsertMeta({ property: "og:description", content: description });
    upsertMeta({ property: "og:type", content: "article" });
    upsertMeta({ property: "og:url", content: url });
    upsertMeta({ property: "og:image", content: post.coverImage });
    upsertMeta({ name: "twitter:card", content: "summary_large_image" });
    upsertMeta({ name: "twitter:title", content: post.title });
    upsertMeta({ name: "twitter:description", content: description });
    upsertMeta({ name: "twitter:image", content: post.coverImage });
  }, [post, slug]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;
      setLoadingComments(true);
      setCommentError(null);
      try {
        const res = await fetch(`/api/blog-data?slug=${encodeURIComponent(slug)}&action=comments`);
        if (!res.ok) throw new Error(`Failed to load comments (${res.status})`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Comments fetch error", error);
        setCommentError(error.message);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [slug]);

  const relatedPosts = useMemo(() => [], []);
  const seriesPosts = useMemo(() => [], []);

  const handleReactionSelect = async (emoji) => {
    setSelectedReaction(emoji);
    const wasLiked = liked;
    setLiked(true);
    setReactionPickerOpen(false);

    // Always persist reaction to localStorage
    try {
      localStorage.setItem(`blog-reaction-${slug}`, emoji);
      localStorage.setItem(`blog-liked-${slug}`, "true");
    } catch (e) {
      console.error("Failed to save reaction locally", e);
    }

    // Persist like to database (only if not already liked)
    if (!wasLiked) {
      try {
        await fetch(`/api/blog-data?slug=${slug}&action=like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ increment: true })
        });
      } catch (err) {
        console.warn("Like tracking failed:", err);
        // If it was just a local reaction update, we don't revert 'liked'
        // unless it's a new like that failed.
        // But since we just updated the reaction locally, keeping it 'liked' visually is fine.
      }
    }
  };

  const handleLikeToggle = async () => {
    if (!slug) return;
    const newLiked = !liked;
    setLiked(newLiked);

    // Optimistic: Update localStorage immediately
    try {
      if (newLiked) {
        localStorage.setItem(`blog-liked-${slug}`, "true");
      } else {
        localStorage.removeItem(`blog-liked-${slug}`);
        localStorage.removeItem(`blog-reaction-${slug}`);
        setSelectedReaction(null);
      }
    } catch (e) {
      console.error("Local storage error", e);
    }

    // Persist to database
    try {
      await fetch(`/api/blog-data?slug=${slug}&action=like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: newLiked })
      });
    } catch (err) {
      console.warn("Like toggle failed:", err);
      // Revert on error
      setLiked(!newLiked);
      // Revert localStorage
      try {
        if (newLiked) {
          localStorage.removeItem(`blog-liked-${slug}`);
        } else {
          localStorage.setItem(`blog-liked-${slug}`, "true");
        }
      } catch (e) { /* ignore */ }
    }
  };

  const focusCommentInput = ({ fromSidebar = false } = {}) => {
    setShowRightSidebar(true);
    if (fromSidebar) return; // Do not force focus when opened from left sidebar to avoid scroll
    // Wait for sidebar animation to complete before focusing
    setTimeout(() => {
      // Prevent browser's automatic scroll when focusing
      commentInputRef.current?.focus({ preventScroll: true });
    }, 350);
  };

  const submitComment = async (textOverride) => {
    const text = (textOverride ?? commentText).trim();
    const name = (guestName || "").trim();
    if (submittingComment) return;
    if (!name) {
      setCommentError("Please enter your name");
      return;
    }
    if (!text) {
      setCommentError("Please enter a comment");
      return;
    }
    setSubmittingComment(true);
    setCommentError(null);
    try {
      const res = await fetch("/api/blog-data?action=comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, author: name, text }),
      });
      if (!res.ok) throw new Error("Failed to post comment");
      const saved = await res.json();
      const newComment = {
        id: saved.id || Date.now(),
        author: saved.author || name,
        text: saved.text || text,
        timestamp: saved.createdAt || new Date().toISOString(),
      };
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
      setGuestName(name);
      localStorage.setItem("blogGuestName", name);
      setIsEditingName(false);
      requestAnimationFrame(() => {
        commentInputRef.current?.focus({ preventScroll: true });
      });
    } catch (error) {
      console.error("Comment submit error", error);
      setCommentError(error.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async (platform) => {
    if (!post) return;
    const baseUrl = `${window.location.origin}/blog/${slug}`;
    const utm = `utm_source=${platform}&utm_medium=social&utm_campaign=${post.slug}`;
    const url = `${baseUrl}?${utm}`;


    const urls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      copy: url,
    };

    if (platform === "copy") {
      await navigator.clipboard.writeText(url);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } else {
      window.open(urls[platform], "_blank");
    }
  };

  if (!post) {
    if (loadingPost) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          Loading post...
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center gap-4 bg-background text-foreground px-4">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t load that article right now. It may have been unpublished or moved.
        </p>
        {postError && <p className="text-sm text-red-500">{postError}</p>}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(0)}
            className="px-4 py-2 rounded-md border text-sm"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/blog")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
          >
            Back to blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground text-left">
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div className="h-full bg-primary" style={{ width: `${readingProgress}%` }} />
      </div>

      <div
        className={`transition-[margin] duration-300 ease-out ${showStickySidebar ? "lg:ml-[400px]" : ""
          } ${showRightSidebar ? "lg:mr-[400px]" : ""}`}
      >
        <PostHeader
          headerRef={headerRef}
          post={post}
          navigate={navigate}
          liked={liked}
          handleLikeToggle={handleLikeToggle}
          selectedReaction={selectedReaction}
          reactionPickerOpen={reactionPickerOpen}
          setReactionPickerOpen={setReactionPickerOpen}
          handleReactionSelect={handleReactionSelect}
          formatNumber={formatNumber}
          formatDate={formatDate}
          comments={comments}
          bookmarked={bookmarked}
          handleBookmarkToggle={handleBookmarkToggle}
          showCopied={showCopied}
          handleShare={handleShare}
          focusCommentInput={focusCommentInput}
          showRightSidebar={showRightSidebar}
        />
      </div>

      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: showStickySidebar ? 1 : 0, x: showStickySidebar ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <StickySidebar
          showStickySidebar={showStickySidebar}
          post={post}
          navigate={navigate}
          liked={liked}
          handleLikeToggle={handleLikeToggle}
          selectedReaction={selectedReaction}
          reactionPickerOpen={reactionPickerOpen}
          setReactionPickerOpen={setReactionPickerOpen}
          handleReactionSelect={handleReactionSelect}
          readingProgress={readingProgress}
          focusCommentInput={focusCommentInput}
          comments={comments}
          bookmarked={bookmarked}
          handleBookmarkToggle={handleBookmarkToggle}
          showCopied={showCopied}
          handleShare={handleShare}
          formatNumber={formatNumber}
          formatDate={formatDate}
        />
      </motion.aside>

      <RightSidebar
        ref={rightSidebarRef}
        showRightSidebar={showRightSidebar}
        setShowRightSidebar={setShowRightSidebar}
        guestName={guestName}
        setGuestName={setGuestName}
        isEditingName={isEditingName}
        setIsEditingName={setIsEditingName}
        commentInputRef={commentInputRef}
        commentText={commentText}
        setCommentText={setCommentText}
        submitComment={submitComment}
        comments={comments}
        submittingComment={submittingComment}
        commentError={commentError}
      />

      <main
        className={`transition-[margin] duration-300 ease-out ${showStickySidebar ? "lg:ml-[400px]" : ""
          } ${showRightSidebar ? "lg:mr-[400px]" : ""} max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16`}
      >
        <div className="rounded-2xl overflow-hidden border bg-card shadow-lg mb-12 md:mb-16">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-[360px] md:h-[480px] object-cover"
            loading="eager"
            decoding="async"
          />
        </div>

        {seriesPosts.length > 1 && (
          <div className="mb-12 md:mb-16 p-6 md:p-8 border bg-card rounded-xl">
            <div className="font-semibold mb-4">📚 {post.series} Series</div>
            <div className="space-y-2">
              {seriesPosts.map((p) => (
                <div
                  key={p.slug}
                  onClick={() => p.slug !== slug && navigate(`/blog/${p.slug}`)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${p.slug === slug ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                >
                  <span className="font-semibold">Part {p.seriesOrder}</span>
                  <span className="text-sm flex-1">{p.title}</span>
                  {p.slug === slug && (
                    <span className="text-xs px-2 py-1 rounded-md bg-white/20">Current</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <PostContent ref={articleRef} post={post} />

        <NewsletterCTA />

        <div id="comments-section" className="my-16 md:my-20 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold">
              <MessageCircle size={24} />
              Comments ({comments.length || post.comments || 0})
            </div>
            {commentError && <span className="text-sm text-red-500">{commentError}</span>}
          </div>

          {loadingComments && (
            <div className="text-sm text-muted-foreground">Loading comments…</div>
          )}

          {!loadingComments && comments.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Comments ({comments.length})</h3>
              {comments.map((comment) => (
                <div key={comment.id} className="p-6 border bg-card rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold">
                      {comment.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{comment.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp || comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-8 border bg-card rounded-xl text-center space-y-3">
            <MessageCircle size={48} className="mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground">Start a conversation! Leave a comment above.</p>
            <p className="text-sm text-muted-foreground">
              Comments are live; share your thoughts.
            </p>
          </div>
        </div>

        {relatedPosts.length > 0 && (
          <div className="my-12 space-y-6">
            <div className="flex items-center gap-2 text-xl font-bold">
              <TrendingUp size={24} />
              Related Articles
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <div
                  key={related.slug}
                  onClick={() => navigate(`/blog/${related.slug}`)}
                  className="border bg-card rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="h-32 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                  <div className="p-4 space-y-2">
                    <h4 className="font-semibold text-sm line-clamp-2">{related.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock size={12} /> {related.readingTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <PostFooterNav navigate={navigate} />
      </main>
    </div>
  );
};

export default BlogPost;
