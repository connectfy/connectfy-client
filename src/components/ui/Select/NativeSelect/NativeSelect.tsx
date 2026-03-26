import { FC, useState, useRef, useEffect, useId, ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../CustomButton/Button/Button";

export interface ISelectOption {
  label: string | ReactNode;
  value: string | number;
}

interface ICustomSelectProps {
  options: ISelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  title?: string;
  isFloating?: boolean;
  inputSize?: "small" | "medium" | "large" | "xlarge";
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  visibleOptions?: number;
}

const OPTION_HEIGHT = 40; // py-2.5 (20px) + text-sm line-height (20px)
const LIST_PADDING = 16; // inner div py-2 (8px top + 8px bottom)

const NativeSelect: FC<ICustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  title,
  isFloating = true,
  inputSize = "large",
  icon,
  disabled = false,
  className = "",
  visibleOptions = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectId = useId();

  const maxHeight = OPTION_HEIGHT * visibleOptions + LIST_PADDING;

  const selectedOption = options.find((opt) => opt.value === value);
  const isLabelFloating =
    isFloating && (isOpen || (value !== undefined && value !== ""));

  const sizeConfig = {
    small: {
      padding: "py-[0.625rem] px-[0.75rem]",
      fontSize: "text-sm",
      labelLeft: icon ? "left-10" : "left-3",
      iconLeft: "left-2.5",
      floatingOffset: "-top-2",
    },
    medium: {
      padding: "py-[0.875rem] px-[1rem]",
      fontSize: "text-base",
      labelLeft: icon ? "left-11" : "left-4",
      iconLeft: "left-3",
      floatingOffset: "-top-2.5",
    },
    large: {
      padding: "py-[1rem] px-[1.25rem]",
      fontSize: "text-[1.0625rem]",
      labelLeft: icon ? "left-12" : "left-5",
      iconLeft: "left-4",
      floatingOffset: "-top-2",
    },
    xlarge: {
      padding: "py-[1.125rem] px-[1.5rem]",
      fontSize: "text-lg",
      labelLeft: icon ? "left-14" : "left-6",
      iconLeft: "left-4.5",
      floatingOffset: "-top-3.5",
    },
  };

  const currentSize = sizeConfig[inputSize];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative w-full min-w-[200px] ${className}`}
      ref={containerRef}
    >
      {/* Floating Label */}
      {title && (
        <label
          htmlFor={selectId}
          className={`
            absolute transition-all duration-300 pointer-events-none z-10
            ${
              isLabelFloating
                ? `${currentSize.floatingOffset} left-4 text-[13px] px-1 bg-(--input-bg)`
                : `top-1/2 -translate-y-1/2 ${currentSize.labelLeft} ${currentSize.fontSize} text-(--muted-color)`
            }
            ${disabled ? "opacity-50" : ""}
          `}
        >
          {title}
        </label>
      )}

      {/* İkon */}
      {icon && (
        <div
          className={`absolute ${currentSize.iconLeft} top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 
          ${isOpen ? "text-(--primary-color)" : "text-(--muted-color)"}
          ${disabled ? "opacity-50" : ""}
        `}
        >
          {icon}
        </div>
      )}

      {/* Trigger Button */}
      <Button
        id={selectId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between ${currentSize.padding} ${currentSize.fontSize}
          rounded-xl border transition-all duration-300 outline-none
          bg-(--input-bg) text-(--text-primary)
          ${icon ? "pl-12" : ""} 
          ${
            disabled
              ? "cursor-not-allowed opacity-60 bg-gray-100/10 border-gray-500/20"
              : "cursor-pointer border-(--auth-glass-border)"
          }
          ${isOpen ? "border-(--primary-color) ring-2 ring-(--primary-color)/10" : ""}
        `}
      >
        <span className="truncate">
          {selectedOption
            ? selectedOption.label
            : !isLabelFloating
              ? ""
              : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-(--primary-color)" : ""} ${disabled ? "opacity-50" : ""}`}
        />
      </Button>

      {/* Options List */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              maxHeight: `${maxHeight}px`,
              scrollbarWidth: "thin",
              scrollbarColor: "var(--primary-color) transparent",
            }}
            className="
              absolute z-50 w-full mt-1 overflow-y-auto
              bg-(--auth-main-bg) border border-(--auth-glass-border)
              rounded-xl shadow-(--card-shadow)
              scrollbar-thin scrollbar-thumb-(--primary-color)/40 scrollbar-track-transparent
            "
          >
            <div className="py-2">
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <li
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      flex items-center justify-between px-4 py-2.5 text-sm font-semibold cursor-pointer transition-colors
                      ${
                        isActive
                          ? "bg-(--primary-color) text-white"
                          : "text-(--text-primary) hover:bg-(--primary-color)/10"
                      }
                    `}
                  >
                    <span className="truncate">{option.label}</span>
                    {isActive && (
                      <Check size={14} className="text-white shrink-0 ml-2" />
                    )}
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NativeSelect;
