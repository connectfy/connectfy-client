import { FC, ReactNode } from "react";
import "./index.style.css";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Modal: FC<Props> = ({ open, children, onMouseDown }) => {
  if (!open) return;

  return (
    <section
      id="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={onMouseDown}
    >
      {children}
    </section>
  );
};

export default Modal;
