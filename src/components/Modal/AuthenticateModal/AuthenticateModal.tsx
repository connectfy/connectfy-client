import { FC, Fragment, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PasswordInput from "@/components/ui/CustomInput/PasswordInput/PasswordInput";
import { useFormik } from "formik";
import { checkEmptyString } from "@/common/utils/checkValues";
import { PROVIDER, TOKEN_TYPE } from "@/common/enums/enums";
import Modal from "..";
import { snack } from "@/common/utils/snackManager";
import { GoogleLogin } from "@react-oauth/google";
import { IAuthenticateUser } from "@/modules/auth/types/types";
import { useAuthenticateUserMutation } from "@/modules/auth/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useUser } from "@/modules/profile/hooks/useUser";

interface Props {
  open: boolean;
  onClose: () => void;
  onAuthenticate: () => void;
  authType: TOKEN_TYPE;
}

const AuthenticateModal: FC<Props> = ({
  open,
  onClose,
  onAuthenticate,
  authType,
}) => {
  const { setToken } = useAuthStore();
  const { t } = useTranslation();
  const { showResponseErrors } = useErrors();

  const [
    authenticateUser,
    { isLoading: LOADING_AUTHENTICATE_USER, error: ERROR_AUTHENTICATE_USER },
  ] = useAuthenticateUserMutation();

  const { user } = useUser();

  const { provider } = user ?? {};
  const usesPasswordAuth = provider === PROVIDER.PASSWORD;
  const usesOAuth =
    provider === PROVIDER.GOOGLE || provider === PROVIDER.FACEBOOK;

  const initialState: IAuthenticateUser = {
    password: null,
    type: authType,
    idToken: null,
  };

  const validate = ({
    password,
    idToken,
  }: IAuthenticateUser): Record<string, any> => {
    const errors: Record<string, any> = {};

    if (usesPasswordAuth && (!password || !checkEmptyString(password))) {
      errors.password = t("error_messages.this_field_required");
    }

    if (usesOAuth && (!idToken || !checkEmptyString(idToken)))
      errors.idToken = t("error_messages.this_field_required");

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
        const res = await authenticateUser(values).unwrap();
        setToken({
          token: res.token,
          type: "authenticateToken",
        });
        onAuthenticate();
        resetForm();
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (LOADING_AUTHENTICATE_USER) return;
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (usesPasswordAuth) {
      formik.submitForm();
    }
  };

  const isButtonsDisabled =
    LOADING_AUTHENTICATE_USER || ERROR_AUTHENTICATE_USER;

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (isButtonsDisabled || !formik.values.password) return;
        formik.submitForm();
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (isButtonsDisabled) return;
        onClose();
      }
    },
    [open, isButtonsDisabled, formik, onClose],
  );

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const idToken = tokenResponse.credential;

      if (!idToken) {
        snack.error(t("error_messages.process_failed"));
        return;
      }

      const finalValues = {
        ...formik.values,
        idToken,
      };

      const res = await authenticateUser(finalValues).unwrap();
      setToken({
        token: res.token,
        type: "authenticateToken",
      });
      onAuthenticate();
      formik.resetForm();
      onClose();
    } catch (error) {
      showResponseErrors(error);
    }
  };

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  return (
    <Modal open={open} onClose={onClose} onMouseDown={handleOverlayPointerDown}>
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[440px] w-[90%] shadow-(--card-shadow) animate-fade-in mx-auto">
        {/* <div className="flex justify-center mb-4 animate-bounce-custom">
          <span
            className="material-symbols-outlined text-(--primary-color)"
            style={{ fontSize: "50px" }}
          >
            verified_user
          </span>
        </div> */}

        <h2 className="text-2xl font-bold text-(--text-primary) mb-3 text-center">
          {t("common.authentication_required")}
        </h2>

        <p className="text-[15px] text-(--text-secondary)] mb-6 text-center leading-relaxed">
          {usesPasswordAuth
            ? t("common.enter_password_to_continue")
            : t("common.verify_identity_to_continue")}
        </p>

        {usesPasswordAuth && (
          <Fragment>
            <div className="relative mb-2">
              <PasswordInput
                inputSize="large"
                title={t("common.password")}
                value={formik.values.password || ""}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value || null);
                }}
                disabled={LOADING_AUTHENTICATE_USER}
                autoFocus
                isError={!!formik.errors.password}
              />
            </div>
          </Fragment>
        )}

        {usesPasswordAuth ? (
          <div className="flex gap-3 justify-center mt-6">
            <Button
              className="flex-1 min-w-[120px] h-11 flex items-center justify-center px-7 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 bg-(--input-bg) text-(--text-primary) hover:bg-(--input-border)"
              onClick={onClose}
              disabled={LOADING_AUTHENTICATE_USER}
              title={t("common.cancel")}
            />

            <Button
              className="flex-1 min-w-[120px] h-11 flex items-center justify-center px-7 py-3 rounded-[10px] text-sm font-semibold transition-all duration-600 bg-linear-to-br from-(--third-color) to-(--hover-bg) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow)"
              onClick={handleSubmit}
              disabled={
                LOADING_AUTHENTICATE_USER ||
                (usesPasswordAuth && !formik.values.password)
              }
              isLoading={LOADING_AUTHENTICATE_USER}
              title={t("common.submit")}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 w-full mt-6">
            <Button
              className="w-full sm:flex-1 min-w-[120px] h-11 flex items-center justify-center px-7 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 bg-(--input-bg) text-(--text-primary) hover:bg-(--input-border)"
              onClick={onClose}
              disabled={LOADING_AUTHENTICATE_USER}
              title={t("common.cancel")}
            />

            <div className="relative w-full sm:flex-[1.3] min-w-0">
              <Button
                className="w-full h-11 flex items-center justify-center px-7 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 bg-linear-to-br from-(--third-color) to-(--hover-bg) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow)"
                onClick={handleSubmit}
                disabled={LOADING_AUTHENTICATE_USER}
                title={t("common.authenticate")}
                isLoading={LOADING_AUTHENTICATE_USER}
              />

              <div className="absolute inset-0 opacity-0 z-10 overflow-hidden rounded-[10px] [&_div]:w-full! [&_div]:h-full! [&_div]:min-w-full! [&_div]:min-h-full! [&_iframe]:w-full! [&_iframe]:h-full! [&_iframe]:min-w-full! [&_iframe]:min-h-full! [&_iframe]:opacity-0">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() =>
                    snack.error(t("error_messages.google_login_failed"))
                  }
                  useOneTap={false}
                  width="100%"
                  locale="en"
                  theme="filled_blue"
                  size="large"
                  type="standard"
                  shape="rectangular"
                  text="continue_with"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuthenticateModal;
