import "./index.style.css";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Resource } from "@/types/enum.types";
import UsernameForm from "./components/UsernameForm";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import FaceIdForm from "./components/FaceIdForm";
import LoginHeader from "./components/LoginHeader";
import { useFormik } from "formik";
import { loginInitialState } from "../../../../constants/intialState";
import { validateLogin } from "../../../../constants/validation";
import { useTranslation } from "react-i18next";
import { clearError, login, setLoginMode } from "@/features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toast } from "react-toastify";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import { LoginModeType } from "@/types/auth/auth.type";
import { useNavigate } from "react-router-dom";
import useBoolean from "@/hooks/useBoolean";
import { ROUTER } from "@/constants/routet";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loginMode, ERROR_LOGIN, LOADING_LOGIN } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const localLoginMode =
    (localStorage.getItem("loginMode") as LoginModeType) || "username";

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const { open, onOpen, onClose } = useBoolean();

  const formik = useFormik({
    initialValues: loginInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateLogin(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const actionResult = await dispatch(login(values));
        const res = unwrapResult(actionResult);
        if (res) {
          toast.success(t("user_messages.login_successful"));
          navigate(ROUTER.MESSENGER.MAIN);
          localStorage.removeItem("authPage");
          localStorage.removeItem("loginMode");
          localStorage.removeItem("forgotPasswordMode");
          resetForm();
        }
      } catch (err) {
        toast.error((err as Error).message);
      }
    },
  });

  const renderLoginForm = useCallback(() => {
    switch (loginMode) {
      case "username":
        return <UsernameForm formik={formik} isDisabled={isDisabled} />;

      case "email":
        return <EmailForm formik={formik} isDisabled={isDisabled} />;

      case "phoneNumber":
        return <PhoneNumberForm formik={formik} isDisabled={isDisabled} />;

      case "faceDescriptor":
        return (
          <FaceIdForm
            formik={formik}
            isDisabled={isDisabled}
            open={open}
            onOpen={onOpen}
            onClose={onClose}
          />
        );

      default:
        return null;
    }
  }, [loginMode, formik, isDisabled, open, onOpen, onClose]);

  useToastError({
    error: ERROR_LOGIN,
    clearErrorAction: () => clearError("login"),
  });

  useEffect(() => {
    const id = formik.values.identifier;
    const pw = formik.values.password;

    if (!id || LOADING_LOGIN || !checkEmptyString(id || "")) {
      setIsDisabled(true);
      return;
    }

    if (loginMode === "faceDescriptor") {
      if (!Array.isArray(pw)) {
        setIsDisabled(true);
        return;
      }
    } else {
      if (!checkEmptyString((pw as string) || "")) {
        setIsDisabled(true);
        return;
      }
    }

    setIsDisabled(false);
  }, [formik.values, LOADING_LOGIN, loginMode]);

  useEffect(() => {
    const loginModes: LoginModeType[] = [
      "username",
      "email",
      "phoneNumber",
      "faceDescriptor",
    ];

    const mode = localLoginMode as LoginModeType;

    if (!loginModes.includes(mode)) {
      dispatch(setLoginMode("username"));
      localStorage.setItem("loginMode", "username");
    } else {
      dispatch(setLoginMode(mode));
    }
  }, [localLoginMode, dispatch]);

  useEffect(() => {
    if (loginMode === "faceDescriptor") {
      const handleFaceEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen();
        }
      };
      document.addEventListener("keydown", handleFaceEnter);
      return () => {
        document.removeEventListener("keydown", handleFaceEnter);
      };
    }

    if (isDisabled) return;

    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        formik.handleSubmit();
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, loginMode, formik.handleSubmit, onOpen]);

  return (
    <Fragment>
      <LoginHeader formik={formik} />
      <div className="login-form">{renderLoginForm()}</div>
    </Fragment>
  );
};

export default Login;
