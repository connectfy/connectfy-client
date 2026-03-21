import { ContextMenuContext } from "@/context/ContextMenuContext";
import { useContext } from "react";

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within ContextMenuProvider");
  }

  const handleContextMenu = (e: React.MouseEvent, content: React.ReactNode) => {
    e.preventDefault();
    context.openMenu(e.clientX, e.clientY, content);
  };

  return { handleContextMenu, closeMenu: context.closeMenu };
};
