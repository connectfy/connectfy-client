import { Fragment, useCallback, type FC } from "react";
import AuthHeader from "./components/authHeader/AuthHeader";
import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { Resource } from "../../types/enum.types";
import LoginAndSignupHeader from "./components/authHeader/LoginAndSignupHeader";
import LoginHeader from "./components/authHeader/LoginHeader";
import "./index.style.css";
import AuthFooter from "./components/authFooter/AuthFooter";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyAccount from "./pages/Verify";

const AuthPage: FC = () => {
  const { authForm } = useSelector((state: RootState) => state[Resource.auth]);

  const renderAuthForm = useCallback(() => {
    switch (authForm) {
      case "login":
        return (
          <Fragment>
            <LoginHeader />
            <Login />
          </Fragment>
        );

      case "signup":
        return <Signup />;

      case "verify":
        return <VerifyAccount />;
    }
  }, [authForm]);

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
