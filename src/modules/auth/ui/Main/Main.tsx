import "./main.style.css";
import { Fragment, useCallback, useEffect, type FC } from "react";
import AuthHeader from "@/components/Header/AuthHeader/AuthHeader";
import { LOCAL_STORAGE_KEYS, RESOURCE } from "@/common/enums/enums";
import LoginAndSignupHeader from "./components/MainHeader/MainHeader";
import AuthFooter from "@/components/Footer/AuthFooter/AuthFooter";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AuthFormType } from "../../types/types";
import { restoreAccount, setAuthForm } from "../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/common/utils/snackManager";
import { useTranslation } from "react-i18next";
import MainSpinner from "@/components/Loading/Loading";

const MainPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { authForm, LOADING_RESTORE_ACCOUNT } = useAppSelector(
    (state) => state[RESOURCE.AUTH]
  );
  const authMode = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_PAGE) || "login";

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
      localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_PAGE, "login");
      dispatch(setAuthForm("login"));
    } else dispatch(setAuthForm(authMode as AuthFormType));
  }, [dispatch, authMode]);

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
  }, [dispatch, navigate, t, token, type]);

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

export default MainPage;
