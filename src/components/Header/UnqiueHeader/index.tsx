import { FC } from "react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save } from "lucide-react";

interface Props {
  onClickBack: () => void;
  headerTitle: string;
  headerSubtitle: string;
  showChangesButton: boolean;
  isChangesDisasbled?: boolean;
  onClickSave: () => void;
}

const UniqueHeader: FC<Props> = ({
  onClickBack,
  headerTitle,
  headerSubtitle,
  showChangesButton = false,
  isChangesDisasbled = true,
  onClickSave,
}) => {
  const { t } = useTranslation();

  return (
    <div className="unique-settings-header">
      <div className="unique-settings-header-top">
        <div className="unique-settings-header-left">
          <button
            type="button"
            className="unique-header-back-btn"
            aria-label={t("common.back")}
            onClick={onClickBack}
          >
            <ArrowLeft />
          </button>
          <h1>{headerTitle}</h1>
        </div>

        {showChangesButton && (
          <div>
            <button
              type="button"
              className="unique-header-save-btn"
              aria-label={t("common.save_changes")}
              disabled={isChangesDisasbled}
              onClick={onClickSave}
            >
              <Save fontSize="small" />
              <span>{t("common.save_changes")}</span>
            </button>
          </div>
        )}
      </div>
      <p className="unique-settings-subtitle">{headerSubtitle}</p>
    </div>
  );
};

export default UniqueHeader;
