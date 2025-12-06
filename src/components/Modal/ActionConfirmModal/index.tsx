import { FC, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import "./index.style.css";
import Modal from "..";
import { LucideProps } from "lucide-react";

interface Props {
  open: boolean;
  onClose: Function;
  onConfirm: Function;
  onCancel: Function;
  header: {
    title: string;
    iconColor: string;
  };
  children?: string | ReactNode;
  cancelBtn: {
    title: string;
  };
  confirmBtn: {
    title: string;
    color: string;
  };
  icon: {
    content: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    color: string;
  };
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isLoading: boolean;
}

const ActionConfirmModal: FC<Props> = ({
  open,
  onClose,
  onConfirm,
  onCancel,
  header,
  children,
  cancelBtn,
  confirmBtn,
  icon,
  onMouseDown,
  isLoading,
}) => {
  const IconComponent = icon.content;

  return (
    <Modal open={open} onClose={onClose} onMouseDown={onMouseDown}>
      <div className="action-confirm-modal">
        <div className="action-confirm-modal__content">
          {/* Icon Section */}
          <div
            className="action-confirm-modal__icon-wrapper"
            style={{
              backgroundColor: `${icon.color}15`,
              borderColor: `${icon.color}30`,
            }}
          >
            <div
              className="action-confirm-modal__icon-circle"
              style={{ backgroundColor: `${icon.color}20` }}
            >
              <IconComponent
                className="action-confirm-modal__icon"
                style={{ color: icon.color }}
                size={32}
                strokeWidth={2}
              />
            </div>
          </div>

          {/* Header Section */}
          <div className="action-confirm-modal__header">
            <h2
              className="action-confirm-modal__title"
              style={{ color: header.iconColor }}
            >
              {header.title}
            </h2>
          </div>

          {/* Content Section */}
          {children && (
            <div className="action-confirm-modal__body">
              {typeof children === "string" ? (
                <p className="action-confirm-modal__text">{children}</p>
              ) : (
                children
              )}
            </div>
          )}

          {/* Actions Section */}
          <div className="action-confirm-modal__actions">
            <button
              className="action-confirm-modal__button action-confirm-modal__button--cancel"
              onClick={() => onCancel()}
              type="button"
              disabled={isLoading}
            >
              {cancelBtn.title}
            </button>
            <button
              className="action-confirm-modal__button action-confirm-modal__button--confirm"
              onClick={() => onConfirm()}
              style={{
                backgroundColor: confirmBtn.color,
                borderColor: confirmBtn.color,
              }}
              type="button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="authenticate-spinner" />
              ) : (
                confirmBtn.title
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmModal;
