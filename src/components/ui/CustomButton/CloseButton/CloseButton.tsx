import { CSSProperties, FC } from "react";
import Button from "../Button/Button";

interface Props {
  onClick: () => void;
  style?: CSSProperties;
  className?: string;
}

const CloseButton: FC<Props> = ({ onClick, style, className }) => (
  <Button
    onClick={onClick}
    style={{
      ...style,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "4px 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
      opacity: 0.8,
      transition: "opacity 0.3s ease-in-out",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
  >
    <span className={`material-symbols-outlined ${className}`}>close</span>
  </Button>
);

export default CloseButton;
