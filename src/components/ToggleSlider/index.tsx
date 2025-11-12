import { FC } from "react";
import "./index.style.css";

interface Props {
  checked: boolean;
  onClick: () => void;
}

const ToggleSlider: FC<Props> = ({ checked, onClick }) => {
  return (
    <div
      className={`toggle-switch ${checked ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="toggle-slider"></div>
    </div>
  );
};

export default ToggleSlider;
