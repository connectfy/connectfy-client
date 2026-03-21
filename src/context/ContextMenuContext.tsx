import ContextMenuRenderer from "@/components/ContextMenu/ContextMenuRenderer";
import { createContext, useState, useCallback, ReactNode } from "react";

interface ContextMenuState {
  x: number;
  y: number;
  content: ReactNode;
  isOpen: boolean;
}

interface ContextMenuContextType {
  openMenu: (x: number, y: number, content: ReactNode) => void;
  closeMenu: () => void;
}

export const ContextMenuContext = createContext<ContextMenuContextType | null>(
  null,
);

export const ContextMenuProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ContextMenuState>({
    x: 0,
    y: 0,
    content: null,
    isOpen: false,
  });

  const openMenu = useCallback((x: number, y: number, content: ReactNode) => {
    setState({ x, y, content, isOpen: true });
  }, []);

  const closeMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ContextMenuContext.Provider value={{ openMenu, closeMenu }}>
      {children}
      <ContextMenuRenderer {...state} onClose={closeMenu} />
    </ContextMenuContext.Provider>
  );
};
