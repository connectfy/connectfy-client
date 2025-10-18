import "./index.style.css";
import { type FC } from "react";
import { Badge, Phone, Email, Face } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setLoginMode } from "@/features/auth/authSlice";
import { Resource } from "../../../../../../types/enum.types";
import type { LoginModeType } from "../../../../../../types/auth/auth.type";
import { useTranslation } from "react-i18next";

const LoginHeader: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loginMode } = useSelector((state: RootState) => state[Resource.auth]);

  const changeLoginMode = (mode: LoginModeType) => dispatch(setLoginMode(mode));

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
