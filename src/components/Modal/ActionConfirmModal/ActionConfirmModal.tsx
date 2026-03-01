import { FC, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import Modal from "..";
import Button from "@/components/ui/CustomButton/Button/Button";
import { LucideProps } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  header: { title: string };
  children?: string | ReactNode;
  cancelBtn: { title: string };
  confirmBtn: { title: string; color: string };
  icon?: {
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
  return (
    <Modal open={open} onClose={onClose} onMouseDown={onMouseDown}>
      <div
        className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-(--card-bg) shadow-2xl animate-slide-up"
        // style={{
        //   position: "fixed",
        //   top: "50%",
        //   left: "50%",
        //   transform: "translate(-50%, -50%)",
        // }}
      >
        <div className="flex flex-col items-center p-8">
          {/* Icon with Soft Glow */}
          {icon && (
            <div className="relative mb-6">
              <div
                className="absolute inset-0 scale-150 blur-2xl opacity-20 rounded-full"
                style={{ backgroundColor: icon.color }}
              />
              <div
                className="relative flex items-center justify-center rounded-full p-4 ring-8 ring-opacity-10"
                style={
                  {
                    backgroundColor: `${icon.color}15`,
                    color: icon.color,
                    boxShadow: `inset 0 0 0 1px ${icon.color}30`,
                    "--tw-ring-color": icon.color,
                  } as any
                }
              >
                <icon.content size={32} strokeWidth={2.5} />
              </div>
            </div>
          )}

          {/* Header */}
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-(--text-color)">
            {header.title}
          </h2>

          {/* Body Content */}
          <div className="w-full">
            {typeof children === "string" ? (
              <p className="text-center text-[15px] leading-relaxed text-(--muted-color)">
                {children}
              </p>
            ) : (
              children
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex w-full gap-3">
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => onCancel()}
              className="flex-1 rounded-xl border border-(--border-color) bg-transparent py-3 text-sm font-semibold text-(--text-color) transition-all hover:bg-(--disabled-bg) active:scale-95"
              title={cancelBtn.title}
            />
            <Button
              type="button"
              disabled={isLoading}
              onClick={() => onConfirm()}
              style={{ backgroundColor: confirmBtn.color }}
              className="flex flex-1 items-center justify-center rounded-xl py-3 text-sm font-semibold text-white shadow-lg shadow-opacity-20 transition-all hover:brightness-110 active:scale-95"
              title={confirmBtn.title}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ActionConfirmModal;
