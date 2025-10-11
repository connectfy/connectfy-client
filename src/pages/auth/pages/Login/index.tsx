import "./login.style.css";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Resource } from "@/types/enum.types";
import UsernameForm from "./components/UsernameForm";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import FaceIdForm from "./components/FaceIdForm";

const Login = () => {
  const { loginMode } = useSelector((state: RootState) => state[Resource.auth]);

  const renderLoginForm = useCallback(() => {
    switch (loginMode) {
      case "username":
        return <UsernameForm />;

      case "email":
        return <EmailForm />;

      case "phoneNumber":
        return <PhoneNumberForm />;

      case "faceDescriptor":
        return <FaceIdForm />;
    }
  }, [loginMode]);

  return <div className="login-form">{renderLoginForm()}</div>;
};

export default Login;
