import { FC, useRef, useEffect, useState } from "react";
import { ListFilter, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
// import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";

export interface FilterOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface FilterDropdownProps {
  title?: string;
  options: FilterOption[];
  selected: string | null;
  icon?: React.ReactNode;
  animation?: {
    whileTap?: boolean;
    whileHover?: boolean;
    animate?: boolean;
  };
  actionButton?: React.ReactNode;
  tooltip?: string;
}

const FilterDropdown: FC<FilterDropdownProps> = ({
  title,
  options,
  selected,
  animation,
  actionButton,
  tooltip,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value?: FilterOption) => {
    value?.onClick?.();
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: animation?.whileTap ? 0.88 : 1 }}
        whileHover={{ scale: animation?.whileHover ? 1.08 : 1 }}
        animate={
          open
            ? {
                backgroundColor: "var(--active-bg)",
                color: "var(--primary-color)",
              }
            : {
                backgroundColor: "transparent",
                color: "var(--muted-color)",
              }
        }
        transition={{ duration: 0.18, ease: "easeInOut" }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          outline: "none",
          position: "relative",
        }}
      >
        {/* Rotating icon */}
        <Tooltip placement="top" title={tooltip}>
          <motion.span
            animate={{ rotate: open && animation?.animate ? 180 : 0 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
            style={{ display: "flex", alignItems: "center" }}
          >
            <ListFilter size={16} />
          </motion.span>
        </Tooltip>

        {/* Active dot indicator */}
        {/* <AnimatePresence>
          {selected && (
            <motion.span
              key="dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "var(--primary-color)",
                boxShadow: "0 0 0 1.5px var(--auth-main-bg)",
              }}
            />
          )}
        </AnimatePresence> */}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{
              duration: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              zIndex: 50,
              minWidth: 180,
              borderRadius: 14,
              padding: "6px",
              backgroundColor: "var(--auth-main-bg)",
              border: "1px solid var(--auth-glass-border)",
              boxShadow: "var(--card-shadow)",
              transformOrigin: "top right",
            }}
          >
            {/* Header */}
            {title && (
              <div
                style={{
                  padding: "6px 10px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  borderBottom: "1px solid var(--auth-glass-border)",
                  marginBottom: 4,
                }}
              >
                {title}
              </div>
            )}

            {/* Options */}
            {options.map((opt, i) => {
              const isActive = selected === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.04 + i * 0.045,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    backgroundColor: "var(--active-bg-2)",
                    x: 2,
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? "var(--active-bg)" : "transparent",
                    color: isActive
                      ? "var(--primary-color)"
                      : "var(--text-color)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    textAlign: "left",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {opt.icon && (
                      <span style={{ opacity: 0.7, display: "flex" }}>
                        {opt.icon}
                      </span>
                    )}
                    {opt.label}
                  </span>

                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        style={{ display: "flex", flexShrink: 0 }}
                      >
                        <Check size={13} strokeWidth={2.5} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}

            {/* Clear selection */}
            {actionButton && (
              <AnimatePresence>
                {selected && (
                  <motion.div
                    key="clear"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        borderTop: "1px solid var(--auth-glass-border)",
                        marginTop: 4,
                        paddingTop: 4,
                      }}
                    >
                      <motion.button
                        type="button"
                        onClick={() => handleSelect(undefined)}
                        whileHover={{
                          backgroundColor: "rgba(211, 47, 47, 0.08)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          padding: "7px 10px",
                          borderRadius: 8,
                          border: "none",
                          cursor: "pointer",
                          background: "transparent",
                          color: "var(--error-color)",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {t("common.clear_filter", {
                          defaultValue: "Clear filter",
                        })}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdown;
