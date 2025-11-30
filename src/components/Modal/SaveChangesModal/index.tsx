import { useTranslation } from "react-i18next";
import "./index.style.css";
import { FC } from "react";
import { TriangleAlert } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import Modal from "..";

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
      <div className="unsaved-changes-modal">
        <div className="unsaved-changes-icon">
          <TriangleAlert size={50} color="var(--error-color)" />
        </div>
        <h2>{t("common.unsaved_changes") || "Unsaved Changes"}</h2>
        <p>
          {t("common.unsaved_changes_message") ||
            "You have unsaved changes. Do you want to save them before leaving?"}
        </p>
        <div className="unsaved-changes-actions">
          <button
            className="unsaved-btn unsaved-btn-discard"
            onClick={handleDiscardChanges}
            disabled={isLoading}
          >
            {t("common.discard") || "Discard"}
          </button>
          <button
            className="unsaved-btn unsaved-btn-cancel"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {t("common.cancel") || "Cancel"}
          </button>
          <button
            className="unsaved-btn unsaved-btn-save"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : t("common.save") || "Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SaveChangesModal;
