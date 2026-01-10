import { ChevronLeft, ChevronRight } from "lucide-react";
import PropTypes from "prop-types";

export const PostFooterNav = ({ navigate }) => {
  return (
    <div className="flex justify-between items-center pt-8 border-t">
      <button
        onClick={() => navigate("/blog")}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={20} /> All articles
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="inline-flex items-center gap-2 text-primary"
      >
        Back to top <ChevronRight size={20} className="rotate-[-90deg]" />
      </button>
    </div>
  );
};

PostFooterNav.propTypes = {
  navigate: PropTypes.func.isRequired,
};

export default PostFooterNav;
