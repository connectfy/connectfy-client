import React, { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void; // Function yerinə daha dəqiq tip
  children: ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal: FC<Props> = ({ open, onClose, children, onMouseDown }) => {
  // ESC düyməsi ilə bağlama məntiqi
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    // Modal açıq olduqda body-də scroll-u bağlamaq istəsəniz:
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Yalnız overlay-ə kliklədikdə bağla
    if (e.target === e.currentTarget) {
      onClose();
    }
    if (onMouseDown) onMouseDown(e);
  };

  return ReactDOM.createPortal(
    <section
      role="dialog"
      aria-modal="true"
      onMouseDown={handleMouseDown}
      className="fixed inset-0 z-1000 flex h-full w-full items-center justify-center bg-black/60 backdrop-blur-xs transition-all"
    >
      {children}
    </section>,
    document.body,
  );
};

export default Modal;
