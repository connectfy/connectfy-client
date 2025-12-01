import "../../UsernameModal/index.style.css";
import Modal from "@/components/Modal";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
}

const VerifyChangeEmail: FC<Props> = ({ open, onClose, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="account-settings-modal-container">
        <div className="account-settings-modal-success">
          {isLoading ? (
            <Fragment>
              <div
                className="success-illustration verifying-illustration"
                aria-hidden
              >
                <div className="account-settings-modal-loader" aria-hidden />

                <span className="verifying-badge" aria-hidden>
                  {/* small clock icon */}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden
                  >
                    <path
                      d="M12 7v6l4 2"
                      stroke="var(--primary-color)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="var(--primary-color)"
                      strokeWidth="1.2"
                    />
                  </svg>
                </span>
              </div>

              <div className="account-settings-modal-success-text">
                <h3>{t("common.verifying_email") || "Verifying..."}</h3>
                <p>
                  {t("common.verifying_email_sub") ||
                    "We are verifying your new email address. This may take a few seconds."}
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="success-illustration" aria-hidden>
                {/* simple check icon */}
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="11"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 12.5l2.5 2.5L17 8"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="account-settings-modal-success-text">
                <h3>{t("user_messages.email_changed_successfully")}</h3>
              </div>

              <div className="account-settings-modal-actions">
                <button
                  type="button"
                  onClick={onClose}
                  className="account-settings-modal-btn account-settings-modal-btn-cancel"
                >
                  {t("common.close")}
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VerifyChangeEmail;
