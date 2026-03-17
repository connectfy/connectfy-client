import { Check, LucideProps, X } from "lucide-react";
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
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[480px] max-h-[80vh] bg-(--bg-color) rounded-xl shadow-(--card-shadow) z-1000000 flex flex-col animate-in fade-in zoom-in-95 duration-300 sm:w-[95%] sm:max-h-[85vh]"
          style={{ animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-4 border-b border-(--border-color)">
            <h3 className="m-0 text-[18px] sm:text-[16px] font-semibold text-(--text-color)">
              {title}
            </h3>
            <Button
              className="w-8 h-8 flex items-center justify-center rounded-md text-(--muted-color) hover:bg-(--secondary-color) hover:text-(--text-color) active:scale-95 transition-all"
              onClick={onClose}
              aria-label="Close modal"
              icon={<X size={18} />}
            />
          </div>

          {/* Content */}
          <div className="p-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[var(--muted-color)] scrollbar-track-transparent">
            {selections.map((selection) => {
              const Icon = selection.icon;
              const isActive = selection.key === activeKey;

              return (
                <Button
                  key={selection.key}
                  className={`flex items-center gap-3 w-full p-3 mb-3 rounded-lg text-left transition-all duration-200 active:scale-[0.98] last:mb-0
                    ${
                      isActive
                        ? "bg-(--active-bg) shadow-(--active-shadow)"
                        : "bg-transparent hover:bg-black/5 dark:hover:bg-(--secondary-color)"
                    }`}
                  onClick={() => {
                    selection.onClick();
                    onClose();
                  }}
                >
                  {/* Icon Wrapper */}
                  <div
                    className={`flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 shrink-0 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-(--primary-color) text-white"
                        : "bg-(--secondary-color) text-(--text-color)"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col gap-[2px]">
                    <div className="text-[15px] sm:text-[14px] font-medium text-(--text-color) leading-[1.4]">
                      {selection.name}
                    </div>
                    {selection.title && (
                      <div className="text-[13px] sm:text-[12px] text-(--muted-color) leading-[1.4]">
                        {selection.title}
                      </div>
                    )}
                  </div>

                  {/* Check Icon */}
                  {isActive && (
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 rounded-full bg-(--primary-color) text-white">
                      <Check size={18} />
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
