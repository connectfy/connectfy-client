import {
  CSSProperties,
  FC,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import "./index.style.css";
import { LucideProps } from "lucide-react";

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
  content?: ReactNode;
  contentStyle?: CSSProperties;
  cardStyle?: CSSProperties;
}

const SettingCard: FC<Props> = ({
  header,
  content,
  contentStyle,
  cardStyle,
}) => {
  return (
    <div className="setting-card" style={cardStyle}>
      <div className="setting-card-header">
        {header?.icon && (
          <div className="setting-icon" style={header.iconStyle}>
            <header.icon size={20} />
          </div>
        )}
        {(header?.title || header?.subtitle) && (
          <div className="setting-card-title">
            <h3>{header?.title}</h3>
            <p>{header?.subtitle}</p>
          </div>
        )}
      </div>
      <div style={contentStyle}>{content}</div>
    </div>
  );
};

export default SettingCard;
