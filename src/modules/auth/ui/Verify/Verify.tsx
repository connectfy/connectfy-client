import { useTranslation } from "react-i18next";
import { LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import { useFormik } from "formik";
import { verifySignupInitialState } from "../../constants/intialState";
import { validateVerifySignup } from "../../constants/validation";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { onPressEnter, onPressEsc } from "@/common/utils/keyPressDown";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { checkDeviceId } from "@/common/utils/checkDevice";
import OTPForm from "@/components/Form/OTPForm/OTPForm";
import Button from "@/components/ui/CustomButton/Button/Button";
import { formatTimeToSeconds } from "@/common/utils/formatDate";
import {
  useResendSignupVerifyMutation,
  useSignupVerifyMutation,
} from "../../api/api";
import { ISignupForm, ISignupVerifyForm } from "../../types/types";
import useFormDisabled from "@/hooks/useFormDisabled";
import { useErrors } from "@/hooks/useErrors";
import { authTokenManager } from "@/common/helpers/authToken.manager";

const TIMER_DURATION = 60;

const VerifyAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const signupForm = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_FORM) || "{}",
  ) as ISignupForm | null;

  const [signupVerify, { isLoading: LOADING_SIGNUP_VERIFY }] =
    useSignupVerifyMutation();
  const [resendSignupVerify, { isLoading: LOADING_RESEND_SIGNUP_VERIFY }] =
    useResendSignupVerifyMutation();

  const { showResponseErrors } = useErrors();

  const [timeLeft, setTimeLeft] = useState<number>(TIMER_DURATION);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const formik = useFormik({
    initialValues: verifySignupInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateVerifySignup(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        values.deviceId = checkDeviceId();
        const res = await signupVerify(values).unwrap();
        if (res) {
          snack.success(t("user_messages.verify_successful"));
          authTokenManager.setToken({
            type: "accessToken",
            token: res.access_token,
          });
          localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.SIGNUP_FORM);
          resetForm();
          navigate(ROUTER.MESSENGER.MAIN);
        }
      } catch (error) {
        showResponseErrors(error);
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

  const isDisabled = useFormDisabled<ISignupVerifyForm>({
    formik,
    loading: LOADING_SIGNUP_VERIFY,
    validationRules: [
      (values) =>
        !values.verifyCode ||
        values.verifyCode.length !== 6 ||
        values.verifyCode.trim() === "",
    ],
  });

  // const isDisabled =
  //   LOADING_SIGNUP_VERIFY ||
  //   !formik.values.verifyCode ||
  //   formik.values.verifyCode.trim() === "" ||
  //   formik.values.verifyCode?.length !== 6;

  const startTimer = () => {
    const expiresAt = Date.now() + TIMER_DURATION * 1000;
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT,
      expiresAt.toString(),
    );
    setTimeLeft(TIMER_DURATION);
    setIsResendDisabled(true);
  };

  const handleResendCode = async () => {
    if (isResendDisabled) return;

    try {
      const res = await resendSignupVerify().unwrap();
      if (res) {
        snack.success(t("user_messages.otp_resent"));
        startTimer();
      }
    } catch (error) {
      showResponseErrors(error);
    }
  };

  useEffect(() => {
    const storedExpiresAt = localStorage.getItem(
      LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT,
    );

    if (!storedExpiresAt) {
      startTimer();
    } else {
      const difference = Math.floor(
        (parseInt(storedExpiresAt) - Date.now()) / 1000,
      );

      if (difference > 0) {
        setTimeLeft(difference);
        setIsResendDisabled(true);
      } else {
        setTimeLeft(0);
        setIsResendDisabled(false);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT);
      return;
    }

    const interval = setInterval(() => {
      const storedExpiresAt = localStorage.getItem(
        LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT,
      );
      if (storedExpiresAt) {
        const difference = Math.floor(
          (parseInt(storedExpiresAt) - Date.now()) / 1000,
        );

        if (difference > 0) {
          setTimeLeft(difference);
        } else {
          setTimeLeft(0);
          setIsResendDisabled(false);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.OTP_EXPIRES_AT);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

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
            {t("common.do_not_receive_code")}{" "}
            <Button
              type="button"
              onClick={handleResendCode}
              disabled={isResendDisabled}
              isLoading={LOADING_RESEND_SIGNUP_VERIFY}
              className={`font-medium transition-all bg-transparent border-none ${
                isResendDisabled
                  ? "text-slate-400"
                  : "text-(--primary-color) hover:underline"
              }`}
              title={t("common.resend_code")}
            />
            {isResendDisabled && (
              <span className="text-slate-400 ml-2 font-mono">
                ({formatTimeToSeconds(timeLeft)})
              </span>
            )}
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
