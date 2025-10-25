import "./index.style.css";
import { useCallback, useEffect, type FC } from "react";
import AuthHeader from "./components/authHeader/AuthHeader";
import { Resource } from "@/types/enum.types";
import LoginAndSignupHeader from "./components/authHeader/LoginAndSignupHeader";
import AuthFooter from "./components/authFooter/AuthFooter";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyAccount from "./pages/Verify";
import ForgotPassword from "./pages/ForgotPassword";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AuthFormType } from "@/types/auth/auth.type";
import { setAuthForm } from "@/features/auth/authSlice";

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

      case "verify":
        return <VerifyAccount />;

      case "forgotPassword":
        return <ForgotPassword />;
    }
  }, [authForm]);

  useEffect(() => {
    const validAuthForms: AuthFormType[] = [
      "login",
      "signup",
      "verify",
      "forgotPassword",
      "resetPassword",
    ];

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
