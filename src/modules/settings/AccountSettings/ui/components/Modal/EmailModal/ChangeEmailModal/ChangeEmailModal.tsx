import "../../UsernameModal/usernameModal.style.css";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IUpdateEmail } from "../../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToastError } from "@/hooks/useToastError";
import { RESOURCE } from "@/common/enums/enums";
import Input from "@/components/Input/Input";
import { clearError, updateEmail } from "@/modules/settings/AccountSettings/api/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangeEmailModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const { LOADING_UPDATE_EMAIL, ERROR_UPDATE_EMAIL } = useAppSelector(
    (state) => state[RESOURCE.ACCOUNT_SETTINGS]
  );
  const { me } = useAppSelector((state) => state[RESOURCE.PROFILE]);
  const { authToken } = useAppSelector((state) => state[RESOURCE.AUTH]);

  const initialState: IUpdateEmail = {
    email: null,
    token: authToken,
  };

  const validate = ({ email }: IUpdateEmail): Record<string, any> => {
    const errors: Record<string, any> = {};

    if (!email || !checkEmptyString(email)) {
      errors.email = t("error_messages.this_field_required");
      return errors;
    }

    const value = email.trim();

    if (value.length > 254) {
      errors.email = t("error_messages.email_too_long");
      return errors;
    }

    const atCount = (value.match(/@/g) || []).length;
    if (atCount !== 1) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    const [localPart, domainPart] = value.split("@");

    if (!localPart || !domainPart) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    if (localPart.length > 64) {
      errors.email = t("error_messages.email_local_part_too_long");
      return errors;
    }

    if (/\.\./.test(localPart) || /\.\./.test(domainPart)) {
      errors.email = t("error_messages.email_consecutive_dots");
      return errors;
    }

    const localAllowedRe = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    if (!localAllowedRe.test(localPart)) {
      errors.email = t("error_messages.email_invalid_local_chars");
      return errors;
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    const domainLabels = domainPart.split(".");
    if (domainLabels.some((label) => label.length === 0)) {
      errors.email = t("error_messages.email_invalid_domain");
      return errors;
    }

    const domainLabelRe = /^[A-Za-z0-9-]+$/;
    for (const label of domainLabels) {
      if (label.length < 1 || label.length > 63) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
      if (!domainLabelRe.test(label)) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
      if (label.startsWith("-") || label.endsWith("-")) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
    }

    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[A-Za-z]{2,}$/.test(tld)) {
      errors.email = t("error_messages.email_invalid_domain");
      return errors;
    }

    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simpleEmailRe.test(value)) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validate(values),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(updateEmail(values));
      const res = unwrapResult(actionResult);
      if (res) {
        resetForm();
        setSuccess(true);
        setEmail(values.email);
        // snack.success(t("user_messages.email_changed_successfully"));
        // onClose();
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

  const handleClose = () => {
    setSuccess(false);
    setEmail(null);
    formik.resetForm();
    onClose();
  };

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (
          LOADING_UPDATE_EMAIL ||
          ERROR_UPDATE_EMAIL ||
          (!success && !formik.values.email)
        )
          return;

        if (success) handleClose();
        else formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (LOADING_UPDATE_EMAIL || ERROR_UPDATE_EMAIL) return;
        onClose();
      }
    },
    [open, LOADING_UPDATE_EMAIL, ERROR_UPDATE_EMAIL, formik, onClose]
  );

  useToastError({
    error: ERROR_UPDATE_EMAIL,
    clearErrorAction: () => clearError("updateEmail"),
  });

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onMouseDown={handleOverlayPointerDown}
    >
      <div className="account-settings-modal-container">
        {!success && (
          <div className="account-settings-modal-header">
            <h2 className="account-settings-modal-title">
              {t("common.update_email")}
            </h2>
            <p className="account-settings-modal-subtitle">
              {t("common.update_email_description")}
            </p>
          </div>
        )}

        {success ? (
          <div className="account-settings-modal-success">
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
              <h3>
                {t("user_messages.email_confirmation_sent") ||
                  "Confirmation email sent"}
              </h3>
              <p>
                {email
                  ? t("user_messages.check_inbox_for_confirmation", {
                      email,
                    })
                  : t("user_messages.check_inbox")}
              </p>
            </div>

            <div className="account-settings-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="account-settings-modal-btn account-settings-modal-btn-cancel"
                disabled={LOADING_UPDATE_EMAIL}
              >
                {t("common.ok")}
              </button>
            </div>
          </div>
        ) : (
          <div className="account-settings-modal-form">
            <div className="account-settings-modal-field">
              <Input
                size="medium"
                id="email"
                type="email"
                name="email"
                label={t("common.email")}
                value={formik.values.email || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                hasError={!!formik.errors.email}
                disabled={LOADING_UPDATE_EMAIL}
                autoFocus
                autoComplete="off"
              />
              {formik.errors.email && formik.touched.email && (
                <span className="account-settings-modal-error">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="account-settings-modal-actions">
              <button
                type="button"
                onClick={handleClose}
                className="account-settings-modal-btn account-settings-modal-btn-cancel"
                disabled={LOADING_UPDATE_EMAIL}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="account-settings-modal-btn account-settings-modal-btn-save"
                disabled={
                  LOADING_UPDATE_EMAIL ||
                  !formik.values.email ||
                  me?.user.email === formik.values.email
                }
              >
                {LOADING_UPDATE_EMAIL ? (
                  <span className="account-settings-modal-loader" />
                ) : (
                  t("common.save")
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChangeEmailModal;
