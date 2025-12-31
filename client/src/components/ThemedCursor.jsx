import { useEffect, useState } from "react";

export const ThemedCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hidden, setHidden] = useState(false);
  const [clicked, setClicked] = useState(false);
  const isCoarse =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: coarse)").matches;

  useEffect(() => {
    if (isCoarse) return undefined;

    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const enter = () => setHidden(false);
    const leave = () => setHidden(true);
    const down = () => setClicked(true);
    const up = () => setClicked(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseenter", enter);
    window.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseenter", enter);
      window.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [isCoarse]);

  if (isCoarse) return null;

  const baseStyle = {
    transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
  };

  return (
    <>
      <div
        className={`themed-cursor ${hidden ? "opacity-0" : "opacity-100"} ${clicked ? "scale-75" : "scale-100"}`}
        style={baseStyle}
      />
      <div
        className={`themed-cursor-ring ${hidden ? "opacity-0" : "opacity-100"} ${clicked ? "scale-90" : "scale-100"}`}
        style={baseStyle}
      />
    </>
  );
};
