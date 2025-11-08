import { closeSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

const CloseButton = ({ snackbarKey }: { snackbarKey: any }) => (
  <button
    onClick={() => closeSnackbar(snackbarKey)}
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
      transition: "opacity 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
  >
    <CloseIcon style={{ fontSize: 18 }} />
  </button>
);

export default CloseButton;
