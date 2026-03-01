import "./textarea.style.css";
import React, { useState, useId, forwardRef } from "react";
import ErrorIcon from "@/assets/icons/ErrorIcon.tsx";

export interface CustomTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isFloating?: boolean;
  isError?: boolean;
  error?: string;
  title?: string;
  showCharCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, CustomTextAreaProps>(
  (
    {
      isFloating = true,
      isError = false,
      error,
      title,
      value,
      maxLength,
      showCharCount = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const textareaId = useId();

    const currentLength = value ? String(value).length : 0;
    const isLabelFloating = isFloating && (isFocused || currentLength > 0);
    const isLimitReached =
      maxLength !== undefined && currentLength >= maxLength;

    return (
      <div className="textarea-wrapper">
        {!isFloating && title && (
          <label htmlFor={textareaId} className="textarea-static-label">
            {title}
          </label>
        )}

        <div
          className={`textarea-container ${isFloating ? "floating" : ""} ${isError ? "error" : ""}`}
        >
          {isFloating && title && (
            <label
              htmlFor={textareaId}
              className={`textarea-floating-label ${isLabelFloating ? "active" : ""}`}
            >
              {title}
            </label>
          )}

          <textarea
            {...props}
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={`textarea-field ${className}`}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={isError}
            aria-describedby={isError ? `${textareaId}-error` : undefined}
          />
        </div>

        <div className="textarea-footer">
          {showCharCount && maxLength !== undefined && (
            <span
              className={`textarea-char-count ${isLimitReached ? "limit-reached" : ""}`}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>

        {isError && error && (
          <div className="textarea-error-wrapper">
            <div
              className={`textarea-error-container ${isError && error ? "visible" : ""}`}
              id={`${textareaId}-error`}
              role="alert"
              aria-live="polite"
            >
              <ErrorIcon />
              <p className="textarea-error-text">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
