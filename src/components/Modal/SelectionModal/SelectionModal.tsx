import "./selectionModal.style.css";
import { LucideProps } from "lucide-react";
import {
  FC,
  ForwardRefExoticComponent,
  Fragment,
  RefAttributes,
  useEffect,
} from "react";
import Modal from "..";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Selections {
  name: string;
  title?: string;
  onClick: () => void;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  key: string;
}

interface Props {
  title: string;
  selections: Selections[];
  open: boolean;
  onClose: () => void;
  activeKey: string;
}

const SelectionModal: FC<Props> = ({
  title,
  selections,
  open,
  onClose,
  activeKey,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={onClose}
        onMouseDown={handleOverlayPointerDown}
      >
        <div className="selection-modal">
          <div className="selection-modal-header">
            <h3 className="selection-modal-title">{title}</h3>
            <Button
              className="selection-modal-close"
              onClick={onClose}
              aria-label="Close modal"
              icon={<span className="material-symbols-outlined">close</span>}
            />
          </div>
          <div className="selection-modal-content">
            {selections.map((selection) => {
              const Icon = selection.icon;
              const isActive = selection.key === activeKey;

              return (
                <Button
                  key={selection.key}
                  className={`selection-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    selection.onClick();
                    onClose();
                  }}
                >
                  <div className="selection-item-icon">
                    <Icon size={20} />
                  </div>
                  <div className="selection-item-content">
                    <div className="selection-item-name">{selection.name}</div>
                    <div className="selection-item-title">
                      {selection.title}
                    </div>
                  </div>
                  {isActive && (
                    <div className="selection-item-check">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "20px" }}
                      >
                        check
                      </span>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </Modal>
    </Fragment>
  );
};

export default SelectionModal;
