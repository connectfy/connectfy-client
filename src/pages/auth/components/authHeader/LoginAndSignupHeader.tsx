import "./css/loginAndSignupHeader.style.css";
import { useTranslation } from "react-i18next";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import { setAuthForm } from "@/features/auth/authSlice";
import { Resource } from "@/types/enum.types";
import { AuthFormType } from "@/types/auth/auth.type";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";

const LoginAndSignupHeader = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { authForm, LOADING_LOGIN, LOADING_SIGNUP } = useAppSelector(
    (state) => state[Resource.auth]
  );
  const changeAuthForm = (mode: AuthFormType) => {
    if (LOADING_LOGIN || LOADING_SIGNUP) return;
    dispatch(setAuthForm(mode));
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
        <button className="login-and-signup-btn google">
          <GoogleIcon />
          {authForm === "login"
            ? t("common.google_login")
            : t("common.google_signup")}
        </button>
      </div>
    </section>
  );
};

export default LoginAndSignupHeader;
