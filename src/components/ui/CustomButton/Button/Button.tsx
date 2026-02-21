import TextTooltip from "@/components/Tooltip/TextTooltip";
import React, { FC, ReactNode } from "react";

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  tooltip?: string;
  children?: ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

const Button: FC<CustomButtonProps> = ({
  title,
  icon,
  isLoading = false,
  loadingText,
  tooltip,
  disabled,
  className = "",
  children,
  tooltipPosition,
  ...props
}) => {
  const content = children ? (
    children
  ) : (
    <div className="flex items-center justify-center gap-2">
      {isLoading ? (
        <>
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : icon ? (
        <>
          <span aria-hidden="true" className="mt-1.5">
            {icon}
          </span>
          {title && <span className="hidden sm:inline">{title}</span>}
        </>
      ) : (
        <>{title && <span>{title}</span>}</>
      )}
    </div>
  );

  const buttonElement = (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`${className} ${disabled || isLoading ? "opacity-70" : ""} ${
        isLoading
          ? "cursor-wait"
          : disabled
            ? "cursor-not-allowed"
            : "cursor-pointer"
      }`}
    >
      {content}
    </button>
  );

  if (!tooltip) {
    return buttonElement;
  }

  return (
    <TextTooltip text={tooltip} position={tooltipPosition}>
      <span className="inline-flex">{buttonElement}</span>
    </TextTooltip>
  );
};

export default Button;
