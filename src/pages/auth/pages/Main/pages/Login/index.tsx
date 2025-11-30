import "./index.style.css";
import { Fragment, useCallback, useEffect } from "react";
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
import { clearError, login, setLoginMode } from "@/features/auth/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import { ILoginForm, LoginModeType } from "@/types/auth/auth/auth.type";
import { useNavigate } from "react-router-dom";
import useBoolean from "@/hooks/useBoolean";
import { ROUTER } from "@/constants/routet";
import { snack } from "@/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loginMode, ERROR_LOGIN, LOADING_LOGIN } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const localLoginMode =
    (localStorage.getItem("loginMode") as LoginModeType) || "username";

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
          snack.success(t("user_messages.login_successful"));
          navigate(ROUTER.MAIN);
          localStorage.removeItem("authPage");
          localStorage.removeItem("loginMode");
          localStorage.removeItem("forgotPasswordMode");
          resetForm();
        }
      } catch (err) {
        snack.error((err as Error).message);
      }
    },
  });

  const isDisabled = useFormDisabled<ILoginForm>({
    formik,
    loading: LOADING_LOGIN,
    validationRules: [
      (values) => !!values.identifier && checkEmptyString(values.identifier),
      (values) => {
        if (loginMode === "faceDescriptor") {
          return Array.isArray(values.password);
        }
        return checkEmptyString(values.password || "");
      },
    ],
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
