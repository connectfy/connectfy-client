import Button from "@/components/Button/Button";
import OTPForm from "@/components/Form/OTPForm";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import { Resource } from "@/types/enum.types";
import { KeyboardBackspace } from "@mui/icons-material";
import {
  clearError,
  setAuthForm,
  setSignupForm,
  signupVerify,
} from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { verifySignupInitialState } from "../../constants/intialState";
import { validateVerifySignup } from "../../constants/validation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { useCallback } from "react";
import { useToastError } from "@/hooks/useToastError";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signupForm, LOADING_SIGNUP_VERIFY, ERROR_SIGNUP_VERIFY } =
    useAppSelector((state) => state[Resource.auth]);

  const formik = useFormik({
    initialValues: verifySignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateVerifySignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(signupVerify(values));
      if (signupVerify.fulfilled.match(actionResult)) {
        toast.success("user_messages.verify_successfull");
        navigate("/");
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        dispatch(setSignupForm(null));
        resetForm();
      }
    },
  });

  const handleOtpChange = useCallback(
    (value: string | null) => {
      const current = formik.values.verifyCode ?? "";
      const next = value ?? "";
      if (current !== next) {
        formik.setFieldValue("verifyCode", next);
      }
    },
    [formik]
  );

  const isDisabled =
    LOADING_SIGNUP_VERIFY ||
    !formik.values.verifyCode ||
    formik.values.verifyCode.trim() === "" ||
    formik.values.verifyCode?.length !== 6;

  useToastError({
    error: ERROR_SIGNUP_VERIFY,
    clearErrorAction: () => clearError("verify"),
  });

  return (
    <div className="verify-account">
      <div className="verify-account-message">
        <h3>{t("common.verify_account_heading")}</h3>
        <p>
          {t("common.verify_account_message_part_1")}{" "}
          <span className="highlight-email">
            {signupForm?.email ?? "example@gmail.com"}
          </span>
          . {t("common.verify_account_message_part_2")}
        </p>
      </div>

      <div className="verify-account-form">
        <OTPForm length={6} onChange={handleOtpChange} name="verifyCode" />

        <div className="verify-account-buttons">
          <Button
            fillWidth
            hasAnimation
            onClick={() => formik.handleSubmit()}
            disabled={isDisabled}
            type="button"
          >
            {LOADING_SIGNUP_VERIFY ? <Spinner /> : t("common.verify")}
          </Button>

          <div
            className="verify-account-button"
            onClick={() => {
              if (LOADING_SIGNUP_VERIFY) return;
              dispatch(setAuthForm("signup"));
            }}
          >
            <KeyboardBackspace
              fontSize="small"
              style={{ color: "var(--primary-color)" }}
            />
            <div>{t("common.back")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
