import Modal from "@/components/Modal";
import Button from "@/components/ui/CustomButton/Button/Button";
import { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  isFailed: boolean;
}

const VerifyChangeEmailModal: FC<Props> = ({
  open,
  onClose,
  isLoading,
  isFailed,
}) => {
  const { t } = useTranslation();

  if (!isLoading && isFailed) {
    onClose();
    return;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto overflow-hidden">
        <div className="flex flex-col items-center text-center animate-fade-in py-4">
          {isLoading ? (
            <Fragment>
              {/* Verifying Loading Illustration */}
              <div
                className="relative w-20 h-20 bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.03)] rounded-full flex items-center justify-center mb-6"
                aria-hidden
              >
                {/* Spinner */}
                <div
                  className="w-10 h-10 border-4 border-black/10 dark:border-white/10 border-t-(--primary-color) rounded-full animate-spin"
                  aria-hidden
                />

                {/* Badge Icon */}
                <span
                  className="absolute -right-1.5 -bottom-1.5 w-8 h-8 rounded-full flex items-center justify-center bg-(--auth-main-bg) border border-(--input-border) shadow-md"
                  aria-hidden
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 7v6l4 2"
                      stroke="var(--primary-color)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="8"
                      stroke="var(--primary-color)"
                      strokeWidth="1.8"
                    />
                  </svg>
                </span>
              </div>

              {/* Texts */}
              <div className="mb-2">
                <h3 className="text-xl font-bold text-(--text-primary) mb-3 m-0">
                  {t("common.verifying_email") || "Verifying..."}
                </h3>
                <p className="text-[15px] text-(--muted-color) leading-relaxed max-w-[340px] m-0 mx-auto">
                  {t("common.verifying_email_sub") ||
                    "We are verifying your new email address. This may take a few seconds."}
                </p>
              </div>
            </Fragment>
          ) : (
            <Fragment>
              {/* Success Illustration */}
              {!isFailed && (
                <Fragment>
                  <div
                    className="w-20 h-20 bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.03)] rounded-full flex items-center justify-center mb-6 animate-bounce-custom"
                    aria-hidden
                  >
                    <span
                      className="material-symbols-outlined text-(--primary-color)"
                      style={{ fontSize: "40px" }}
                    >
                      check_circle
                    </span>
                  </div>

                  {/* Texts */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-(--text-primary) m-0">
                      {t("user_messages.email_changed_successfully")}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className="w-full flex justify-center">
                    <Button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-2/3 px-6 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border)"
                      title={t("common.close")}
                    />
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default VerifyChangeEmailModal;
