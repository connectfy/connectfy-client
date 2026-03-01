import { FC } from "react";
import { useTranslation } from "react-i18next";
import { TriangleAlert } from "lucide-react";
import Modal from "..";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Props {
  open: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  handleDiscardChanges: () => void;
  isLoading: boolean;
}

const SaveChangesModal: FC<Props> = ({
  open,
  handleSave,
  handleCancel,
  handleDiscardChanges,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      onMouseDown={handleOverlayPointerDown}
    >
      <div className="bg-(--auth-main-bg) rounded-2xl p-8 max-w-[480px] w-[90%] shadow-(--card-shadow) animate-fade-in mx-auto">
        <div className="flex justify-center mb-4 animate-bounce-custom">
          <TriangleAlert size={50} className="text-(--error-color)" />
        </div>

        <h2 className="text-2xl font-bold text-(--text-primary) mb-3 text-center sm:text-xl">
          {t("common.unsaved_changes") || "Unsaved Changes"}
        </h2>

        <p className="text-[15px] text-(--text-secondary) mb-6 text-center leading-relaxed">
          {t("common.unsaved_changes_message") ||
            "You have unsaved changes. Do you want to save them before leaving?"}
        </p>

        <div className="flex gap-3 justify-center">
          {/* Discard Button */}
          <Button
            className="flex-1 px-6 py-3 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 bg-(--input-bg) text-(--text-primary) hover:bg-red-500/10 hover:text-red-500 dark:bg-(--auth-glass-bg) dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDiscardChanges}
            disabled={isLoading}
            title={t("common.discard")}
          />

          {/* Cancel Button */}
          <Button
            className="flex-1 px-6 py-3 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 bg-(--input-bg) text-(--text-primary) hover:bg-(--input-border) dark:bg-(--auth-glass-bg) disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCancel}
            disabled={isLoading}
            title={t("common.cancel")}
          />

          {/* Save Button */}
          <Button
            className="flex-1 px-6 py-3 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 bg-linear-to-br from-(--third-color) to-(--hover-bg) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleSave}
            disabled={isLoading}
            isLoading={isLoading}
            title={t("common.save")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SaveChangesModal;
