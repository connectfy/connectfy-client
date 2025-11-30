import { FC, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import "./index.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { IAuthenticateUser } from "@/types/auth/auth/auth.type";
import { useFormik } from "formik";
import { checkEmptyString } from "@/utils/checkValues";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Resource, TOKEN_TYPE } from "@/types/enum.types";
import { useToastError } from "@/hooks/useToastError";
import { authenticateUser, clearError } from "@/features/auth/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Modal from "..";

interface Props {
  open: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  authType: TOKEN_TYPE;
}

const AuthenticateModal: FC<Props> = ({
  open,
  onClose,
  onAuthenticate,
  authType,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { LOADING_AUTHENTICATE_USER, ERROR_AUTHENTICATE_USER } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const initialState: IAuthenticateUser = {
    password: null,
    type: authType,
  };

  const validate = ({ password }: IAuthenticateUser): Record<string, any> => {
    const errors: Record<string, any> = {};

    if (!password || !checkEmptyString(password)) {
      errors.password = t("error_messages.this_field_required");
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
      const actionResult = await dispatch(authenticateUser(values));
      const res = unwrapResult(actionResult);
      if (res) {
        onAuthenticate();
        resetForm();
        onClose();
      }
    },
  });

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (LOADING_AUTHENTICATE_USER) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isButtonsDisabled =
    LOADING_AUTHENTICATE_USER || ERROR_AUTHENTICATE_USER;

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (isButtonsDisabled || !formik.values.password) return;
        formik.submitForm().catch((err) => console.error("submit error:", err));
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (isButtonsDisabled) return;
        onClose();
      }
    },
    [open, isButtonsDisabled, formik, onClose]
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  useToastError({
    error: ERROR_AUTHENTICATE_USER,
    clearErrorAction: () => clearError("authenticateUser"),
  });

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="authenticate-modal">
        <div className="authenticate-icon">
          <ShieldCheck size={50} color="var(--primary-color)" />
        </div>
        <h2>
          {t("common.authentication_required") || "Authentication Required"}
        </h2>
        <p>
          {t("common.enter_password_to_continue") ||
            "Please enter your password to continue"}
        </p>

        <div className="authenticate-input-container">
          <PasswordInput
            size="medium"
            label={t("common.password")}
            value={formik.values.password}
            onChange={(e) => {
              formik.setFieldValue("password", e.target.value || null);
            }}
            disabled={LOADING_AUTHENTICATE_USER}
            autoFocus
            fullWidth
            hasError={formik.errors.password ? true : false}
          />
        </div>

        {formik.errors.password && (
          <div className="authenticate-error-message">
            {formik.errors.password}
          </div>
        )}

        <div className="authenticate-actions">
          <button
            className="authenticate-btn authenticate-btn-cancel"
            onClick={onClose}
            disabled={LOADING_AUTHENTICATE_USER}
          >
            {t("common.cancel") || "Cancel"}
          </button>
          <button
            className="authenticate-btn authenticate-btn-submit"
            onClick={formik.submitForm}
            disabled={LOADING_AUTHENTICATE_USER || !formik.values.password}
          >
            {LOADING_AUTHENTICATE_USER ? (
              <div className="authenticate-spinner" />
            ) : (
              t("common.submit") || "Submit"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthenticateModal;
