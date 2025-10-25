import React from "react";

export function onPressEnter(
  e: React.KeyboardEvent<HTMLElement>,
  onPress: () => void
) {
  if (e.key === "Enter") {
    e.preventDefault();
    onPress();
  }
}

export function onPressEsc(
  e: React.KeyboardEvent<HTMLElement>,
  onPress: () => void
) {
  if (e.key === "Escape") {
    e.preventDefault();
    onPress();
  }
}

// ============ DİGƏR FAYDALI KEY DƏYƏRLƏRI ============
/*
e.key === "Enter"       // ✅ Enter düyməsi
e.key === "Escape"      // ✅ Esc düyməsi
e.key === " "           // ✅ Space düyməsi
e.key === "Tab"         // ✅ Tab düyməsi
e.key === "Backspace"   // ✅ Backspace düyməsi
e.key === "Delete"      // ✅ Delete düyməsi
e.key === "ArrowUp"     // ✅ Yuxarı ox
e.key === "ArrowDown"   // ✅ Aşağı ox
e.key === "ArrowLeft"   // ✅ Sol ox
e.key === "ArrowRight"  // ✅ Sağ ox
*/