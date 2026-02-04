import "./input.style.css";
import React, { useState, useId, forwardRef } from "react";
import ErrorIcon from "@/assets/icons/ErrorIcon.tsx";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isFloating?: boolean;
  isError?: boolean;
  error?: string;
  title?: string;
  inputSize?: "small" | "medium" | "large" | "xlarge";
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      isFloating = true,
      isError = false,
      error,
      title,
      value,
      inputSize = "large",
      className = "",
      icon,
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = useId();

    const isLabelFloating =
      isFloating && (isFocused || (value && String(value).length > 0));

    return (
      <div className="input-wrapper">
        <div
          className={`input-container ${isFloating ? "floating" : ""} ${isError ? "error" : ""} input-size-${inputSize}`}
        >
          {isFloating && title && (
            <label
              htmlFor={inputId}
              className={`floating-label ${isLabelFloating ? "active" : ""}`}
            >
              {title}
            </label>
          )}

          {!isFloating && title && (
            <label htmlFor={inputId} className="static-label">
              {title}
            </label>
          )}

          {icon && <div className="input-icon">{icon}</div>}

          <input
            {...props}
            ref={ref}
            id={inputId}
            value={value}
            className={`input-field ${className}`}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={isError}
            aria-describedby={isError ? `${inputId}-error` : undefined}
            autoComplete="off"
          />
        </div>

        {/* Error wrapper with fixed height to prevent layout shift */}
        {isError && error && (
          <div className="error-wrapper">
            <div
              className={`error-container ${isError && error ? "visible" : ""}`}
              id={`${inputId}-error`}
              role="alert"
              aria-live="polite"
            >
              <ErrorIcon />
              <p className="error-text">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
