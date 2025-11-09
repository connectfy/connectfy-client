import "./index.style.css";
import { useTranslation } from "react-i18next";
import AuthFooter from "../../components/authFooter/AuthFooter";
import AuthHeader from "../../components/authHeader/AuthHeader";
import Button from "@/components/Button/Button";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useFormik } from "formik";
import { resetPasswordInitialState } from "../../constants/intialState";
import { validateResetPassword } from "../../constants/validation";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Resource, TOKEN_TYPE } from "@/types/enum.types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToastError } from "@/hooks/useToastError";
import {
  clearError,
  isValidToken,
  resetPassword,
} from "@/features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import { IResetPasswordForm } from "@/types/auth/auth.type";

const ResetPassword = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { LOADING_RESET_PASSWORD, ERROR_RESET_PASSWORD, ERROR_IS_VALID_TOKEN } =
    useAppSelector((state) => state[Resource.auth]);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: resetPasswordInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateResetPassword(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const actionResult = await dispatch(resetPassword(values));
        const res = unwrapResult(actionResult);
        if (res) {
          snack.success(t("user_messages.reset_password_successfull"));
          navigate("/auth");
          resetForm();
        }
      } catch (error) {
        snack.error((error as Error).message);
      }
    },
  });

  useToastError({
    error: ERROR_RESET_PASSWORD,
    clearErrorAction: () => clearError("resetPassword"),
  });

  const isDisabled = useFormDisabled<IResetPasswordForm>({
    formik,
    loading: LOADING_RESET_PASSWORD,
    validationRules: [
      (values) => !!values.password,
      (values) => !!values.confirmPassword,
      (values) => !!values.resetToken,
      !!token,
    ],
  });

  useEffect(() => {
    if (!token) {
      navigate("/auth");
      return;
    }

    (async () => {
      const actionResult = await dispatch(
        isValidToken({
          token,
          type: TOKEN_TYPE.PASSWORD_RESET,
        })
      );

      const isValid = unwrapResult(actionResult);

      if (!isValid || ERROR_IS_VALID_TOKEN) {
        navigate("/auth");
        return;
      }
    })();

    formik.setFieldValue("resetToken", token);
  }, [token]);

  useEffect(() => {
    if (isDisabled) return;

    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        formik.handleSubmit();
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, formik.handleSubmit]);

  return (
    <section id="auth-page">
      <AuthHeader />

      <div className="auth-controls">
        <div className="reset-password">
          <div className="reset-password__intro">
            <h4 className="reset-password__title">
              {t("common.reset_password_title")}
            </h4>
          </div>

          <div className="reset-password-form">
            <div>
              <PasswordInput
                inputSize="medium"
                label={t("common.password")}
                name="password"
                showGenerateIcon
                fullWidth
                value={formik.values.password || ""}
                onChange={(e) =>
                  formik.setFieldValue("password", e.target.value || null)
                }
                onBlur={() => formik.setFieldTouched("password", true, false)}
                onGenerate={(value?: string) => {
                  navigator.clipboard.writeText(value as string);
                  snack.info(t("user_messages.password_generated_message"), {
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "center",
                    },
                    autoHideDuration: 10000,
                  });

                  formik.setFieldValue("password", value);
                  formik.setFieldValue("confirmPassword", value);
                }}
              />
              {formik.errors.password && formik.touched.password && (
                <h6>{formik.errors.password}</h6>
              )}
            </div>
            <div>
              <PasswordInput
                inputSize="medium"
                label={t("common.confirm_password")}
                name="confirmPassword"
                fullWidth
                value={formik.values.confirmPassword || ""}
                onChange={(e) =>
                  formik.setFieldValue(
                    "confirmPassword",
                    e.target.value || null
                  )
                }
                onBlur={() =>
                  formik.setFieldTouched("confirmPassword", true, false)
                }
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <h6>{formik.errors.confirmPassword}</h6>
                )}
            </div>
          </div>

          <div className="reset-password-buttons">
            <Button
              hasAnimation
              fillWidth
              size="small"
              disabled={isDisabled}
              onClick={() => formik.handleSubmit()}
            >
              {t("common.submit")}
            </Button>
          </div>
        </div>
      </div>

      <AuthFooter />
    </section>
  );
};

export default ResetPassword;
