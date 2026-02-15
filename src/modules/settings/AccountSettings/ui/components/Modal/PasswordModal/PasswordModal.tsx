import "../UsernameModal/usernameModal.style.css";
import { FC, useCallback, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdatePassword } from "../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import { snack } from "@/common/utils/snackManager";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useUpdatePasswordMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";
import { useErrors } from "@/hooks/useErrors";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PasswordModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { getToken } = useAuthTokenManager();
  const authToken = getToken("authenticateToken");

  const [
    updatePassword,
    { isLoading: LOADING_UPDATE_PASSWORD, error: ERROR_UPDATE_PASSWORD },
  ] = useUpdatePasswordMutation();

  const { showResponseErrors } = useErrors();

  const initialState: IUpdatePassword = {
    password: null,
    confirmPassword: null,
    token: authToken as string,
  };

  const validate = ({
    password,
    confirmPassword,
  }: IUpdatePassword): Record<string, any> => {
    const errors: Record<string, any> = {};

    const passwordComplexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (!password || !checkEmptyString(password))
      errors.password = t("error_messages.password_is_required");
    else if (password.length < 8 || !passwordComplexityRegex.test(password))
      errors.password = t("error_messages.password_rule");

    if (password !== confirmPassword)
      errors.confirmPassword = t("error_messages.password_mismatch");

    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validate(values),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await updatePassword(values).unwrap();
        if (res) {
          snack.success(t("user_messages.password_changed_successfully"));
          resetForm();
          onClose();
        }
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (
          LOADING_UPDATE_PASSWORD ||
          ERROR_UPDATE_PASSWORD ||
          !formik.values.password ||
          !formik.values.confirmPassword
        )
          return;
        formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (LOADING_UPDATE_PASSWORD || ERROR_UPDATE_PASSWORD) return;
        onClose();
      }
    },
    [open, LOADING_UPDATE_PASSWORD, ERROR_UPDATE_PASSWORD, formik, onClose],
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="account-settings-modal-container">
        <div className="account-settings-modal-header">
          <h2 className="account-settings-modal-title">
            {t("common.change_password")}
          </h2>
          <p className="account-settings-modal-subtitle">
            {t("common.change_password_description")}
          </p>
        </div>

        <div className="account-settings-modal-form">
          <div className="account-settings-modal-field">
            <div style={{ marginBottom: "5px" }}>
              <PasswordInput
                size="medium"
                id="password"
                name="password"
                label={t("common.password")}
                value={formik.values.password || ""}
                onChange={(e) => {
                  const value = e.target.value || null;

                  if (value && value.length > 30) return;

                  formik.setFieldValue("password", value);
                }}
                onBlur={formik.handleBlur}
                hasError={!!formik.errors.password}
                disabled={LOADING_UPDATE_PASSWORD}
                autoFocus
                autoComplete="off"
                showGenerateIcon
                onGenerate={(value?: string) => {
                  navigator.clipboard.writeText(value as string);
                  snack.info(t("user_messages.password_generated_message"), {
                    anchorOrigin: {
                      vertical: "top",
                      horizontal: "center",
                    },
                    autoHideDuration: 15000,
                  });

                  formik.setFieldValue("password", value);
                  formik.setFieldValue("confirmPassword", value);
                }}
              />
              {formik.errors.password && formik.touched.password && (
                <span className="account-settings-modal-error">
                  {formik.errors.password}
                </span>
              )}
            </div>
            <div>
              <PasswordInput
                size="medium"
                id="confirmPassword"
                name="confirmPassword"
                label={t("common.confirm_password")}
                value={formik.values.confirmPassword || ""}
                onChange={(e) => {
                  const value = e.target.value || null;

                  if (value && value.length > 30) return;

                  formik.setFieldValue("confirmPassword", value);
                }}
                onBlur={formik.handleBlur}
                hasError={!!formik.errors.confirmPassword}
                disabled={LOADING_UPDATE_PASSWORD}
                autoComplete="off"
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <span className="account-settings-modal-error">
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>
          </div>

          <div className="account-settings-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="account-settings-modal-btn account-settings-modal-btn-cancel"
              disabled={LOADING_UPDATE_PASSWORD}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="account-settings-modal-btn account-settings-modal-btn-save"
              disabled={
                LOADING_UPDATE_PASSWORD ||
                !formik.values.password ||
                !formik.values.confirmPassword
              }
            >
              {LOADING_UPDATE_PASSWORD ? (
                <span className="account-settings-modal-loader" />
              ) : (
                t("common.save")
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordModal;
