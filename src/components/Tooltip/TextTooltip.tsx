import React, { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface TextTooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  duration?: number;
}

export const TextTooltip: React.FC<TextTooltipProps> = ({
  text,
  children,
  position = "top",
  duration = 500,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const updateTooltipPosition = useCallback(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - 8;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - 8;
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + 8;
        break;
    }

    setTooltipPosition({ top, left });
  }, [position]);

  const handleMouseEnter = () => {
    updateTooltipPosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const transformClasses = {
    top: "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2",
    left: "-translate-x-full -translate-y-1/2",
    right: "-translate-y-1/2",
  };

  const arrowStyles = {
    top: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-900",
    left: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-900",
  };

  return (
    <>
      <span
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </span>
      {createPortal(
        <div
          className={`fixed ${transformClasses[position]} px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-[9999] pointer-events-none`}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            opacity: isVisible ? 1 : 0,
            transition: `opacity ${duration}ms ease-in-out`,
            visibility: isVisible ? "visible" : "hidden",
          }}
        >
          {text}
          <div className={`absolute border-4 ${arrowStyles[position]}`} />
        </div>,
        document.body,
      )}
    </>
  );
};

export default TextTooltip;
