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
  MessageCircle,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";

const REACTION_STYLES = {
  "👍": "bg-blue-500/10 border-blue-500 text-blue-500",
  "👏": "bg-amber-500/10 border-amber-500 text-amber-500",
  "🫶": "bg-emerald-500/10 border-emerald-500 text-emerald-500",
  "❤️": "bg-rose-500/10 border-rose-500 text-rose-500",
  "💡": "bg-purple-500/10 border-purple-500 text-purple-500",
  "😄": "bg-yellow-500/10 border-yellow-500 text-yellow-600",
};

export const StickySidebar = ({
  showStickySidebar,
  post,
  navigate,
  liked,
  handleLikeToggle,
  selectedReaction,
  reactionPickerOpen,
  setReactionPickerOpen,
  handleReactionSelect,
  readingProgress,
  focusCommentInput,
  comments,
  bookmarked,
  handleBookmarkToggle,
  showCopied,
  handleShare,
  formatNumber,
  formatDate,
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
    <div
      className={`hidden lg:block fixed left-0 top-0 w-[400px] h-screen border-r bg-background/95 backdrop-blur-sm z-40 ${showStickySidebar ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      <div className="h-full overflow-y-auto p-8 space-y-6">
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to all articles
        </button>

        <h2 className="text-2xl font-bold leading-tight">{post.title}</h2>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center overflow-hidden">
              <img
                src="/profile-logo-small.png"
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Gokul</div>
              <div className="text-xs text-muted-foreground">Full Stack Developer</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock size={14} /> {post.readingTime}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={14} /> {formatDate(post.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={14} /> {formatNumber(post.views)} views
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Category</div>
            <span className="inline-block px-3 py-1.5 rounded-full bg-muted text-foreground text-sm font-semibold">
              {post.category}
            </span>
            {post.series && (
              <span className="inline-block ml-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                {post.series} - Part {post.seriesOrder}
              </span>
            )}
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground mb-2">Tags</div>
            <div className="flex flex-wrap gap-2">
              {(post.tags || []).map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate(`/blog?tag=${tag}`)}
                  className="px-3 py-1.5 rounded-full border text-xs font-medium hover:bg-muted transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Reading Progress</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2">Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLikeToggle}
                className={`w-full px-4 py-3 rounded-md border text-sm inline-flex items-center justify-center gap-2 transition-colors ${liked
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
                <div className="absolute bottom-full mb-2 -right-48 z-50 flex items-end gap-3 px-4 py-3 rounded-2xl border bg-card shadow-xl whitespace-nowrap">
                  <div className="absolute right-12 top-full -translate-x-1/2 -mt-px w-3 h-3 bg-card border-r border-b -rotate-45" />
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                focusCommentInput({ fromSidebar: true });
              }}
              className="px-4 py-3 rounded-md border bg-card hover:bg-muted text-sm inline-flex items-center justify-center gap-2"
            >
              <MessageCircle size={16} />
              {formatNumber((comments?.length ?? 0) || post.comments || 0)}
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`px-4 py-3 rounded-md border text-sm inline-flex items-center justify-center gap-2 transition-colors ${bookmarked ? "bg-primary/10 border-primary text-primary" : "bg-card hover:bg-muted"
                }`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-current" : ""} />
              Save
            </button>
            <button
              onClick={() => handleShare("copy")}
              className="px-4 py-3 rounded-md border bg-card hover:bg-muted text-sm inline-flex items-center justify-center gap-2"
            >
              {showCopied ? <Check size={16} /> : <LinkIcon size={16} />}
              {showCopied ? "Copied" : "Share"}
            </button>
          </div>
          <button
            onClick={() => handleShare("linkedin")}
            className="w-full px-4 py-3 rounded-md border bg-card hover:bg-muted text-sm inline-flex items-center justify-center gap-2"
          >
            <Linkedin size={16} />
            Share on LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
};

StickySidebar.propTypes = {
  showStickySidebar: PropTypes.bool.isRequired,
  post: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    authorBio: PropTypes.string,
    readingTime: PropTypes.string,
    publishedAt: PropTypes.string,
    views: PropTypes.number,
    category: PropTypes.string,
    series: PropTypes.string,
    seriesOrder: PropTypes.number,
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
  readingProgress: PropTypes.number.isRequired,
  focusCommentInput: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  bookmarked: PropTypes.bool.isRequired,
  handleBookmarkToggle: PropTypes.func.isRequired,
  showCopied: PropTypes.bool.isRequired,
  handleShare: PropTypes.func.isRequired,
  formatNumber: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default StickySidebar;
