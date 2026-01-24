import { useEffect, useRef, useState } from 'react';

// Logger utility (only logs in development)
const isDev = import.meta.env.DEV;
const logger = {
  log: (message, data = {}) => {
    if (isDev) console.log(`[CustomCursor] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[CustomCursor ERROR] ${message}`, error);
  },
  warn: (message, data = {}) => {
    if (isDev) console.warn(`[CustomCursor WARNING] ${message}`, data);
  }
};

// Module load diagnostics (helps detect if Chrome isn't loading this file)
if (isDev) {
  try {
    console.log('[CustomCursor] Module loaded', {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
      vendor: typeof navigator !== 'undefined' ? navigator.vendor : 'n/a',
    });
  } catch (e) {
    console.error('[CustomCursor] Module load logging failed', e);
  }
}

export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);
  const isClickingRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Global error handlers to surface hidden runtime issues (Chrome-only problems)
  useEffect(() => {
    const onError = (event) => {
      logger.error('Global error caught', { message: event.message, error: event.error });
    };
    const onRejection = (event) => {
      logger.error('Unhandled promise rejection', event.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  // Log browser info on mount
  useEffect(() => {
    const browserInfo = {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      isChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
      isEdge: /Edg/.test(navigator.userAgent),
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    logger.log('Component mounted', browserInfo);
  }, []);

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
      
      // Use pointer media query for more accurate detection
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      
      // Only treat as mobile if small screen OR if the primary pointer is coarse (finger)
      // This allows desktop touch devices (like Windows with touch) to still show cursor
      const isMobileDevice = isSmallScreen || hasCoarsePointer;
      
      logger.log('Mobile check', {
        isTouchDevice: isTouchDevice(),
        isSmallScreen,
        hasCoarsePointer,
        isMobile: isMobileDevice,
        screenWidth: window.innerWidth,
        maxTouchPoints: navigator.maxTouchPoints
      });
      
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Don't initialize cursor on mobile
    if (isMobile) {
      logger.log('Skipping cursor initialization - mobile device detected');
      return;
    }

    logger.log('Initializing cursor animation');

    // Update mouse position
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    // Check if hovering over text or interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      const isText = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'INPUT', 'TEXTAREA', 'LABEL'].includes(target.tagName);
      const isInteractive = target.closest('a') || target.closest('button');
      
      const wasHovering = isHoveringRef.current;
      isHoveringRef.current = isText || isInteractive;
      
      if (wasHovering !== isHoveringRef.current) {
        logger.log('Hover state changed', {
          isHovering: isHoveringRef.current,
          tagName: target.tagName,
          isText,
          isInteractive
        });
      }
    };

    // Handle click state
    const handleMouseDown = () => {
      isClickingRef.current = true;
      logger.log('Mouse down');
    };

    const handleMouseUp = () => {
      isClickingRef.current = false;
      logger.log('Mouse up');
    };

    // Lerp animation loop (increase factor for snappier response)
    const lerp = (start, end, factor) => start + (end - start) * factor;

    let frameCount = 0;
    const animate = () => {
      if (!cursorRef.current) {
        if (frameCount === 0) {
          logger.error('Cursor ref not found in animate loop');
        }
        return;
      }

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
      const transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px) translate(-50%, -50%) scale(${scale})`;
      cursorRef.current.style.transform = transform;

      // Log first few frames for debugging
      if (frameCount < 3) {
        logger.log(`Animation frame ${frameCount}`, {
          mousePos: mousePos.current,
          cursorPos: cursorPos.current,
          scale,
          transform,
          element: cursorRef.current
        });
      }
      frameCount++;

      requestAnimationFrame(animate);
    };

    // Start animation
    logger.log('Starting animation loop');
    const animationId = requestAnimationFrame(animate);

    // Add event listeners
    logger.log('Adding event listeners');
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Test if cursor element is rendered
    setTimeout(() => {
      if (cursorRef.current) {
        const computedStyle = window.getComputedStyle(cursorRef.current);
        logger.log('Cursor element styles', {
          display: computedStyle.display,
          position: computedStyle.position,
          zIndex: computedStyle.zIndex,
          transform: computedStyle.transform,
          visibility: computedStyle.visibility,
          opacity: computedStyle.opacity,
          pointerEvents: computedStyle.pointerEvents
        });
      } else {
        logger.error('Cursor ref is null after mount');
      }
    }, 100);

    return () => {
      logger.log('Cleaning up cursor effect');
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  // Don't render cursor on mobile
  if (isMobile) {
    logger.log('Not rendering cursor - mobile device');
    return null;
  }

  logger.log('Rendering cursor element');

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[99999] mix-blend-difference transition-transform duration-150 ease-out"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    />
  );
};

export default CustomCursor;
