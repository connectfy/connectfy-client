import React from "react";
import { isMac } from "@/common/utils/keyboard";

interface ShortcutTooltipProps {
  keys: string[];
  children: React.ReactNode;
  fullWidth?: boolean;
}

const KeyIcon: React.FC<{ icon: string }> = ({ icon }) => (
  <span
    className="material-symbols-outlined flex items-center justify-center"
    style={{ fontSize: "14px", lineHeight: "14px" }}
  >
    {icon}
  </span>
);

export const ShortcutTooltip: React.FC<ShortcutTooltipProps> = ({
  keys,
  children,
  fullWidth = true,
}) => {
  const displayKeys = keys.map((key) => {
    if (key === "Ctrl") {
      return isMac() ? <KeyIcon icon="keyboard_command_key" /> : "Ctrl";
    }
    if (key === "Alt") {
      return isMac() ? <KeyIcon icon="keyboard_option_key" /> : "Alt";
    }
    return key;
  });

  return (
    <div className={`group relative ${fullWidth ? "flex-1" : "inline-block"}`}>
      {children}
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-700 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap z-50 pointer-events-none">
        <div className="flex items-center gap-1">
          {displayKeys.map((key, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-slate-400 mx-0.5">+</span>}
              <kbd className="px-2 py-1.5 text-xs font-semibold text-heading bg-neutral-tertiary border border-default-medium rounded-md">
                {key}
              </kbd>
            </React.Fragment>
          ))}
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-slate-900" />
        </div>
      </div>
    </div>
  );
};
