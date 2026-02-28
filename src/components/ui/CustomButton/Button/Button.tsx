import TextTooltip from "@/components/Tooltip/TextTooltip";
import React, { FC, Fragment, ReactNode } from "react";

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  tooltip?: string;
  children?: ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  showTitleInMobile?: boolean;
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
  showTitleInMobile = true,
  ...props
}) => {
  const titleClassName = showTitleInMobile ? "" : "hidden sm:inline";

  const content = children ? (
    children
  ) : (
    <div className="flex items-center justify-center gap-2">
      {isLoading ? (
        <Fragment>
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
        </Fragment>
      ) : icon ? (
        <Fragment>
          <span aria-hidden="true" className="mt-1.5">
            {icon}
          </span>
          {title && <span className={titleClassName}>{title}</span>}
        </Fragment>
      ) : (
        <Fragment>
          {title && <span className={titleClassName}>{title}</span>}
        </Fragment>
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
            ? "cursor-not-allowed shadow-none!"
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
