import {
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import "./index.style.css";
import { LucideProps } from "lucide-react";
import ToggleSlider from "@/components/ToggleSlider";

interface Props {
  header?: {
    icon?: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    title?: string;
    subtitle?: string;
    iconStyle?: CSSProperties;
    headerStyle?: CSSProperties;
  };
  slider: {
    checked: boolean;
    onClick: () => void;
  };
}

const ToggleCard: FC<Props> = ({ header, slider }) => {
  return (
    <div className="toggle-card">
      <div className="toggle-card-header" style={header?.headerStyle}>
        {header?.icon && (
          <div className="toggle-card-icon" style={header.iconStyle}>
            <header.icon size={20} />
          </div>
        )}
        {(header?.title || header?.subtitle) && (
          <div className="toggle-card-title">
            <h3>{header?.title}</h3>
            <p>{header?.subtitle}</p>
          </div>
        )}
        <ToggleSlider checked={slider.checked} onClick={slider.onClick} />
      </div>
    </div>
  );
};

export default ToggleCard;
