import { FC, useRef, useEffect, useState } from "react";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import {
  motion,
  AnimatePresence,
  TargetAndTransition,
  VariantLabels,
} from "framer-motion";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import Button from "../../CustomButton/Button/Button";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  subMenu?: DropdownOption[];
  className?: string;
  isActive?: boolean; // YENİ: Alt menyuda seçilmiş elementi tanımaq üçün
}

interface DropdownProps {
  title?: string;
  options: DropdownOption[];
  selected?: string | null;
  icon?: React.ReactNode;
  animation?: {
    whileTap?: TargetAndTransition | VariantLabels;
    whileHover?: TargetAndTransition | VariantLabels;
    animate?: boolean;
  };
  tooltip?: string;
  className?: string;
}

const Dropdown: FC<DropdownProps> = ({
  title,
  options,
  selected,
  animation,
  tooltip,
  icon,
  className,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<DropdownOption[] | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setTimeout(() => setActiveSubMenu(null), 200);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (opt: DropdownOption) => {
    if (opt.subMenu) {
      setActiveSubMenu(opt.subMenu);
    } else {
      opt.onClick?.();
      setOpen(false);
      setTimeout(() => setActiveSubMenu(null), 200);
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <Tooltip placement="top" title={tooltip}>
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileTap={animation?.whileTap || { scale: 0.92 }}
          whileHover={
            animation?.whileHover || {
              backgroundColor: "rgba(128, 128, 128, 0.1)",
            }
          }
          className="flex items-center justify-center w-9 h-9 rounded-lg border-none cursor-pointer bg-transparent text-(--text-color)"
        >
          <motion.span
            animate={{ rotate: open && animation?.animate ? 180 : 0 }}
            transition={{ duration: 0.28 }}
            className="flex items-center"
          >
            {icon}
          </motion.span>
        </motion.button>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            className="absolute right-0 top-full mt-2 z-50 min-w-[190px] p-1.5 bg-(--auth-main-bg) border border-(--auth-glass-border) rounded-2xl shadow-xl overflow-hidden origin-top-right"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubMenu ? "sub" : "main"}
                initial={{ x: activeSubMenu ? 20 : -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: activeSubMenu ? -20 : 20, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {activeSubMenu ? (
                  <Button
                    onClick={() => setActiveSubMenu(null)}
                    className="flex items-center gap-2 w-full px-3 py-2 mb-1 text-xs font-bold text-(--muted-color) hover:text-(--text-color) border-b border-(--auth-glass-border) transition-colors bg-transparent border-x-0 border-t-0"
                  >
                    <ChevronLeft size={14} /> {t("common.back", "Geri")}
                  </Button>
                ) : (
                  title && (
                    <div className="px-3 py-2 text-[10px] uppercase font-bold text-(--muted-color) opacity-60">
                      {title}
                    </div>
                  )
                )}

                {(activeSubMenu || options).map((opt) => {
                  // DƏYİŞİKLİK BURADADIR: Aktivlik həm 'selected' propundan, həm də option-ın özündən gələ bilər
                  const isActive = selected === opt.value || opt.isActive;

                  return (
                    <Button
                      key={opt.value}
                      onClick={() => handleSelect(opt)}
                      className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-all border-none cursor-pointer bg-transparent group ${
                        isActive
                          ? "bg-(--primary-color)/10 text-(--primary-color) font-semibold"
                          : "text-(--text-color) hover:bg-black/5 dark:hover:bg-white/5"
                      } ${opt.className || ""}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {opt.icon && (
                          <span className="opacity-70 group-hover:opacity-100">
                            {opt.icon}
                          </span>
                        )}
                        {opt.label}
                      </div>
                      {opt.subMenu ? (
                        <ChevronRight size={14} className="opacity-40" />
                      ) : (
                        isActive && <Check size={14} strokeWidth={3} />
                      )}
                    </Button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
