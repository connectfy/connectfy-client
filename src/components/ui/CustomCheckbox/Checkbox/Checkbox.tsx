import React, { ChangeEvent, FC } from "react";

interface Props {
  id?: string;
  children?: React.ReactNode;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Checkbox: FC<Props> = ({
  id,
  children,
  checked,
  onChange,
  disabled = false,
}) => {
  const checkboxId = id ?? `checkbox-${Math.random()}`;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <label
          htmlFor={checkboxId}
          className={`
            flex items-center justify-center
            w-5 h-5 rounded-md
            border-2 transition-all duration-200 cursor-pointer
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
            ${
              checked
                ? "bg-(--primary-color) border-(--primary-color) shadow-checkbox-active"
                : "bg-white dark:bg-input-bg border-input-border hover:border-(--primary-color)/50"
            }
          `}
        >
          <svg
            className={`
              w-3.5 h-3.5 text-white transition-all duration-200
              ${checked ? "scale-100 opacity-100" : "scale-0 opacity-0"}
            `}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </label>
      </div>

      {children && (
        <label
          htmlFor={checkboxId}
          className={`
            text-sm font-medium select-none cursor-pointer
            text-text-color dark:text-text-color transition-colors
            ${disabled ? "cursor-not-allowed opacity-50" : "hover:text-(--primary-color)"}
          `}
        >
          {children}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
