import "./index.style.css";
import { useTranslation } from "react-i18next";
import { KeyboardBackspace } from "@mui/icons-material";
import {
  clearError,
  forgotPassword,
  setForgotPasswordMode,
  setLoginMode,
} from "@/features/auth/authSlice";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import { Resource } from "@/types/enum.types";
import { useCallback, useEffect } from "react";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  ForgotPasswordModeType,
  IForgotPasswordForm,
} from "@/types/auth/auth/auth.type";
import { useFormik } from "formik";
import { forgotPasswordInitialState } from "../../constants/intialState";
import { validateForgotPassword } from "../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { checkEmptyString } from "@/utils/checkValues";
import { onPressEnter, onPressEsc } from "@/utils/keyPressDown";
import { useToastError } from "@/hooks/useToastError";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import AuthHeader from "../../components/authHeader";
import AuthFooter from "../../components/authFooter";
import { snack } from "@/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { forgotPasswordMode, LOADING_FORGOT_PASSWORD, ERROR_FORGOT_PASSWORD } =
    useAppSelector((state) => state[Resource.auth]);

  const localForgotPasswordMode =
    localStorage.getItem("forgotPasswordMode") || "email";

  const formik = useFormik({
    initialValues: forgotPasswordInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateForgotPassword(values, t),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(forgotPassword(values));
      const res = unwrapResult(actionResult);
      if (res) {
        snack.success(t("user_messages.forgot_password_successful"));
        navigate(ROUTER.AUTH.MAIN);
        dispatch(setLoginMode("username"));
        resetForm();
      }
    },
  });

  const isDisabled = useFormDisabled<IForgotPasswordForm>({
    formik,
    loading: LOADING_FORGOT_PASSWORD,
    validationRules: [
      (values) => !!values.identifier && checkEmptyString(values.identifier),
    ],
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
        onPressEsc(e, () => navigate(ROUTER.AUTH.MAIN));
    }
  };

  const renderForm = useCallback(() => {
    switch (forgotPasswordMode) {
      case "phoneNumber":
        return (
          <PhoneNumberForm
            formik={formik}
            isDisabled={isDisabled}
            onKeyDown={onKeyDown}
          />
        );

      default:
        return (
          <EmailForm
            formik={formik}
            isDisabled={isDisabled}
            onKeyDown={onKeyDown}
          />
        );
    }
  }, [forgotPasswordMode, formik]);

  useToastError({
    error: ERROR_FORGOT_PASSWORD,
    clearErrorAction: () => clearError("forgotPassword"),
  });

  useEffect(() => {
    const forgotPasswordModes: ForgotPasswordModeType[] = [
      "email",
      "phoneNumber",
    ];

    if (
      !forgotPasswordModes.includes(
        localForgotPasswordMode as ForgotPasswordModeType
      )
    ) {
      dispatch(setForgotPasswordMode("email"));
      localStorage.setItem("forgotPasswordMode", "email");
    } else
      dispatch(
        setForgotPasswordMode(localForgotPasswordMode as ForgotPasswordModeType)
      );
  }, [localForgotPasswordMode]);

  return (
    <section id="auth-page">
      <AuthHeader />

      <div className="auth-controls">
        <div className="forgot-password">
          <div className="forgot-password__intro">
            <h4 className="forgot-password__title">
              {t("common.forgot_password_title", "Forgot Password?")}
            </h4>
            <p className="forgot-password__subtitle">
              {t(
                "common.forgot_password_subtitle",
                "Select an identifier to find your account. We'll send a secure password-reset link to the account's registered email address."
              )}
            </p>
          </div>

          <ForgotPasswordHeader formik={formik} />

          {renderForm()}

          <div className="forgot-password-buttons">
            <div
              className="forgot-password-button"
              onClick={() => {
                if (LOADING_FORGOT_PASSWORD) return;
                navigate(ROUTER.AUTH.MAIN);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                onPressEsc(e, () => {
                  if (LOADING_FORGOT_PASSWORD) return;
                  navigate(ROUTER.AUTH.MAIN);
                })
              }
            >
              <KeyboardBackspace
                fontSize="small"
                style={{ color: "var(--primary-color)" }}
              />
              <div>{t("common.back", "Back")}</div>
            </div>
          </div>
        </div>
      </div>

      <AuthFooter />
    </section>
  );
};

export default ForgotPassword;
