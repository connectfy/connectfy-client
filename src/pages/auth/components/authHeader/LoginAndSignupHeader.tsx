import "./css/loginAndSignupHeader.style.css";
import { useTranslation } from "react-i18next";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { googleLogin, setAuthForm } from "@/features/auth/authSlice";
import { Resource } from "@/types/enum.types";
import { AuthFormType } from "@/types/auth/auth.type";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import useBoolean from "@/hooks/useBoolean";
import SignupModal from "../authModal";
import { useState } from "react";

const LoginAndSignupHeader = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isModalOpen = useBoolean();

  const [idToken, setIdToken] = useState<string | null>(null);

  const { authForm, LOADING_LOGIN, LOADING_SIGNUP } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const changeAuthForm = (mode: AuthFormType) => {
    if (LOADING_LOGIN || LOADING_SIGNUP) return;
    dispatch(setAuthForm(mode));
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const idToken = tokenResponse.credential;

      if (!idToken) {
        toast.error(t("error_messages.google_login_failed"));
        return;
      }

      if (authForm === "login") {
        const actionResult = await dispatch(googleLogin({ idToken }));
        const res = unwrapResult(actionResult);
        if (res) {
          toast.success(t("user_messages.login_successful"));
          navigate("/");
          localStorage.removeItem("authPage");
          localStorage.removeItem("loginMode");
          localStorage.removeItem("forgotPasswordMode");
        }
      } else {
        setIdToken(idToken);
        isModalOpen.onOpen();
      }
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <section className="login-and-signup-buttons-body">
      <div className="login-and-signup-buttons">
        <div className="login-and-signup-buttons-main">
          <button
            className={`login-and-signup-btn login ${authForm === "login" ? "auth-btn-active" : ""}`}
            onClick={() => changeAuthForm("login")}
          >
            {t("common.login")}
          </button>
          <button
            className={`login-and-signup-btn signup ${authForm === "signup" ? "auth-btn-active" : ""}`}
            onClick={() => changeAuthForm("signup")}
          >
            {t("common.signup")}
          </button>
        </div>

        <div className="google-login-wrapper">
          <div className="google-custom-button">
            <GoogleIcon />
            <span>
              {authForm === "login"
                ? t("common.google_login")
                : t("common.google_signup")}
            </span>
          </div>

          {/* Google-un real button-u */}
          <div className="google-real-button">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                toast.error(t("error_messages.google_login_failed"))
              }
              useOneTap={false}
              width="410"
            />
          </div>
        </div>
      </div>

      <SignupModal isOpen={isModalOpen.open} onClose={isModalOpen.onClose} idToken={idToken} />
    </section>
  );
};

export default LoginAndSignupHeader;
