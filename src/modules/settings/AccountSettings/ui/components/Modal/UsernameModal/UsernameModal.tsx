import "./usernameModal.style.css";
import { FC, useCallback, useEffect } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdateUsername } from "../../../../types/types";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useFormik } from "formik";
import Input from "@/components/ui/CustomInput/Input/Input";
import { snack } from "@/common/utils/snackManager";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { useUpdateUsernameMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";
import { useErrors } from "@/hooks/useErrors";

interface Props {
  open: boolean;
  onClose: () => void;
}

const UsernameModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const { getToken } = useAuthTokenManager();
  const { accessToken: access_token, authenticateToken: authToken } = getToken(
    "all",
  ) as { accessToken: string; authenticateToken: string };

  const { data: user } = useGetMeQuery(undefined, {
    skip: !access_token,
  });
  const [
    updateUsername,
    { isLoading: LOADING_UPDATE_USERNAME, error: ERROR_UPDATE_USERNAME },
  ] = useUpdateUsernameMutation();
  const { showResponseErrors } = useErrors();

  const initialState: IUpdateUsername = {
    username: null,
    token: authToken as string,
  };

  const validate = ({ username }: IUpdateUsername): Record<string, any> => {
    const errors: Record<string, any> = {};
    const usernameRegex = /^[A-Za-z0-9._-]+$/;

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

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (
          LOADING_UPDATE_USERNAME ||
          ERROR_UPDATE_USERNAME ||
          !formik.values.username
        )
          return;
        formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (LOADING_UPDATE_USERNAME || ERROR_UPDATE_USERNAME) return;
        onClose();
      }
    },
    [open, LOADING_UPDATE_USERNAME, ERROR_UPDATE_USERNAME, formik, onClose],
  );

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="account-settings-modal-container">
        <div className="account-settings-modal-header">
          <h2 className="account-settings-modal-title">
            {t("common.change_username")}
          </h2>
          <p className="account-settings-modal-subtitle">
            {t("common.update_username_description")}
          </p>
        </div>

        <div className="account-settings-modal-form">
          <div className="account-settings-modal-field">
            <Input
              inputSize="medium"
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
            />
            {formik.errors.username && formik.touched.username && (
              <span className="account-settings-modal-error">
                {formik.errors.username}
              </span>
            )}
          </div>

          <div className="account-settings-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="account-settings-modal-btn account-settings-modal-btn-cancel"
              disabled={LOADING_UPDATE_USERNAME}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="account-settings-modal-btn account-settings-modal-btn-save"
              disabled={
                LOADING_UPDATE_USERNAME ||
                !formik.values.username ||
                user?.username === formik.values.username
              }
            >
              {LOADING_UPDATE_USERNAME ? (
                <span className="account-settings-modal-loader" />
              ) : (
                t("common.save")
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UsernameModal;
