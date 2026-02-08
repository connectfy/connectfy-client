import { useTranslation } from "react-i18next";
import { Fragment, useEffect } from "react";
import { ForgotPasswordModeType, IForgotPasswordForm } from "../../types/types";
import { useFormik } from "formik";
import { forgotPasswordInitialState } from "../../constants/intialState";
import { validateForgotPassword } from "../../constants/validation";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import Button from "@/components/ui/CustomButton/Button/Button";
import Input from "@/components/ui/CustomInput/Input/Input";
import PhoneNumber from "@/components/Form/PhoneNumberForm/PhoneNumberForm";
import { useForgotPasswordMutation } from "../../api/api";
import { useErrors } from "@/hooks/useErrors";
import { ShortcutTooltip } from "@/components/Tooltip/KeyboardShortcutTooltip";

const FORGOT_PASSWORD_MODES: ForgotPasswordModeType[] = [
  "email",
  "phoneNumber",
];

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawForgotPasswordMode = searchParams.get("mode");

  const forgotPasswordMode: ForgotPasswordModeType =
    FORGOT_PASSWORD_MODES.includes(
      rawForgotPasswordMode as ForgotPasswordModeType,
    )
      ? (rawForgotPasswordMode as ForgotPasswordModeType)
      : "email";

  const { showResponseErrors } = useErrors();

  const [forgotPassword, { isLoading: LOADING_FORGOT_PASSWORD }] =
    useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: forgotPasswordInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateForgotPassword(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await forgotPassword(values).unwrap();
        if (res) {
          snack.success(t("user_messages.forgot_password_successful"));
          navigate(ROUTER.AUTH.MAIN);
          resetForm();
        }
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IForgotPasswordForm>({
    formik,
    loading: LOADING_FORGOT_PASSWORD,
    validationRules: [
      (values) => !!values.identifier && checkEmptyString(values.identifier),
    ],
  });

  const changeForgotPasswordMode = (mode: ForgotPasswordModeType) => {
    setSearchParams({ mode }, { replace: true });
  };

  useEffect(() => {
    const handleSubmitKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDisabled) {
        e.preventDefault();
        formik.handleSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        navigate(ROUTER.AUTH.MAIN);
      } else if (e.shiftKey && e.altKey && e.code === "Digit1") {
        e.preventDefault();
        changeForgotPasswordMode("email");
      } else if (e.shiftKey && e.altKey && e.code === "Digit2") {
        e.preventDefault();
        changeForgotPasswordMode("phoneNumber");
      }
    };

    document.addEventListener("keydown", handleSubmitKeyboard);
    return () => {
      document.removeEventListener("keydown", handleSubmitKeyboard);
    };
  }, [isDisabled, formik.handleSubmit]);

  return (
    <Fragment>
      {/* Form Header */}
      <div className="space-y-2 mb-5">
        <h2 className="text-3xl font-bold tracking-tight text-(--text-(--primary-color))">
          {t("common.forgot_password_title")}
        </h2>
        <p className="text-(--text-secondary) text-sm">
          {t("common.forgot_password_subtitle")}
        </p>
      </div>

      {/* Login Mode Tabs */}
      <div className="flex border-b border-slate-100 my-4">
        <ShortcutTooltip keys={["Shift", "Alt", "1"]}>
          <Button
            type="button"
            className={`cursor-pointer px-4 py-2 w-full text-sm font-medium border-b-2 transition-colors ${
              forgotPasswordMode === "email"
                ? "text-(--primary-color) border-primary"
                : "text-slate-400 hover:text-slate-600 border-transparent"
            }`}
            onClick={() => changeForgotPasswordMode("email")}
          >
            {t("common.email")}
          </Button>
        </ShortcutTooltip>
        <ShortcutTooltip keys={["Shift", "Alt", "2"]}>
          <Button
            type="button"
            className={`cursor-pointer px-4 py-2 w-full text-sm font-medium border-b-2 transition-colors ${
              forgotPasswordMode === "phoneNumber"
                ? "text-(--primary-color) border-primary"
                : "text-slate-400 hover:text-slate-600 border-transparent"
            }`}
            onClick={() => changeForgotPasswordMode("phoneNumber")}
          >
            {t("common.phoneNumber")}
          </Button>
        </ShortcutTooltip>
      </div>

      {/* Login Form */}
      <form className="space-y-6" onSubmit={formik.handleSubmit}>
        {/* Identifier Input */}
        <div className="space-y-2">
          {forgotPasswordMode === "email" && (
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

          {forgotPasswordMode === "phoneNumber" && (
            <PhoneNumber
              name="phoneNumber"
              onChange={(value) =>
                formik.setFieldValue("identifier", value?.fullPhoneNumber)
              }
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col items-center gap-4">
          <Button
            className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
            type="submit"
            disabled={isDisabled}
            title={t("common.login")}
            isLoading={LOADING_FORGOT_PASSWORD}
          />
          <p
            className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mt-2 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <span className="material-symbols-outlined md:text-md text-lg">
              arrow_back
            </span>
            {t("common.back")}
          </p>
        </div>
      </form>
    </Fragment>
  );
};

export default ForgotPassword;
