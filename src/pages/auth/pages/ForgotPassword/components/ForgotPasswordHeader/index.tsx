import "./index.style.css";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Email, Phone } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Resource } from "@/types/enum.types";
import type { ForgotPasswordModeType } from "@/types/auth/auth.type";
import { setForgotPasswordMode } from "@/features/auth/authSlice";

const ForgotPasswordHeader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { forgotPasswordMode } = useSelector(
    (state: RootState) => state[Resource.auth]
  );

  const changeMode = (mode: ForgotPasswordModeType) =>
    dispatch(setForgotPasswordMode(mode));

  return (
    <section id="forgot-password-header">
      <div className="forgot-password-header">
        <Tooltip placement="top" title={t("common.find_account_with_email")}>
          <div
            className={`forgot-password-header-btn email-btn ${forgotPasswordMode === "email" ? "login-header-btn-active" : ""}`}
            onClick={() => changeMode("email")}
          >
            <Email className="forgot-password-header-btn-icon" />
          </div>
        </Tooltip>
        <Tooltip
          placement="top"
          title={t("common.find_account_with_phone_number")}
        >
          <div
            className={`forgot-password-header-btn phone-number-btn ${forgotPasswordMode === "phoneNumber" ? "login-header-btn-active" : ""}`}
            onClick={() => changeMode("phoneNumber")}
          >
            <Phone className="forgot-password-header-btn-icon" />
          </div>
        </Tooltip>
      </div>
    </section>
  );
};

export default ForgotPasswordHeader;
