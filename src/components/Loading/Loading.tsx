import MainIcon from "@assets/icons/MainIcon";
import "./loading.style.css";

export default function MainSpinner() {
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
    </div>
  );
}
