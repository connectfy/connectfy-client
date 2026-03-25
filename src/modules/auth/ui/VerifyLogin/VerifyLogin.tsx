import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { loginVerifyInitialState } from "../../constants/intialState";
import { validateVerifyLogin } from "../../constants/validation";
import { useCallback } from "react";
import { onPressEnter, onPressEsc } from "@/common/utils/keyPressDown";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import OTPForm from "@/components/Form/OTPForm/OTPForm";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useLoginVerifyMutation } from "../../api/api";
import { ILoginVerifyForm } from "../../types/types";
import useFormDisabled from "@/hooks/useFormDisabled";
import { useErrors } from "@/hooks/useErrors";
import { useTheme } from "@/context/ThemeContext";
import { useAuthStore } from "@/store/zustand/useAuthStore";
import { ArrowLeft } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { getHomeRouteByStartup } from "@/common/utils/routes";

const VerifyLogin = () => {
  const { t } = useTranslation();
  const { toggleTheme } = useTheme();
  const { setToken } = useAuthStore();
  const { navigate } = useAppNavigation();

  const [loginVerify, { isLoading }] = useLoginVerifyMutation();

  const { showResponseErrors } = useErrors();

  const formik = useFormik({
    initialValues: loginVerifyInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateVerifyLogin(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await loginVerify(values).unwrap();
        if (res.access_token) {
          setToken({
            type: "access_token",
            token: res.access_token,
          });
          snack.success(
            t("user_messages.login_successful", { lng: res.language }),
          );
          const redirectPage = getHomeRouteByStartup(res.startupPage);
          navigate(redirectPage);
          toggleTheme(res.theme);
        }
        resetForm();
      } catch (error) {
        if ((error as any)?.additional?.navigate) {
          navigate(`${ROUTER.AUTH.LOGIN}?method=username`);
        } else {
          showResponseErrors(error);
        }
      }
    },
  });

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    switch (e.key) {
      case "Enter":
        onPressEnter(e, () => {
          if (isDisabled) return;
          formik.handleSubmit();
        });
        break;

      case "Escape":
        onPressEsc(e, () => navigate(-1));
    }
  };

  const handleOtpChange = useCallback(
    (value: string | null) => {
      const current = formik.values.code ?? "";
      const next = value ?? "";
      if (current !== next) {
        formik.setFieldValue("code", next);
      }
    },
    [formik],
  );

  const isDisabled = useFormDisabled<ILoginVerifyForm>({
    formik,
    loading: isLoading,
    validationRules: [
      (values) =>
        !!(
          values.code &&
          values.code.length === 6 &&
          values.code.trim() !== ""
        ),
    ],
  });

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-3 text-(--text-primary)">
          {t("common.verify_account_heading")}
        </h2>
        <p className="text-(--text-primary)">
          {t("common.verify_account_message_part_1")}.{" "}
          {t("common.verify_account_message_part_2")}
        </p>
      </div>
      <form className="space-y-8" onSubmit={formik.handleSubmit}>
        <OTPForm
          name="code"
          length={6}
          onChange={handleOtpChange}
          onKeyDown={onKeyDown}
          onComplete={(code) => formik.setFieldValue("code", code)}
        />
        <div className="flex flex-col items-center gap-4">
          <Button
            className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
            type="submit"
            disabled={isDisabled}
            isLoading={isLoading}
            title={t("common.verify")}
          />
          <Button
            className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mt-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            {t("common.back")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerifyLogin;
