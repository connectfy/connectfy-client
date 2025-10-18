import "./index.style.css";
import { useTranslation } from "react-i18next";
import { KeyboardBackspace } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setAuthForm } from "@/features/auth/authSlice";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import type { RootState } from "@/store/store";
import { Resource } from "@/types/enum.types";
import { useCallback } from "react";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { forgotPasswordMode } = useSelector(
    (state: RootState) => state[Resource.auth]
  );

  const renderForm = useCallback(() => {
    switch (forgotPasswordMode) {
      case "phoneNumber":
        return <PhoneNumberForm />;

      default:
        return <EmailForm />;
    }
  }, [forgotPasswordMode]);

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

      <ForgotPasswordHeader />

      {renderForm()}

      <div className="forgot-password-buttons">
        <div
          className="forgot-password-button"
          onClick={() => dispatch(setAuthForm("login"))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) =>
            e.key === "Enter" ? dispatch(setAuthForm("login")) : null
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
