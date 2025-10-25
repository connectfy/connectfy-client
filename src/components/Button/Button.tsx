import React from "react";
import { PropsWithChildren } from "react";
import { ButtonHTMLAttributes } from "react";
import "./button.style.css";
import { CircularProgress } from "@mui/material";

type ButtonSize = "small" | "medium" | "large" | "xlarge";
type ButtonVariant = "solid" | "outline" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  fillWidth?: boolean;
  hasAnimation?: boolean;
};

export default function Button({
  children,
  size = "medium",
  variant = "solid",
  isLoading = false,
  startIcon,
  endIcon,
  className,
  disabled,
  fillWidth = false,
  hasAnimation = false,
  ...rest
}: PropsWithChildren<Props>) {
  const isDisabled = disabled || isLoading;
  const rootClass = [
    "btn",
    size,
    variant,
    fillWidth ? "fillWidth" : "",
    isDisabled ? "disabled" : "",
    hasAnimation ? "animation" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      className={rootClass}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <CircularProgress
          size={size === "small" ? 20 : 30}
          sx={{ color: "white" }}
        />
      ) : (
        <span className="btn_content">
          {startIcon && <span className="btn_icon start">{startIcon}</span>}
          <span className="btn_label">{children}</span>
          {endIcon && <span className="btn_icon end">{endIcon}</span>}
        </span>
      )}
    </button>
  );
}
