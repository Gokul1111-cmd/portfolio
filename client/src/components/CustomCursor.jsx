import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isClickingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/touch-enabled
    const checkMobile = () => {
      const isTouchDevice = () => {
        return (
          (typeof window !== 'undefined' && 'ontouchstart' in window) ||
          (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)
        );
      };
      
      const isSmallScreen = window.innerWidth <= 768; // Tailwind md breakpoint
      
      setIsMobile(isTouchDevice() || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Don't initialize cursor on mobile
    if (isMobile) return;

    // Update mouse position
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Check if hovering over text or interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isText = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'INPUT', 'TEXTAREA', 'LABEL'].includes(target.tagName);
      const isInteractive = target.closest('a') || target.closest('button');
      
      isHoveringRef.current = isText || isInteractive;
    };

    // Handle click state
    const handleMouseDown = () => {
      isClickingRef.current = true;
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
    };

    // Lerp animation loop (increase factor for snappier response)
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      if (!cursorRef.current) return;

      // Smooth trailing with lerp (higher factor = faster catch-up)
      cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, 0.95);
      cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, 0.95);

      // Calculate scale based on state
      let scale = 1;
      if (isClickingRef.current) {
        scale = isHoveringRef.current ? 4 : 0.7; // Shrink on click
      } else if (isHoveringRef.current) {
        scale = 5;
      }

      // Update cursor position
      cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%) scale(${scale})`;

      requestAnimationFrame(animate);
    };

    // Start animation
    const animationId = requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  // Don't render cursor on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out"
    />
  );
};

export default CustomCursor;
