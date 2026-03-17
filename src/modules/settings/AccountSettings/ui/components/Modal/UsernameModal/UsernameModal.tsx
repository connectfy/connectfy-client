import { FC, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdateUsername } from "../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import Input from "@/components/ui/CustomInput/Input/Input";
import { snack } from "@/common/utils/snackManager";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useUpdateUsernameMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import useFormDisabled from "@/hooks/useFormDisabled";
import { CircleUser } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UsernameModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { authenticateToken } = useAuthStore();
  const { showResponseErrors, showFormikErrors } = useErrors();

  const { user } = useUser();

  const [updateUsername, { isLoading: LOADING_UPDATE_USERNAME }] =
    useUpdateUsernameMutation();

  const initialState: IUpdateUsername = {
    username: null,
    token: authenticateToken as string,
  };

  const validate = ({ username }: IUpdateUsername): Record<string, any> => {
    const usernameRegex = /^[A-Za-z0-9._-]+$/;
    const errors: Record<string, any> = {};

    if (!username || !checkEmptyString(username))
      errors.username = t("error_messages.this_field_required");
    else if (!usernameRegex.test(username))
      errors.username = t("error_messages.invalid_username");
    else if (username.length < 3)
      errors.username = t("error_messages.min_length", {
        field: t("common.username"),
        length: 3,
      });

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
        await updateUsername(values).unwrap();
        snack.success(t("user_messages.username_changed_successfully"));
        resetForm();
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IUpdateUsername>({
    formik,
    loading: LOADING_UPDATE_USERNAME,
    validationRules: [
      (values) => !!values.username,
      (values) => !!values.username && checkEmptyString(values.username),
      (values) => !!values.username && values.username.length >= 3,
      (values) => !!values.username && values.username.length <= 30,
      (values) => !!values.username && values.username !== user?.username,
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      showFormikErrors(errors);
      return;
    }
    formik.handleSubmit(e as any);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(e as any);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, formik]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onMouseDown={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto overflow-hidden">
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-(--text-primary) m-0">
            {t("common.change_username")}
          </h2>
          <p className="text-sm text-(--muted-color) leading-relaxed">
            {t("common.update_username_description")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col">
            <Input
              inputSize="large"
              id="username"
              name="username"
              title={t("common.username")}
              value={formik.values.username || ""}
              onChange={(e) => {
                const value = e.target.value || null;
                if (value && value.length > 30) return;
                formik.setFieldValue("username", value);
              }}
              onBlur={formik.handleBlur}
              isError={!!formik.errors.username}
              disabled={LOADING_UPDATE_USERNAME}
              autoFocus
              autoComplete="off"
              icon={<CircleUser />}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border)"
              disabled={LOADING_UPDATE_USERNAME}
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200 bg-(--primary-color) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) flex items-center justify-center min-h-[48px]"
              disabled={isDisabled}
              isLoading={LOADING_UPDATE_USERNAME}
              title={t("common.save")}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UsernameModal;
