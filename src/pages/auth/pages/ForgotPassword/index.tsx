import "./index.style.css";
import { useTranslation } from "react-i18next";
import { KeyboardBackspace } from "@mui/icons-material";
import {
  forgotPassword,
  setAuthForm,
  setForgotPasswordMode,
  setLoginMode,
} from "@/features/auth/authSlice";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import { Resource } from "@/types/enum.types";
import { useCallback, useEffect, useState } from "react";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { ForgotPasswordModeType } from "@/types/auth/auth.type";
import { useFormik } from "formik";
import { forgotPasswordInitialState } from "../../constants/intialState";
import { validateForgotPassword } from "../../constants/validation";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { checkEmptyString } from "@/utils/checkValues";
import { onPressEnter, onPressEsc } from "@/utils/keyPressDown";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { forgotPasswordMode, LOADING_FORGOT_PASSWORD } = useAppSelector(
    (state) => state[Resource.auth]
  );

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
        toast.success(t("user_messages.forgot_password_successfull"));
        dispatch(setAuthForm("login"));
        dispatch(setLoginMode("username"));
        resetForm();
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    onPressEnter(e, () => {
      if (isDisabled) return;
      formik.handleSubmit();
    });
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

  useEffect(() => {
    if (
      !formik.values.identifier ||
      !checkEmptyString(formik.values.identifier) ||
      LOADING_FORGOT_PASSWORD
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [formik.values]);

  return (
    <section className="forgot-password">
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
            dispatch(setAuthForm("login"));
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            onPressEsc(e, () => {
              if (LOADING_FORGOT_PASSWORD) return;
              dispatch(setAuthForm("login"));
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
    </section>
  );
};

export default ForgotPassword;
