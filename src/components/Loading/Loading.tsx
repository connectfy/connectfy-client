import MainIcon from "@/assets/icons/MainIcon";
import "./loading.style.css";
import { CSSProperties } from "react";

interface Props {
  description?: {
    title?: string;
    titleStyle?: CSSProperties;
  };
}

export default function MainSpinner({ description }: Props) {
  return (
    <div className="spinner-container">
      <div className="spinner-icon">
        <MainIcon styles={{ width: 100, height: 100 }} />
      </div>

      <div className="dots-loader">
        <span />
        <span />
        <span />
      </div>

      <div className="spinner-text">Connectfy</div>

      {description && (
        <span style={description.titleStyle}>{description.title}</span>
      )}
    </div>
  );
}
