import { Fragment, useEffect } from "react";
import { IDENTIFIER_TYPE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import { useFormik } from "formik";
import { loginInitialState } from "../../../../constants/intialState";
import { validateLogin } from "../../../../constants/validation";
import { useTranslation } from "react-i18next";
import { checkEmptyString } from "@/common/utils/checkValues";
import { ILoginForm, LoginModeType } from "../../../../types/types";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import { checkDeviceId } from "@/common/utils/checkDevice";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput";
import Input from "@/components/ui/CustomInput/Input/Input";
import PhoneNumber from "@/components/Form/PhoneNumberForm/PhoneNumberForm";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useLoginMutation } from "@/modules/auth/api/api";
import { useErrors } from "@/hooks/useErrors";
import { authTokenManager } from "@/common/helpers/authToken.manager";
import { ShortcutTooltip } from "@/components/Tooltip/KeyboardShortcutTooltip";

const LOGIN_MODES: LoginModeType[] = ["username", "email", "phoneNumber"];

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showResponseErrors } = useErrors();

  const rawLoginMode = searchParams.get("loginMode");

  const loginMode: LoginModeType = LOGIN_MODES.includes(
    rawLoginMode as LoginModeType,
  )
    ? (rawLoginMode as LoginModeType)
    : "username";

  const [login, { isLoading: LOADING_LOGIN }] = useLoginMutation();

  const formik = useFormik({
    initialValues: loginInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateLogin(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        values.deviceId = checkDeviceId();
        const res = await login(values).unwrap();

        if (res) {
          snack.success(t("user_messages.login_successful"));
          authTokenManager.setToken({
            type: "accessToken",
            token: res.access_token,
          });
          localStorage.removeItem(LOCAL_STORAGE_KEYS.LANG);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.APP_THEME);
          navigate(ROUTER.MAIN);
          resetForm();
        }
      } catch (err) {
        showResponseErrors(err);
      }
    },
  });

  const isDisabled = useFormDisabled<ILoginForm>({
    formik,
    loading: LOADING_LOGIN,
    validationRules: [
      (values) => !!values.identifier && checkEmptyString(values.identifier),
      (values) => {
        return checkEmptyString(values.password || "");
      },
    ],
  });

  const changeLoginMode = (mode: LoginModeType) => {
    formik.setFieldValue("identifier", "");
    setSearchParams({ authPage: "login", loginMode: mode }, { replace: true });
  };

  useEffect(() => {
    let identifierType: IDENTIFIER_TYPE;

    if (!rawLoginMode || !LOGIN_MODES.includes(rawLoginMode as LoginModeType)) {
      setSearchParams(
        { authPage: "login", loginMode: "username" },
        { replace: true },
      );
      identifierType = IDENTIFIER_TYPE.USERNAME;
    } else {
      switch (rawLoginMode) {
        case "email":
          identifierType = IDENTIFIER_TYPE.EMAIL;
          break;
        case "phoneNumber":
          identifierType = IDENTIFIER_TYPE.PHONE_NUMBER;
          break;
        default:
          identifierType = IDENTIFIER_TYPE.USERNAME;
          break;
      }
    }

    formik.setFieldValue("identifierType", identifierType);
  }, [rawLoginMode]);

  useEffect(() => {
    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDisabled) {
        e.preventDefault();
        formik.handleSubmit();
        return;
      }

      const modifierPressed = e.shiftKey && e.altKey;

      if (modifierPressed) {
        switch (e.code) {
          case "Digit1":
            e.preventDefault();
            changeLoginMode("username");
            break;
          case "Digit2":
            e.preventDefault();
            changeLoginMode("email");
            break;
          case "Digit3":
            e.preventDefault();
            changeLoginMode("phoneNumber");
            break;
        }
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, formik.handleSubmit]);

  return (
    <Fragment>
      {/* Form Header */}
      <div className="space-y-2 mb-5">
        <h2 className="text-3xl font-bold tracking-tight text-(--text-(--primary-color))">
          {t("common.welcome_back")}
        </h2>
        <p className="text-(--text-secondary) text-sm">
          {t("common.please_enter_your_details_to_sign_in_to_your_account")}
        </p>
      </div>

      {/* Login Mode Tabs */}
      <div className="flex border-b border-slate-100 my-4">
        <ShortcutTooltip keys={["Shift", "Alt", "1"]}>
          <Button
            type="button"
            className={`cursor-pointer px-4 py-2 w-full text-sm font-bold border-b-2 transition-colors ${
              loginMode === "username"
                ? "text-(--primary-color) border-primary"
                : "text-slate-400 hover:text-slate-600 border-transparent"
            }`}
            onClick={() => changeLoginMode("username")}
          >
            {t("common.username")}
          </Button>
        </ShortcutTooltip>
        <ShortcutTooltip keys={["Shift", "Alt", "2"]}>
          <Button
            type="button"
            className={`cursor-pointer px-4 py-2 w-full text-sm font-medium border-b-2 transition-colors ${
              loginMode === "email"
                ? "text-(--primary-color) border-primary"
                : "text-slate-400 hover:text-slate-600 border-transparent"
            }`}
            onClick={() => changeLoginMode("email")}
          >
            {t("common.email")}
          </Button>
        </ShortcutTooltip>
        <ShortcutTooltip keys={["Shift", "Alt", "3"]}>
          <Button
            type="button"
            className={`cursor-pointer px-4 py-2 w-full text-sm font-medium border-b-2 transition-colors ${
              loginMode === "phoneNumber"
                ? "text-(--primary-color) border-primary"
                : "text-slate-400 hover:text-slate-600 border-transparent"
            }`}
            onClick={() => changeLoginMode("phoneNumber")}
          >
            {t("common.phoneNumber")}
          </Button>
        </ShortcutTooltip>
      </div>

      {/* Login Form */}
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Identifier Input */}
        <div className="space-y-2">
          {loginMode === "username" && (
            <Input
              className="w-full px-5 py-4 rounded-xl text-(--text-(--primary-color)) outline-none transition-all duration-200 placeholder:text-(--text-secondary)/50 focus:ring-2 focus:ring-[#34d399]/50"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
              title={t("common.username")}
              type="text"
              isFloating
              icon={<span className="material-symbols-outlined">person</span>}
              name="identifier"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.identifier || ""}
              isError={
                !!(formik.touched.identifier && formik.errors.identifier)
              }
              error={formik.errors.identifier}
              maxLength={30}
            />
          )}

          {loginMode === "email" && (
            <Input
              className="w-full px-5 py-4 rounded-xl text-(--text-(--primary-color)) outline-none transition-all duration-200 placeholder:text-(--text-secondary)/50 focus:ring-2 focus:ring-[#34d399]/50"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
              title={t("common.email")}
              type="text"
              isFloating
              icon={<span className="material-symbols-outlined">email</span>}
              name="identifier"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.identifier || ""}
              isError={
                !!(formik.touched.identifier && formik.errors.identifier)
              }
              error={formik.errors.identifier}
              maxLength={254}
            />
          )}

          {loginMode === "phoneNumber" && (
            <PhoneNumber
              name="phoneNumber"
              onChange={(value) =>
                formik.setFieldValue("identifier", value?.fullPhoneNumber)
              }
            />
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <PasswordInput
            className="w-full px-5 py-4 rounded-xl text-(--text-(--primary-color)) outline-none transition-all duration-200 placeholder:text-(--text-secondary)/50 focus:ring-2 focus:ring-[#34d399]/50"
            style={{
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--input-border)",
            }}
            title={t("common.password")}
            isFloating
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password || ""}
            isError={!!(formik.touched.password && formik.errors.password)}
            error={formik.errors.password}
            maxLength={30}
          />
          <div className="flex justify-end items-center ml-1">
            <Link
              to={ROUTER.AUTH.FORGOT_PASSWORD}
              className="text-xs font-bold text-[#34d399] hover:underline"
            >
              {t("common.forgot_password")}
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
          type="submit"
          disabled={isDisabled}
          title={t("common.login")}
        />
      </form>
    </Fragment>
  );
};

export default Login;
