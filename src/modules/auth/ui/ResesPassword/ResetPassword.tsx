import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput.tsx";
import { useFormik } from "formik";
import { resetPasswordInitialState } from "../../constants/intialState";
import { validateResetPassword } from "../../constants/validation";
import { Fragment, useEffect } from "react";
import { TOKEN_TYPE } from "@/common/enums/enums";
import { useSearchParams } from "react-router-dom";
import { snack } from "@/common/utils/snackManager";
import useFormDisabled from "@/hooks/useFormDisabled";
import { IResetPasswordForm } from "../../types/types";
import { ROUTER } from "@/common/constants/routet";
import {
  useIsValidTokenMutation,
  useResetPasswordMutation,
} from "../../api/api";
import { useErrors } from "@/hooks/useErrors";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner/Spinner";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const { showFormikErrors } = useErrors();

  const [resetPassword, { isLoading: LOADING_RESET_PASSWORD }] =
    useResetPasswordMutation();
  const [isValidToken, { isLoading: LOADING_IS_VALID_TOKEN }] =
    useIsValidTokenMutation();

  const { showResponseErrors } = useErrors();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const formik = useFormik({
    initialValues: resetPasswordInitialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateResetPassword(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        await resetPassword(values).unwrap();
        snack.success(t("user_messages.reset_password_successfull"));
        navigate("/auth");
        resetForm();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IResetPasswordForm>({
    formik,
    loading: LOADING_RESET_PASSWORD,
    validationRules: [
      (values) => !!values.password,
      (values) => !!values.confirmPassword,
      (values) => !!values.resetToken,
      !!token,
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      showFormikErrors(errors);
      return;
    }
    formik.handleSubmit(e as any);
  };

  useEffect(() => {
    if (!token) {
      navigate(ROUTER.AUTH.LOGIN);
      return;
    }

    (async () => {
      try {
        const res = await isValidToken({
          token,
          type: TOKEN_TYPE.PASSWORD_RESET,
        }).unwrap();

        if (!res) {
          navigate(ROUTER.AUTH.LOGIN);
          return;
        }
      } catch {
        navigate(ROUTER.AUTH.LOGIN);
      }
    })();

    formik.setFieldValue("resetToken", token);
  }, [token]);

  useEffect(() => {
    if (isDisabled) return;

    const handleSubmitEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleSubmitEnter);
    return () => {
      document.removeEventListener("keydown", handleSubmitEnter);
    };
  }, [isDisabled, formik.handleSubmit]);

  return (
    <Fragment>
      {LOADING_IS_VALID_TOKEN ? (
        <Modal open={LOADING_IS_VALID_TOKEN} onClose={() => {}}>
          <div className="flex flex-col items-center justify-center gap-8">
            <Spinner size={30} style={{ color: "var(--primary-color)" }} />

            <p className="font-semibold lg:text-xl text-lg text-(--text-primary)">
              {t("common.checking")}
            </p>
          </div>
        </Modal>
      ) : (
        <Fragment>
          <div className="w-full">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-3 text-(--text-primary)">
                {t("common.reset_password_title")}
              </h2>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <PasswordInput
                title={t("common.password")}
                name="password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                showGenerateButton
                isFloating
                value={formik.values.password || ""}
                onChange={(e) => {
                  const value = e.target.value || null;

                  if (value && value.length > 30) return;

                  formik.setFieldValue("password", value || null);
                }}
                onBlur={() => formik.setFieldTouched("password", true, false)}
                onGenerate={(value) => {
                  formik.setFieldValue("password", value);
                  formik.setFieldValue("confirmPassword", value);
                }}
                isError={!!formik.errors.password}
                maxLength={30}
              />
              <PasswordInput
                title={t("common.confirm_password")}
                name="confirmPassword"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-input-border bg-white dark:bg-form-bg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                value={formik.values.confirmPassword || ""}
                isFloating
                onChange={(e) => {
                  const value = e.target.value || null;

                  if (value && value.length > 30) return;

                  formik.setFieldValue("confirmPassword", value || null);
                }}
                onBlur={() =>
                  formik.setFieldTouched("confirmPassword", true, false)
                }
                isError={!!formik.errors.confirmPassword}
                maxLength={30}
              />
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button
                className="duration-400 h-[60px] w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)] bg-(--primary-color) text-[#020a06]"
                type="submit"
                disabled={isDisabled}
                isLoading={LOADING_RESET_PASSWORD}
                title={t("common.submit")}
              />
            </div>
          </form>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ResetPassword;
