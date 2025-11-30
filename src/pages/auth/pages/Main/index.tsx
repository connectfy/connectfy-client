import "./index.style.css";
import { useCallback, useEffect, type FC } from "react";
import AuthHeader from "../../components/authHeader";
import { Resource } from "@/types/enum.types";
import LoginAndSignupHeader from "./components/AuthHeader";
import AuthFooter from "../../components/authFooter";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AuthFormType } from "@/types/auth/auth/auth.type";
import { setAuthForm } from "@/features/auth/auth/authSlice";

const AuthPage: FC = () => {
  const dispatch = useAppDispatch();

  const { authForm } = useAppSelector((state) => state[Resource.auth]);
  const authMode = localStorage.getItem("authPage") || "login";

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

  return (
    <section id="auth-page">
      <AuthHeader />

      <div className="auth-controls">
        {(authForm === "login" || authForm === "signup") && (
          <LoginAndSignupHeader />
        )}
        {renderAuthForm()}
      </div>

      <AuthFooter />
    </section>
  );
};

export default AuthPage;
