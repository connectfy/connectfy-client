import "./index.style.css";
import { type FC } from "react";
import { Badge, Phone, Email, Face } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { setLoginMode } from "@/features/auth/authSlice";
import { IDENTIFIER_TYPE, Resource } from "@/types/enum.types";
import { ILoginForm, LoginModeType } from "@/types/auth/auth.type";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { FormikProps } from "formik";

interface Props {
  formik: FormikProps<ILoginForm>;
}

const LoginHeader: FC<Props> = ({ formik }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loginMode, LOADING_LOGIN } = useAppSelector(
    (state) => state[Resource.auth]
  );

  const changeLoginMode = (mode: LoginModeType) => {
    if (LOADING_LOGIN) return;

    // formik.setFieldValue("identifierType", mode);
    formik.setFieldValue("identifier", null);
    formik.setFieldValue("password", null);

    formik.setFieldTouched("identifierType", false, false);
    formik.setFieldTouched("identifier", false, false);
    formik.setFieldTouched("password", false, false);

    switch (mode) {
      case "username":
        formik.setFieldValue("identifierType", IDENTIFIER_TYPE.USERNAME);
        break;
      case "email":
        formik.setFieldValue("identifierType", IDENTIFIER_TYPE.EMAIL);
        break;
      case "phoneNumber":
        formik.setFieldValue("identifierType", IDENTIFIER_TYPE.PHONE_NUMBER);
        break;
      case "faceDescriptor":
        formik.setFieldValue("identifierType", IDENTIFIER_TYPE.FACE_DESCRIPTOR);
        break;
    }

    dispatch(setLoginMode(mode));
  };

  return (
    <section id="login-header">
      <div className="login-header">
        <Tooltip placement="top" title={t("common.login_with_username")}>
          <div
            className={`login-header-btn username-btn ${loginMode === "username" ? "login-header-btn-active" : ""}`}
            onClick={() => changeLoginMode("username")}
          >
            <Badge className="login-header-btn-icon" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title={t("common.login_with_email")}>
          <div
            className={`login-header-btn email-btn ${loginMode === "email" ? "login-header-btn-active" : ""}`}
            onClick={() => changeLoginMode("email")}
          >
            <Email className="login-header-btn-icon" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title={t("common.login_with_phone_number")}>
          <div
            className={`login-header-btn phone-number-btn ${loginMode === "phoneNumber" ? "login-header-btn-active" : ""}`}
            onClick={() => changeLoginMode("phoneNumber")}
          >
            <Phone className="login-header-btn-icon" />
          </div>
        </Tooltip>
        <Tooltip placement="top" title={t("common.login_with_faceId")}>
          <div
            className={`login-header-btn face-descriptor-btn ${loginMode === "faceDescriptor" ? "login-header-btn-active" : ""}`}
            onClick={() => changeLoginMode("faceDescriptor")}
          >
            <Face className="login-header-btn-icon" />
          </div>
        </Tooltip>
      </div>
    </section>
  );
};

export default LoginHeader;
