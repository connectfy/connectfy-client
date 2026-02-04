import "./verify.style.css";
import { useTranslation } from "react-i18next";
import { RESOURCE } from "@/common/enums/enums";
import { clearError, setSignupForm, signupVerify } from "../../api/api";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { verifySignupInitialState } from "../../constants/intialState";
import { validateVerifySignup } from "../../constants/validation";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useToastError } from "@/hooks/useToastError";
import { onPressEnter, onPressEsc } from "@/common/utils/keyPressDown";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { checkDeviceId } from "@/common/utils/checkDevice";
import OTPForm from "@/components/Form/OTPForm/OTPForm";
import Button from "@/components/ui/CustomButton/Button/Button";

const VerifyAccount = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signupForm, LOADING_SIGNUP_VERIFY, ERROR_SIGNUP_VERIFY } =
    useAppSelector((state) => state[RESOURCE.AUTH]);

  const formik = useFormik({
    initialValues: verifySignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateVerifySignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      values.deviceId = checkDeviceId();
      const actionResult = await dispatch(signupVerify(values));
      if (signupVerify.fulfilled.match(actionResult)) {
        snack.success(t("user_messages.verify_successful"));
        navigate(ROUTER.MESSENGER.MAIN);
        localStorage.removeItem("authPage");
        localStorage.removeItem("loginMode");
        localStorage.removeItem("forgotPasswordMode");
        dispatch(setSignupForm(null));
        resetForm();
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
        onPressEsc(e, () => navigate(ROUTER.AUTH.MAIN));
    }
  };

  const handleOtpChange = useCallback(
    (value: string | null) => {
      const current = formik.values.verifyCode ?? "";
      const next = value ?? "";
      if (current !== next) {
        formik.setFieldValue("verifyCode", next);
      }
    },
    [formik],
  );

  const isDisabled =
    LOADING_SIGNUP_VERIFY ||
    !formik.values.verifyCode ||
    formik.values.verifyCode.trim() === "" ||
    formik.values.verifyCode?.length !== 6;

  useToastError({
    error: ERROR_SIGNUP_VERIFY,
    clearErrorAction: () => clearError("verify"),
  });

  return (
    <div className="w-full">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl font-bold mb-3 text-(--text-primary)">
          {t("common.verify_account_heading")}
        </h2>
        <p className="text-(--text-primary)">
          {t("common.verify_account_message_part_1")}{" "}
          <span className="text-(--primary-color) font-bold">
            {signupForm?.email ?? "example@gmail.com"}
          </span>
          . {t("common.verify_account_message_part_2")}
        </p>
      </div>
      <form className="space-y-8" onSubmit={formik.handleSubmit}>
        <OTPForm
          name="verifyCode"
          length={6}
          onChange={handleOtpChange}
          onKeyDown={onKeyDown}
          onComplete={(code) => formik.setFieldValue("verifyCode", code)}
        />
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("common.dont_receive_code")}{" "}
            <a className="text-primary hover:underline font-medium" href="#">
              {t("common.resend_code")}
            </a>
            <span className="text-slate-400 ml-1">(00:59)</span>
          </p>
          <Button
            className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
            type="submit"
            disabled={isDisabled}
            isLoading={LOADING_SIGNUP_VERIFY}
            title={t("common.verify")}
          />
          <Link
            className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mt-2"
            to={`${ROUTER.AUTH.MAIN}?authPage=signup`}
          >
            <span className="material-symbols-outlined md:text-md text-lg">
              arrow_back
            </span>
            {t("common.back")}
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerifyAccount;
