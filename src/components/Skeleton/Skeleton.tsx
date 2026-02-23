import React, { memo } from "react";
import "./skeleton.style.css";

export interface SkeletonProps {
  variant?: "text" | "rect" | "avatar" | "card" | "grid";
  width?: string | number;
  height?: string | number;
  rows?: number;
  className?: string;
  ariaLabel?: string;
}

export const Skeleton: React.FC<SkeletonProps> = memo(
  ({
    variant = "text",
    width,
    height,
    rows = 1,
    className = "",
    ariaLabel = "Loading content...",
  }) => {
    const style = {
      ...(width !== undefined && { width }),
      ...(height !== undefined && { height }),
    };

    const baseClass = `skeleton skeleton-${variant} ${className}`;

    if (variant === "text" && rows > 1) {
      return (
        <div
          role="status"
          aria-busy="true"
          className={`skeleton-text-wrapper ${className}`}
          style={style}
        >
          <span className="sr-only">{ariaLabel}</span>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className="skeleton skeleton-text"
              style={{ width: i === rows - 1 ? "70%" : "100%" }}
            />
          ))}
        </div>
      );
    }

    if (variant === "card") {
      return (
        <SkeletonCard
          width={width}
          className={className}
          ariaLabel={ariaLabel}
        />
      );
    }

    if (variant === "grid") {
      return (
        <div
          role="status"
          aria-busy="true"
          className={`skeleton-grid ${className}`}
          style={style}
        >
          <span className="sr-only">{ariaLabel}</span>
          {Array.from({ length: rows > 1 ? rows : 3 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-rect" />
          ))}
        </div>
      );
    }

    return (
      <div role="status" aria-busy="true" className={baseClass} style={style}>
        <span className="sr-only">{ariaLabel}</span>
      </div>
    );
  },
);

Skeleton.displayName = "Skeleton";

interface SkeletonCardProps {
  width?: string | number;
  className?: string;
  ariaLabel?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = memo(
  ({ width, className = "", ariaLabel = "Loading card..." }) => {
    return (
      <div
        role="status"
        aria-busy="true"
        className={`skeleton-card-container ${className}`}
        style={width !== undefined ? { width } : undefined}
      >
        <span className="sr-only">{ariaLabel}</span>
        <div className="skeleton skeleton-rect skeleton-card-image" />
        <div className="skeleton-card-content">
          <div className="skeleton skeleton-text skeleton-card-title" />
          <div className="skeleton skeleton-text skeleton-card-desc" />
          <div
            className="skeleton skeleton-text skeleton-card-desc"
            style={{ width: "80%" }}
          />
        </div>
      </div>
    );
  },
);

SkeletonCard.displayName = "SkeletonCard";
