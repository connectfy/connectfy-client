import { FC, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdateTwoFactor } from "../../../../types/types";
import { useFormik } from "formik";
import { snack } from "@/common/utils/snackManager";
import { useUpdateTwoFactorMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import useFormDisabled from "@/hooks/useFormDisabled";
import { TWO_FACTOR_ACTION } from "@/common/enums/enums";

interface Props {
  open: boolean;
  onClose: () => void;
  action: TWO_FACTOR_ACTION;
}

const TwoFactorModal: FC<Props> = ({ open, onClose, action }) => {
  const { t } = useTranslation();
  const { authenticateToken } = useAuthStore();
  const { showResponseErrors, showFormikErrors } = useErrors();

  const [updateTwoFactor, { isLoading }] = useUpdateTwoFactorMutation();

  const initialState: IUpdateTwoFactor = {
    action,
    token: authenticateToken as string,
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await updateTwoFactor(values).unwrap();
        snack.success(t("user_messages.information_updated"));
        resetForm();
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IUpdateTwoFactor>({
    formik,
    loading: isLoading,
    validationRules: [],
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

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (isDisabled) return;
        handleSubmit(e as any);
      }
      if (e.key === "Escape") {
        if (isLoading) return;
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, formik]);

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-semibold text-(--text-primary) mb-2 leading-tight">
            {action === TWO_FACTOR_ACTION.ENABLE
              ? t("common.enable_two_factor_authentication")
              : t("common.disable_two_factor_authentication")}
          </h2>

          <p className="text-sm text-(--muted-color) leading-relaxed">
            {action === TWO_FACTOR_ACTION.ENABLE
              ? t("common.enable_two_factor_authentication_description")
              : t("common.disable_two_factor_authentication_description")}
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border)"
              disabled={isLoading}
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              className={`flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 ${action === TWO_FACTOR_ACTION.ENABLE ? "bg-(--primary-color)" : "bg-(--error-color)"} text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) flex items-center justify-center gap-2`}
              disabled={isDisabled}
              isLoading={isLoading}
              title={
                action === TWO_FACTOR_ACTION.ENABLE
                  ? t("common.enable")
                  : t("common.disable")
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TwoFactorModal;
