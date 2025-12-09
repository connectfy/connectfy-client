import "./index.style.css";
import { Fragment, useCallback, useEffect, type FC } from "react";
import AuthHeader from "../../components/authHeader";
import { Resource } from "@/types/enum.types";
import LoginAndSignupHeader from "./components/AuthHeader";
import AuthFooter from "../../components/authFooter";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AuthFormType } from "@/types/auth/auth/auth.type";
import { restoreAccount, setAuthForm } from "@/features/auth/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/utils/snackManager";
import { useTranslation } from "react-i18next";
import MainSpinner from "@/components/Loading/Loading";

const AuthPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { authForm, LOADING_RESTORE_ACCOUNT } = useAppSelector(
    (state) => state[Resource.auth]
  );
  const authMode = localStorage.getItem("authPage") || "login";

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  const renderAuthForm = useCallback(() => {
    switch (authForm) {
      case "login":
        return <Login />;

      case "signup":
        return <Signup />;

      default:
        break;
    }
  }, [authForm]);

  useEffect(() => {
    const validAuthForms: AuthFormType[] = ["login", "signup"];

    if (!validAuthForms.includes(authMode as AuthFormType)) {
      localStorage.setItem("authPage", "login");
      dispatch(setAuthForm("login"));
    } else dispatch(setAuthForm(authMode as AuthFormType));
  }, [authMode]);

  useEffect(() => {
    if (!token || !type) return;

    if (type !== "restore") {
      navigate(ROUTER.AUTH.MAIN);
      return;
    }

    (async () => {
      const actionResult = await dispatch(restoreAccount({ token }));
      const res = unwrapResult(actionResult);

      if (res) {
        navigate(ROUTER.MAIN);
        snack.success(t("user_messages.restore_account_successful"));
        return;
      }

      navigate(ROUTER.AUTH.MAIN);
    })();
  }, [token, type]);

  return (
    <section id="auth-page">
      {LOADING_RESTORE_ACCOUNT ? (
        <MainSpinner description={{ title: t("common.restoring_account") }} />
      ) : (
        <Fragment>
          <AuthHeader />

          <div className="auth-controls">
            {(authForm === "login" || authForm === "signup") && (
              <LoginAndSignupHeader />
            )}
            {renderAuthForm()}
          </div>

          <AuthFooter />
        </Fragment>
      )}
    </section>
  );
};

export default AuthPage;
