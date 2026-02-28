import { FC, useCallback, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdatePassword } from "../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import { snack } from "@/common/utils/snackManager";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput";
import { useUpdatePasswordMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PasswordModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { authenticateToken } = useAuthStore();
  const { showResponseErrors, showFormikErrors } = useErrors();

  const [
    updatePassword,
    { isLoading: LOADING_UPDATE_PASSWORD, error: ERROR_UPDATE_PASSWORD },
  ] = useUpdatePasswordMutation();

  const initialState: IUpdatePassword = {
    password: null,
    confirmPassword: null,
    token: authenticateToken as string,
  };

  const validate = ({
    password,
    confirmPassword,
  }: IUpdatePassword): Record<string, any> => {
    const errors: Record<string, any> = {};
    const passwordComplexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (!password || !checkEmptyString(password))
      errors.password = t("error_messages.password_is_required");
    else if (password.length < 8 || !passwordComplexityRegex.test(password))
      errors.password = t("error_messages.password_rule");

    if (password !== confirmPassword)
      errors.confirmPassword = t("error_messages.password_mismatch");

    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validate(values),
    onSubmit: async (values, { resetForm }) => {
      try {
        await updatePassword(values).unwrap();
        snack.success(t("user_messages.password_changed_successfully"));
        resetForm();
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      showFormikErrors(errors);
      return;
    }
    formik.handleSubmit(e as any);
  };

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (
          LOADING_UPDATE_PASSWORD ||
          ERROR_UPDATE_PASSWORD ||
          !formik.values.password ||
          !formik.values.confirmPassword
        )
          return;
        handleSubmit(e as any);
      }
      if (e.key === "Escape") {
        if (LOADING_UPDATE_PASSWORD) return;
        onClose();
      }
    },
    [open, LOADING_UPDATE_PASSWORD, ERROR_UPDATE_PASSWORD, formik, onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", globalKeyDown);
    return () => document.removeEventListener("keydown", globalKeyDown);
  }, [open, globalKeyDown]);

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-2 leading-tight">
            {t("common.change_password")}
          </h2>
          <p className="text-sm text-(--muted-color) leading-relaxed">
            {t("common.change_password_description")}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            {/* Password Field */}
            <div className="flex flex-col">
              <PasswordInput
                inputSize="large"
                id="password"
                name="password"
                title={t("common.password")}
                value={formik.values.password || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 30)
                    formik.setFieldValue("password", val || null);
                }}
                onBlur={formik.handleBlur}
                isError={!!formik.errors.password}
                disabled={LOADING_UPDATE_PASSWORD}
                autoFocus
                autoComplete="off"
                showGenerateButton
                onGenerate={(value?: string) => {
                  formik.setFieldValue("password", value);
                  formik.setFieldValue("confirmPassword", value);
                }}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col">
              <PasswordInput
                inputSize="large"
                id="confirmPassword"
                name="confirmPassword"
                title={t("common.confirm_password")}
                value={formik.values.confirmPassword || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 30)
                    formik.setFieldValue("confirmPassword", val || null);
                }}
                onBlur={formik.handleBlur}
                isError={!!formik.errors.confirmPassword}
                disabled={LOADING_UPDATE_PASSWORD}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border) disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={LOADING_UPDATE_PASSWORD}
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              className="flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--primary-color) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={
                LOADING_UPDATE_PASSWORD ||
                !formik.values.password ||
                !formik.values.confirmPassword
              }
              isLoading={LOADING_UPDATE_PASSWORD}
              title={t("common.save")}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default PasswordModal;
