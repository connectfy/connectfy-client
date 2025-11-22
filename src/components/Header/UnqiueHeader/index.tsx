import { FC, Fragment } from "react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Save } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";

interface Props {
  onClickBack: () => void;
  headerTitle: string;
  headerSubtitle: string;
  showChangesButton?: boolean;
  isChangesDisasbled?: boolean;
  onClickSave?: () => void;
  isLoading?: boolean;
}

const UniqueHeader: FC<Props> = ({
  onClickBack,
  headerTitle,
  headerSubtitle,
  showChangesButton = false,
  isChangesDisasbled = true,
  onClickSave,
  isLoading,
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
              {isLoading ? (
                <Spinner size={20} />
              ) : (
                <Fragment>
                  <Save fontSize="small" />
                  <span>{t("common.save_changes")}</span>
                </Fragment>
              )}
            </button>
          </div>
        )}
      </div>
      <p className="unique-settings-subtitle">{headerSubtitle}</p>
    </div>
  );
};

export default UniqueHeader;
