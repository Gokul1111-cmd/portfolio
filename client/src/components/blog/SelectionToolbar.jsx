import PropTypes from "prop-types";
import { Highlighter, MessageSquare } from "lucide-react";

export const SelectionToolbar = ({ selectedText, selectionPosition, onHighlight, onRespond }) => {
  if (!selectedText || !selectionPosition) return null;

  return (
    <div
      className="selection-toolbar fixed z-50 bg-background border rounded-lg shadow-lg p-2 flex gap-2"
      style={{
        top: `${selectionPosition.top}px`,
        left: `${selectionPosition.left}px`,
        transform: "translate(-50%, 0)",
      }}
    >
      <button
        onClick={onHighlight}
        className="px-3 py-2 text-sm rounded-md hover:bg-muted inline-flex items-center gap-2"
      >
        <Highlighter size={16} /> Highlight
      </button>
      <button
        onClick={onRespond}
        className="px-3 py-2 text-sm rounded-md hover:bg-muted inline-flex items-center gap-2"
      >
        <MessageSquare size={16} /> Respond
      </button>
    </div>
  );
};

SelectionToolbar.propTypes = {
  selectedText: PropTypes.string,
  selectionPosition: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  onHighlight: PropTypes.func.isRequired,
  onRespond: PropTypes.func.isRequired,
};

export default SelectionToolbar;
