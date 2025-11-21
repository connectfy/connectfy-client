import { useTranslation } from "react-i18next";
import "./index.style.css";
import { Fragment } from "react/jsx-runtime";
import { FC } from "react";
import { TriangleAlert } from "lucide-react";

interface Props {
  open: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  handleDiscardChanges: () => void;
}

const SaveChangesModal: FC<Props> = ({
  open,
  handleSave,
  handleCancel,
  handleDiscardChanges,
}) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      {open && (
        <div className="unsaved-changes-overlay">
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
              >
                {t("common.discard") || "Discard"}
              </button>
              <button
                className="unsaved-btn unsaved-btn-cancel"
                onClick={handleCancel}
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                className="unsaved-btn unsaved-btn-save"
                onClick={handleSave}
              >
                {t("common.save") || "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SaveChangesModal;
