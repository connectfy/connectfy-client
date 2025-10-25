import "./index.style.css";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Resource } from "@/types/enum.types";
import UsernameForm from "./components/UsernameForm";
import EmailForm from "./components/EmailForm";
import PhoneNumberForm from "./components/PhoneNumberForm";
import FaceIdForm from "./components/FaceIdForm";
import LoginHeader from "./components/LoginHeader";
import { useFormik } from "formik";
import { loginInitialState } from "../../constants/intialState";
import { validateLogin } from "../../constants/validation";
import { useTranslation } from "react-i18next";
import { clearError, login, setLoginMode } from "@/features/auth/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toast } from "react-toastify";
import { useToastError } from "@/hooks/useToastError";
import { checkEmptyString } from "@/utils/checkValues";
import { LoginModeType } from "@/types/auth/auth.type";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loginMode, ERROR_LOGIN, LOADING_LOGIN } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const localLoginMode = localStorage.getItem("loginMode") || "username";

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const formik = useFormik({
    initialValues: loginInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateLogin(values, t),
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(login(values));
      const res = unwrapResult(actionResult);
      if (res) {
        toast.success(t("user_messages.login_successfull"));
        navigate("/");
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        resetForm();
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
        return <FaceIdForm formik={formik} />;
    }
  }, [loginMode, formik]);

  useToastError({
    error: ERROR_LOGIN,
    clearErrorAction: () => clearError("login"),
  });

  useEffect(() => {
    if (
      !formik.values.identifier ||
      !formik.values.password ||
      !checkEmptyString(formik.values.identifier) ||
      !checkEmptyString(formik.values.password) ||
      LOADING_LOGIN
    )
      setIsDisabled(true);
    else setIsDisabled(false);
  }, [formik.values]);

  useEffect(() => {
    const loginModes: LoginModeType[] = [
      "username",
      "email",
      "phoneNumber",
      "faceDescriptor",
    ];

    if (!loginModes.includes(localLoginMode as LoginModeType)) {
      dispatch(setLoginMode("username"));
      localStorage.setItem("loginMode", "username");
    } else dispatch(setLoginMode(loginMode as LoginModeType));
  }, [localLoginMode]);

  return (
    <Fragment>
      <LoginHeader formik={formik} />
      <div className="login-form">{renderLoginForm()}</div>
    </Fragment>
  );
};

export default Login;
