import Button from "@/components/Buttons/Button/Button";
import OTPForm from "@/components/Form/OTPForm/OTPForm";
import "./verify.style.css";
import { useTranslation } from "react-i18next";
import { RESOURCE } from "@/common/enums/enums";
import { KeyboardBackspace } from "@mui/icons-material";
import { clearError, setSignupForm, signupVerify } from "../../api/api";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { verifySignupInitialState } from "../../constants/intialState";
import { validateVerifySignup } from "../../constants/validation";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import { useCallback } from "react";
import { useToastError } from "@/hooks/useToastError";
import { onPressEnter, onPressEsc } from "@/common/utils/keyPressDown";
import { ROUTER } from "@/common/constants/routet";
import AuthHeader from "@/components/Header/AuthHeader/AuthHeader";
import AuthFooter from "@/components/Footer/AuthFooter/AuthFooter";
import { snack } from "@/common/utils/snackManager";
import { checkDeviceId } from "@/common/utils/checkDevice";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signupForm, LOADING_SIGNUP_VERIFY, ERROR_SIGNUP_VERIFY } =
    useAppSelector((state) => state[RESOURCE.AUTH]);

  const formik = useFormik({
    initialValues: verifySignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateVerifySignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      values.deviceId = checkDeviceId();
      const actionResult = await dispatch(signupVerify(values));
      if (signupVerify.fulfilled.match(actionResult)) {
        snack.success(t("user_messages.verify_successful"));
        navigate(ROUTER.MESSENGER.MAIN);
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        dispatch(setSignupForm(null));
        resetForm();
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
        onPressEsc(e, () => navigate(ROUTER.AUTH.MAIN));
    }
  };

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
    <section id="auth-page">
      <AuthHeader />

      <div className="auth-controls">
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
            <OTPForm
              length={6}
              onChange={handleOtpChange}
              name="verifyCode"
              onKeyDown={(e) => onKeyDown(e)}
            />

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
                  navigate(ROUTER.AUTH.MAIN);
                }}
                onKeyDown={(e) =>
                  onPressEsc(e, () => {
                    if (LOADING_SIGNUP_VERIFY) return;
                    navigate(ROUTER.AUTH.MAIN);
                  })
                }
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
      </div>

      <AuthFooter />
    </section>
  );
};

export default VerifyAccount;
