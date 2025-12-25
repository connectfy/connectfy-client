import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { clearError, googleSignup } from "@/features/auth/auth/authSlice";
import { useFormik } from "formik";
import { googleSignupInitialState } from "../../constants/intialState";
import { valdiateGoogleSignup } from "../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { Resource, THEME } from "@/types/enum.types";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import { onPressEnter, onPressEsc } from "@/utils/keyPressDown";

// MUI Components
import { CircularProgress } from "@mui/material";

// Custom Components
import Input from "@/components/Input/Input";
import DatePicker from "@/components/DatePicker";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import GenderForm from "../../pages/Main/pages/Signup/components/GenderForm";

// Utils
import { ROUTER } from "@/constants/routet";
import { snack } from "@/utils/snackManager";

// Styles
import "./index.style.css";

interface SignupModalProps {
  idToken: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const SignupModal = ({ idToken, isOpen, onClose }: SignupModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { ERROR_GOOGLE_SIGNUP, LOADING_GOOGLE_SIGNUP } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const formik = useFormik({
    initialValues: googleSignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => valdiateGoogleSignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      values.birthdayDate = values.birthdayDate
        ? new Date(values.birthdayDate)
        : null;

      values.theme = localStorage.getItem("app-theme") as THEME || THEME.LIGHT;

      const actionResult = await dispatch(googleSignup(values));
      const res = unwrapResult(actionResult);
      if (res) {
        snack.success(t("user_messages.signup_successful"));
        navigate(ROUTER.MESSENGER.MAIN);
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        resetForm();
        onClose();
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "Enter":
        onPressEnter(e, () => {
          if (isDisabled) return;
          formik.handleSubmit();
        });
        break;
      case "Escape":
        onPressEsc(e, onClose);
    }
  };

  const handleOnClose = () => {
    formik.resetForm();
    onClose();
  };

  useToastError({
    error: ERROR_GOOGLE_SIGNUP,
    clearErrorAction: () => clearError("signup"),
  });

  useEffect(() => {
    formik.setFieldValue("idToken", idToken);
  }, [idToken]);

  useEffect(() => {
    const { username, gender, birthdayDate } = formik.values;

    const hasEmptyUsername = !username || !checkEmptyString(username);
    const hasEmptyGender = !gender;
    const hasEmptyDate = !birthdayDate;

    const shouldDisable =
      hasEmptyUsername ||
      hasEmptyGender ||
      hasEmptyDate ||
      LOADING_GOOGLE_SIGNUP;

    setIsDisabled(shouldDisable);
  }, [formik.values, LOADING_GOOGLE_SIGNUP]);

  return (
    <Modal open={isOpen} onClose={handleOnClose}>
      <div
        className="signup-modal-container"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {/* Decorative Elements */}
        <div className="signup-modal-decoration signup-modal-decoration-top"></div>
        <div className="signup-modal-decoration signup-modal-decoration-bottom"></div>

        {/* Header */}
        <div className="signup-modal-header">
          <div className="signup-modal-header-icon">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 className="signup-modal-title">{t("common.complete_signup")}</h2>
          <p className="signup-modal-subtitle">
            {t("common.google_signup_description")}
          </p>
        </div>

        {/* Content */}
        <div className="signup-modal-content">
          <form className="signup-modal-form">
            {/* Username Field */}
            <div className="signup-modal-field">
              <Input
                inputSize="large"
                name="username"
                value={formik.values.username || ""}
                onChange={(e) =>
                  formik.setFieldValue("username", e.target.value || null)
                }
                onBlur={() => formik.setFieldTouched("username", true, false)}
                onKeyDown={(e) => onKeyDown(e)}
                hasError={!!(formik.errors.username && formik.touched.username)}
                title={t("common.username")}
                label={t("common.username")}
              />
              {formik.errors.username && formik.touched.username && (
                <div className="signup-modal-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{formik.errors.username}</span>
                </div>
              )}
            </div>

            {/* Birthday Date Field */}
            <div className="signup-modal-field">
              <DatePicker
                value={formik.values.birthdayDate}
                onChange={(date) => formik.setFieldValue("birthdayDate", date ? new Date(date) : null)}
                inputSize="medium"
                hasError={
                  !!(formik.errors.birthdayDate && formik.touched.birthdayDate)
                }
                placeholder={t("common.birthday")}
                onKeyDown={(e) => onKeyDown(e)}
              />
              {formik.errors.birthdayDate && formik.touched.birthdayDate && (
                <div className="signup-modal-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{String(formik.errors.birthdayDate)}</span>
                </div>
              )}
            </div>

            {/* Gender Field */}
            <div className="signup-modal-field">
              <label className="signup-modal-label">{t("common.gender")}</label>
              <GenderForm formik={formik} formId="signup-modal" />
              {formik.errors.gender && formik.touched.gender && (
                <div className="signup-modal-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{formik.errors.gender}</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="signup-modal-footer">
          <Button
            size="small"
            onClick={handleOnClose}
            disabled={LOADING_GOOGLE_SIGNUP}
            style={{
              backgroundColor: "var(--muted-color)",
              flex: 1,
            }}
          >
            {t("common.cancel")}
          </Button>
          <Button
            size="small"
            onClick={() => {
              if (LOADING_GOOGLE_SIGNUP) return;
              formik.handleSubmit();
            }}
            disabled={isDisabled}
            style={{ flex: 1 }}
          >
            {LOADING_GOOGLE_SIGNUP ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <span>{t("common.complete_signup")}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SignupModal;
