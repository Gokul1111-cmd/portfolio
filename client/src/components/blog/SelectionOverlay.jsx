import PropTypes from "prop-types";

const getScrollOffsets = () => {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  return { x: window.scrollX, y: window.scrollY };
};

const HighlightBox = ({ rect, zIndex }) => {
  const { x, y } = getScrollOffsets();
  return (
    <div
      className="fixed pointer-events-none bg-purple-400/25 border border-purple-400/60 rounded-sm"
      style={{
        top: `${rect.top - y}px`,
        left: `${rect.left - x}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        zIndex,
      }}
    />
  );
};

HighlightBox.propTypes = {
  rect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    id: PropTypes.number,
  }).isRequired,
  zIndex: PropTypes.number,
};

export const SelectionOverlay = ({ persistedHighlights = [], selectionRect }) => {
  return (
    <>
      {persistedHighlights.map((h) => (
        <HighlightBox key={h.id} rect={h} zIndex={30} />
      ))}
      {selectionRect && <HighlightBox rect={selectionRect} zIndex={40} />}
    </>
  );
};

SelectionOverlay.propTypes = {
  persistedHighlights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      text: PropTypes.string,
    })
  ),
  selectionRect: PropTypes.shape({
    id: PropTypes.number,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    text: PropTypes.string,
  }),
};

export default SelectionOverlay;
