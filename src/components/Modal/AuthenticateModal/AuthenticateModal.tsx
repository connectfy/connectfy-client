import { FC, Fragment, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ShieldCheck } from "lucide-react";
import "./authenticateModal.style.css";
import PasswordInput from "@/components/PasswordInput/PasswordInput";
import { useFormik } from "formik";
import { checkEmptyString } from "@/common/utils/checkValues";
import { PROVIDER, TOKEN_TYPE } from "@/common/enums/enums";
import Modal from "..";
import { snack } from "@/common/utils/snackManager";
import { GoogleLogin } from "@react-oauth/google";
import { IAuthenticateUser } from "@/modules/auth/types/types";
import { useAuthenticateUserMutation } from "@/modules/auth/api/api";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { authTokenManager } from "@/common/helpers/authToken.manager";

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
  const { t } = useTranslation();

  const [
    authenticateUser,
    { isLoading: LOADING_AUTHENTICATE_USER, error: ERROR_AUTHENTICATE_USER },
  ] = useAuthenticateUserMutation();
  const { data: me } = useGetMeQuery();

  const isPasswordProvider = me?.user.provider === PROVIDER.PASSWORD;

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

    if (isPasswordProvider && (!password || !checkEmptyString(password))) {
      errors.password = t("error_messages.this_field_required");
    }

    if (
      me?.user.provider === PROVIDER.GOOGLE &&
      (!idToken || !checkEmptyString(idToken))
    )
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
      console.log(values);
      const res = await authenticateUser(values).unwrap();
      if (res) {
        authTokenManager.setToken({
          token: res.token,
          type: "accessToken",
        });
        onAuthenticate();
        resetForm();
        onClose();
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
    if (isPasswordProvider) {
      formik.submitForm();
      return;
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
    if (res) {
      authTokenManager.setToken({
        token: res.token,
        type: "accessToken",
      });
      onAuthenticate();
      formik.resetForm();
      onClose();
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
      <div className="authenticate-modal">
        <div className="authenticate-icon">
          <ShieldCheck size={50} color="var(--primary-color)" />
        </div>
        <h2>{t("common.authentication_required")}</h2>

        <p>
          {isPasswordProvider
            ? t("common.enter_password_to_continue")
            : t("common.verify_identity_to_continue")}
        </p>

        {isPasswordProvider && (
          <Fragment>
            <div className="authenticate-input-container">
              <PasswordInput
                size="medium"
                label={t("common.password")}
                value={formik.values.password}
                onChange={(e) => {
                  formik.setFieldValue("password", e.target.value || null);
                }}
                disabled={LOADING_AUTHENTICATE_USER}
                autoFocus
                fullWidth
                hasError={formik.errors.password ? true : false}
              />
            </div>

            {formik.errors.password && (
              <div className="authenticate-error-message">
                {formik.errors.password}
              </div>
            )}
          </Fragment>
        )}

        {isPasswordProvider ? (
          <div className="authenticate-actions">
            <button
              className="authenticate-btn authenticate-btn-cancel"
              onClick={onClose}
              disabled={LOADING_AUTHENTICATE_USER}
            >
              {t("common.cancel")}
            </button>

            <button
              className="authenticate-btn authenticate-btn-submit"
              onClick={handleSubmit}
              disabled={
                LOADING_AUTHENTICATE_USER ||
                (isPasswordProvider && !formik.values.password)
              }
            >
              {LOADING_AUTHENTICATE_USER ? (
                <div className="authenticate-spinner" />
              ) : (
                t("common.submit")
              )}
            </button>
          </div>
        ) : (
          // Google Provider 时的布局
          <div className="authenticate-actions google-provider-layout">
            <button
              className="authenticate-btn authenticate-btn-cancel"
              onClick={onClose}
              disabled={LOADING_AUTHENTICATE_USER}
            >
              {t("common.cancel")}
            </button>

            <div className="authenticate-google-wrapper">
              <button
                className="authenticate-btn authenticate-btn-submit"
                onClick={handleSubmit}
                disabled={LOADING_AUTHENTICATE_USER}
              >
                {LOADING_AUTHENTICATE_USER ? (
                  <div className="authenticate-spinner" />
                ) : (
                  t("common.authenticate")
                )}
              </button>

              <div className="google-button-overlay">
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
