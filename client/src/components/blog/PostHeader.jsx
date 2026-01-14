import { useRef } from "react";
import PropTypes from "prop-types";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Check,
  Clock,
  Eye,
  Heart,
  Link as LinkIcon,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

// Helper function to render inline markdown
const renderInlineMarkdown = (text) => {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Match bold: **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Match italic: *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Match inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // No match, add the next character as plain text
    parts.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return parts;
};

const REACTION_STYLES = {
  "👍": "bg-blue-500/10 border-blue-500 text-blue-500",
  "👏": "bg-amber-500/10 border-amber-500 text-amber-500",
  "🫶": "bg-emerald-500/10 border-emerald-500 text-emerald-500",
  "❤️": "bg-rose-500/10 border-rose-500 text-rose-500",
  "💡": "bg-purple-500/10 border-purple-500 text-purple-500",
  "😄": "bg-yellow-500/10 border-yellow-500 text-yellow-600",
};

export const PostHeader = ({
  headerRef,
  post,
  navigate,
  liked,
  handleLikeToggle,
  selectedReaction,
  reactionPickerOpen,
  setReactionPickerOpen,
  handleReactionSelect,
  formatNumber,
  formatDate,
  comments,
  bookmarked,
  handleBookmarkToggle,
  showCopied,
  handleShare,
  focusCommentInput,
  showRightSidebar,
}) => {
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setReactionPickerOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setReactionPickerOpen(false);
    }, 500); // 500ms delay before closing
  };

  return (
    <header ref={headerRef} className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            {!showRightSidebar && (
              <button
                onClick={() => navigate("/blog")}
                className="hidden md:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors md:mt-5 md:-ml-37"
              >
                <ArrowLeft size={16} /> Back to all articles
              </button>
            )}
            <h1 className="flex-1 min-w-0 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-left">
              {renderInlineMarkdown(post.title)}
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed text-left">
            {renderInlineMarkdown(post.excerpt)}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center overflow-hidden">
                <img
                  src="/profile-logo-small.png"
                  alt="Author"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-foreground">Gokul</div>
                <div className="text-xs text-muted-foreground">Full Stack Developer</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Clock size={14} /> {post.readingTime}
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                <Calendar size={14} /> {formatDate(post.publishedAt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-semibold">
              {post.category}
            </span>
            {post.series && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                {post.series} - Part {post.seriesOrder}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Eye size={14} /> {formatNumber(post.views)} views
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {(post.tags || []).map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/blog?tag=${tag}`)}
                className="px-3 py-1.5 rounded-full border border-purple-400/40 text-white text-xs font-medium hover:bg-purple-400/10"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t pt-4 text-sm">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeToggle}
                className={`px-3 py-2 rounded-md border inline-flex items-center gap-2 transition-colors ${liked
                  ? selectedReaction
                    ? REACTION_STYLES[selectedReaction] || "bg-primary/10 border-primary text-primary"
                    : "bg-red-500/10 border-red-500 text-red-500"
                  : "bg-card hover:bg-muted"
                  }`}
              >
                {(() => {
                  const totalLikes = post.likes || 0;
                  const showStack = totalLikes > 1;

                  return (
                    <>
                      <div className="flex items-center -space-x-1.5 mr-2">
                        {/* Current User's Reaction (if any) */}
                        {selectedReaction ? (
                          <motion.div
                            key={selectedReaction}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            className="relative z-30 rounded-full bg-background ring-2 ring-card"
                          >
                            <span className="text-sm leading-none block">{selectedReaction}</span>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="relative z-30 rounded-full bg-background ring-2 ring-card"
                          >
                            <Heart size={14} className={liked ? "fill-current text-red-500" : "text-muted-foreground"} />
                          </motion.div>
                        )}

                        {/* Stack for "Others" - Only show if > 1 like */}
                        {showStack && !selectedReaction && (
                          <>
                            {totalLikes > 1 && (
                              <div className="relative z-20 rounded-full bg-blue-100 dark:bg-blue-900/30 ring-2 ring-card p-0.5 flex items-center justify-center w-5 h-5">
                                <span className="text-[10px] leading-none">👍</span>
                              </div>
                            )}
                            {totalLikes > 2 && (
                              <div className="relative z-10 rounded-full bg-purple-100 dark:bg-purple-900/30 ring-2 ring-card p-0.5 flex items-center justify-center w-5 h-5">
                                <span className="text-[10px] leading-none">💡</span>
                              </div>
                            )}
                          </>
                        )}
                        {showStack && selectedReaction && (
                          <>
                            <div className="relative z-20 rounded-full bg-rose-100 dark:bg-rose-900/30 ring-2 ring-card p-0.5 flex items-center justify-center w-5 h-5">
                              <span className="text-[10px] leading-none">❤️</span>
                            </div>
                            {totalLikes > 3 && (
                              <div className="relative z-10 rounded-full bg-blue-100 dark:bg-blue-900/30 ring-2 ring-card p-0.5 flex items-center justify-center w-5 h-5">
                                <span className="text-[10px] leading-none">👍</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {formatNumber(totalLikes)}
                    </>
                  );
                })()}
              </motion.button>
              {reactionPickerOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 flex items-end gap-4 px-4 py-3 rounded-2xl border bg-card shadow-xl">
                  <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-px w-3 h-3 bg-card border-r border-b -rotate-45" />
                  {[
                    { emoji: "👍", label: "Like", color: "bg-blue-100 text-blue-600" },
                    { emoji: "👏", label: "Celebrate", color: "bg-amber-100 text-amber-600" },
                    { emoji: "🫶", label: "Support", color: "bg-emerald-100 text-emerald-600" },
                    { emoji: "❤️", label: "Love", color: "bg-rose-100 text-rose-600" },
                    { emoji: "💡", label: "Insightful", color: "bg-purple-100 text-purple-600" },
                    { emoji: "😄", label: "Funny", color: "bg-yellow-100 text-yellow-700" },
                  ].map((option) => (
                    <div key={option.label} className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => handleReactionSelect(option.emoji)}
                        className={`${option.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow hover:-translate-y-1 transition-transform`}
                        title={option.label}
                      >
                        {option.emoji}
                      </button>
                      <span className="text-xs font-semibold text-foreground whitespace-nowrap">{option.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              data-comment-trigger
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); focusCommentInput(); }}
              className="px-3 py-2 rounded-md border bg-card hover:bg-muted inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle size={16} />
              {formatNumber((comments?.length ?? 0) || post.comments || 0)}
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`px-3 py-2 rounded-md border inline-flex items-center gap-2 transition-colors ${bookmarked ? "bg-primary/10 border-primary text-primary" : "bg-card hover:bg-muted"
                }`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
              Save
            </button>
            <button
              onClick={() => handleShare("linkedin")}
              className="px-3 py-2 rounded-md border bg-card hover:bg-muted inline-flex items-center gap-2 transition-colors"
            >
              <Linkedin size={16} />
              Share
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="px-3 py-2 rounded-md border bg-card hover:bg-muted inline-flex items-center gap-2 transition-colors"
            >
              {showCopied ? <Check size={16} /> : <LinkIcon size={16} />}
              {showCopied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

PostHeader.propTypes = {
  headerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  showRightSidebar: PropTypes.bool,
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    author: PropTypes.string,
    authorBio: PropTypes.string,
    readingTime: PropTypes.string,
    publishedAt: PropTypes.string,
    category: PropTypes.string,
    series: PropTypes.string,
    seriesOrder: PropTypes.number,
    views: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    likes: PropTypes.number,
    comments: PropTypes.number,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
  liked: PropTypes.bool.isRequired,
  handleLikeToggle: PropTypes.func.isRequired,
  selectedReaction: PropTypes.string,
  reactionPickerOpen: PropTypes.bool.isRequired,
  setReactionPickerOpen: PropTypes.func.isRequired,
  handleReactionSelect: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  bookmarked: PropTypes.bool.isRequired,
  handleBookmarkToggle: PropTypes.func.isRequired,
  showCopied: PropTypes.bool.isRequired,
  handleShare: PropTypes.func.isRequired,
  focusCommentInput: PropTypes.func.isRequired,
};

export default PostHeader;
