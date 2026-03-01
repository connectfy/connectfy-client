import React, { FC, ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.style.css";

interface Props {
  open: boolean;
  onClose: Function;
  children: ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal: FC<Props> = ({ open, onClose, children, onMouseDown }) => {
  if (!open) return null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // klik overlay-də olarsa bağla, içəriyə klikdə bağlama
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
    if (onMouseDown) onMouseDown(e);
  };

  return ReactDOM.createPortal(
    <section
      id="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleMouseDown}
    >
      {children}
    </section>,
    document.body,
  );
};

export default Modal;
