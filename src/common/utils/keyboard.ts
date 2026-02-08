export const isMac = () => {
  return (
    typeof window !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  );
};

export const getModifierKey = () => (isMac() ? "⌘" : "Ctrl");
export const getAltKey = () => (isMac() ? "⌥" : "Alt");
export const getShiftKey = () => "Shift";
