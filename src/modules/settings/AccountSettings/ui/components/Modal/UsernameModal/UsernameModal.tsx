import "./usernameModal.style.css";
import { FC, useCallback, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IUpdateUsername } from "../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToastError } from "@/hooks/useToastError";
import { RESOURCE } from "@/common/enums/enums";
import Input from "@/components/Input/Input";
import { snack } from "@/common/utils/snackManager";
import { clearError, updateUsername } from "@/modules/settings/AccountSettings/api/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UsernameModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { LOADING_UPDATE_USERNAME, ERROR_UPDATE_USERNAME } = useAppSelector(
    (state) => state[RESOURCE.ACCOUNT_SETTINGS]
  );
  const { me } = useAppSelector((state) => state[RESOURCE.PROFILE]);
  const { authToken } = useAppSelector((state) => state[RESOURCE.AUTH]);

  const initialState: IUpdateUsername = {
    username: null,
    token: authToken,
  };

  const validate = ({ username }: IUpdateUsername): Record<string, any> => {
    const errors: Record<string, any> = {};
    const usernameRegex = /^[A-Za-z0-9._-]+$/;

    if (!username || !checkEmptyString(username))
      errors.username = t("error_messages.this_field_required");
    else if (!usernameRegex.test(username))
      errors.username = t("error_messages.invalid_username");
    else if (username.length < 3)
      errors.username = t("error_messages.min_length", { length: 3 })

    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validate(values),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(updateUsername(values));
      const res = unwrapResult(actionResult);
      if (res) {
        snack.success(t("user_messages.username_changed_successfully"));
        resetForm();
        onClose();
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

  useToastError({
    error: ERROR_UPDATE_USERNAME,
    clearErrorAction: () => clearError("updateUsername"),
  });

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (
          LOADING_UPDATE_USERNAME ||
          ERROR_UPDATE_USERNAME ||
          !formik.values.username
        )
          return;
        formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (LOADING_UPDATE_USERNAME || ERROR_UPDATE_USERNAME) return;
        onClose();
      }
    },
    [open, LOADING_UPDATE_USERNAME, ERROR_UPDATE_USERNAME, formik, onClose]
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
            {t("common.change_username")}
          </h2>
          <p className="account-settings-modal-subtitle">
            {t("common.update_username_description")}
          </p>
        </div>

        <div className="account-settings-modal-form">
          <div className="account-settings-modal-field">
            <Input
              size="medium"
              id="username"
              name="username"
              label={t("common.username")}
              value={formik.values.username || ""}
              onChange={(e) => {
                  const value = e.target.value || null;

                  if (value && value.length > 30) return;

                  formik.setFieldValue("username", value);
                }}
              onBlur={formik.handleBlur}
              hasError={!!formik.errors.username}
              disabled={LOADING_UPDATE_USERNAME}
              autoFocus
              autoComplete="off"
            />
            {formik.errors.username && formik.touched.username && (
              <span className="account-settings-modal-error">
                {formik.errors.username}
              </span>
            )}
          </div>

          <div className="account-settings-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="account-settings-modal-btn account-settings-modal-btn-cancel"
              disabled={LOADING_UPDATE_USERNAME}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="account-settings-modal-btn account-settings-modal-btn-save"
              disabled={
                LOADING_UPDATE_USERNAME ||
                !formik.values.username ||
                me?.user.username === formik.values.username
              }
            >
              {LOADING_UPDATE_USERNAME ? (
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

export default UsernameModal;
