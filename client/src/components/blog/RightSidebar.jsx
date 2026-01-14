import PropTypes from "prop-types";
import { User, X } from "lucide-react";
import { forwardRef } from "react";

export const RightSidebar = forwardRef((
  {
    showRightSidebar,
    setShowRightSidebar,
    guestName,
    setGuestName,
    isEditingName,
    setIsEditingName,
    commentInputRef,
    commentText,
    setCommentText,
    submitComment,
    comments,
    submittingComment,
    commentError,
  },
  ref
) => {
  const showNameInput = isEditingName || !guestName;

  const CommentForm = () => (
    <div className="space-y-3">
      {showNameInput ? (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground">Your name</label>
          <input
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 rounded-md border bg-background text-sm"
          />
          <p className="text-xs text-muted-foreground">Saved for future comments on all posts.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <User size={16} />
            Commenting as <span className="font-semibold text-foreground">{guestName}</span>
          </div>
          <button
            onClick={() => setIsEditingName(true)}
            className="text-xs px-2 py-1 rounded-md border bg-card hover:bg-muted w-fit"
          >
            Edit name
          </button>
        </div>
      )}
      <textarea
        ref={commentInputRef}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Share your thoughts..."
        className="w-full px-4 py-3 rounded-md border bg-background min-h-32 text-sm resize-none"
      />
      {commentError && (
        <div className="text-xs text-red-500">{commentError}</div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => submitComment()}
          disabled={!commentText.trim() || submittingComment}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 flex-1 md:flex-none"
        >
          {submittingComment ? "Posting..." : "Post Comment"}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Kudos to you", "Happy journey", "Great insight", "Loved this"].map((prompt) => (
          <button
            key={prompt}
            onClick={() => submitComment(prompt)}
            className="px-3 py-1.5 rounded-full border bg-background hover:bg-muted text-xs font-medium"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  const CommentsList = () => (
    comments.length > 0 && (
      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-muted-foreground">
          Your Comments ({comments.length})
        </h4>
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border bg-card rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {comment.author[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">{comment.author}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(comment.timestamp || comment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed">{comment.text}</p>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div
      ref={ref}
      className={`hidden lg:flex fixed right-0 top-0 w-[400px] h-screen border-l bg-background/95 backdrop-blur-sm z-40 overflow-y-auto transition-transform duration-300 ease-out flex-col ${
        !showRightSidebar ? "translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Desktop version */}
      <div className="flex flex-col h-full p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold">Comments</h3>
          <button
            onClick={() => setShowRightSidebar(false)}
            className="p-2 hover:bg-muted rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <CommentForm />
          <CommentsList />
        </div>
      </div>

      {/* Mobile version */}
      {showRightSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/30 lg:hidden -z-10"
            onClick={() => setShowRightSidebar(false)}
          />
          <div className="fixed inset-0 lg:hidden flex flex-col z-40">
            <div className="bg-background/95 backdrop-blur-sm overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold">Comments</h3>
                <button
                  onClick={() => setShowRightSidebar(false)}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <CommentForm />
                <CommentsList />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

RightSidebar.displayName = 'RightSidebar';

RightSidebar.propTypes = {
  showRightSidebar: PropTypes.bool.isRequired,
  setShowRightSidebar: PropTypes.func.isRequired,
  guestName: PropTypes.string,
  setGuestName: PropTypes.func.isRequired,
  isEditingName: PropTypes.bool.isRequired,
  setIsEditingName: PropTypes.func.isRequired,
  commentInputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  commentText: PropTypes.string.isRequired,
  setCommentText: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      author: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.string,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  submittingComment: PropTypes.bool,
  commentError: PropTypes.string,
};

export default RightSidebar;
