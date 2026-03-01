import { FC, Fragment, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdateEmail } from "../../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import { useUpdateEmailMutation } from "@/modules/settings/AccountSettings/api/api";
import Input from "@/components/ui/CustomInput/Input/Input";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import useFormDisabled from "@/hooks/useFormDisabled";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangeEmailModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { access_token, authenticateToken } = useAuthStore();

  const { showResponseErrors, showFormikErrors } = useErrors();

  const { data: user } = useGetMeQuery(undefined, {
    skip: !access_token,
  });

  const [updateEmail, { isLoading }] = useUpdateEmailMutation();

  const [success, setSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const initialState: IUpdateEmail = {
    email: null,
    token: authenticateToken as string,
  };

  const validate = ({ email }: IUpdateEmail): Record<string, any> => {
    const errors: Record<string, any> = {};

    if (!email || !checkEmptyString(email)) {
      errors.email = t("error_messages.this_field_required");
      return errors;
    }

    const value = email.trim();

    if (value.length > 254) {
      errors.email = t("error_messages.email_too_long");
      return errors;
    }

    const atCount = (value.match(/@/g) || []).length;
    if (atCount !== 1) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    const [localPart, domainPart] = value.split("@");

    if (!localPart || !domainPart) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    if (localPart.length > 64) {
      errors.email = t("error_messages.email_local_part_too_long");
      return errors;
    }

    if (/\.\./.test(localPart) || /\.\./.test(domainPart)) {
      errors.email = t("error_messages.email_consecutive_dots");
      return errors;
    }

    const localAllowedRe = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
    if (!localAllowedRe.test(localPart)) {
      errors.email = t("error_messages.email_invalid_local_chars");
      return errors;
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

    const domainLabels = domainPart.split(".");
    if (domainLabels.some((label) => label.length === 0)) {
      errors.email = t("error_messages.email_invalid_domain");
      return errors;
    }

    const domainLabelRe = /^[A-Za-z0-9-]+$/;
    for (const label of domainLabels) {
      if (label.length < 1 || label.length > 63) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
      if (!domainLabelRe.test(label)) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
      if (label.startsWith("-") || label.endsWith("-")) {
        errors.email = t("error_messages.email_invalid_domain");
        return errors;
      }
    }

    const tld = domainLabels[domainLabels.length - 1];
    if (!/^[A-Za-z]{2,}$/.test(tld)) {
      errors.email = t("error_messages.email_invalid_domain");
      return errors;
    }

    const simpleEmailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simpleEmailRe.test(value)) {
      errors.email = t("error_messages.invalid_email_format");
      return errors;
    }

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
        await updateEmail(values).unwrap();
        resetForm();
        setSuccess(true);
        setEmail(values.email);
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IUpdateEmail>({
    formik,
    loading: isLoading,
    validationRules: [
      (values) => !!values.email,
      (values) => values.email !== user?.email,
    ],
  });

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
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

  const handleClose = () => {
    setSuccess(false);
    setEmail(null);
    formik.resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (isLoading || !formik.values.email) return;
        formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (isLoading) return;
        onClose();
      }
    };

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [open, formik]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onMouseDown={handleOverlayPointerDown}
    >
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto overflow-hidden">
        {!success ? (
          <Fragment>
            {/* Header */}
            <div className="mb-7">
              <h2 className="text-2xl font-semibold text-(--text-primary) mb-2 leading-tight">
                {t("common.update_email")}
              </h2>
              <p className="text-sm text-(--muted-color) leading-relaxed">
                {t("common.update_email_description")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col">
                <Input
                  inputSize="large"
                  id="email"
                  type="email"
                  name="email"
                  title={t("common.email")}
                  value={formik.values.email || ""}
                  onChange={(e) => {
                    const value = e.target.value || null;
                    if (value && value.length > 254) return;
                    formik.setFieldValue("email", value);
                  }}
                  onBlur={formik.handleBlur}
                  isError={!!formik.errors.email}
                  disabled={isLoading}
                  autoFocus
                  autoComplete="off"
                  icon={<span className="material-symbols-outlined">mail</span>}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border)"
                  disabled={isLoading}
                  title={t("common.cancel")}
                />
                <Button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--primary-color) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) flex items-center justify-center gap-2"
                  disabled={isDisabled}
                  isLoading={isLoading}
                  title={t("common.save")}
                />
              </div>
            </form>
          </Fragment>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center text-center animate-fade-in py-4">
            <div className="w-[72px] h-[72px] bg-[rgba(0,0,0,0.03)] dark:bg-[rgba(255,255,255,0.03)] rounded-full flex items-center justify-center mb-4 animate-bounce-custom">
              <span
                className="material-symbols-outlined text-(--primary-color)"
                style={{ fontSize: "40px" }}
              >
                mark_email_read
              </span>
            </div>

            <h3 className="text-lg font-semibold text-(--text-primary) mb-2.5 m-0">
              {t("user_messages.email_confirmation_sent") ||
                "Confirmation email sent"}
            </h3>

            <p className="text-[14px] text-(--muted-color) leading-[1.4] mb-6 max-w-[420px] m-0">
              {email
                ? t("user_messages.check_inbox_for_confirmation", { email })
                : t("user_messages.check_inbox")}
            </p>

            <Button
              type="button"
              onClick={handleClose}
              className="w-full sm:w-auto px-8 py-3 rounded-[10px] text-[15px] font-medium transition-all duration-200 bg-(--primary-color) text-white hover:shadow-(--active-shadow)"
              title={t("common.ok")}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ChangeEmailModal;
