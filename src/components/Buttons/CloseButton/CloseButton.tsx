import CloseIcon from "@mui/icons-material/Close";
import { CSSProperties, FC } from "react";

interface Props {
  onClick: () => void;
  style?: CSSProperties
}

const CloseButton: FC<Props> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
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
    <CloseIcon style={{ fontSize: 18 }} />
  </button>
);

export default CloseButton;
