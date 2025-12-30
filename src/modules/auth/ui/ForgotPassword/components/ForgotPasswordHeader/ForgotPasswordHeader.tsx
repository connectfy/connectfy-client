import "./forgotPasswordHeader.style.css";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Email, Phone } from "@mui/icons-material";
import { FORGOT_PASSWORD_IDENTIFIER_TYPE, RESOURCE } from "@/common/enums/enums";
import {
  ForgotPasswordModeType,
  IForgotPasswordForm,
} from "../../../../types/types";
import { setForgotPasswordMode } from "../../../../api/api";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { FormikProps } from "formik";
import { FC } from "react";

interface Props {
  formik: FormikProps<IForgotPasswordForm>;
}

const ForgotPasswordHeader: FC<Props> = ({ formik }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { forgotPasswordMode, LOADING_FORGOT_PASSWORD } = useAppSelector(
    (state) => state[RESOURCE.AUTH]
  );

  const changeMode = (mode: ForgotPasswordModeType) => {
    if (LOADING_FORGOT_PASSWORD) return;

    formik.setFieldValue("identifier", null);

    formik.setFieldTouched("identifierType", false, false);
    formik.setFieldTouched("identifier", false, false);

    switch (mode) {
      case "phoneNumber":
        formik.setFieldValue(
          "identifierType",
          FORGOT_PASSWORD_IDENTIFIER_TYPE.PHONE_NUMBER
        );
        break;
      default:
        formik.setFieldValue(
          "identifierType",
          FORGOT_PASSWORD_IDENTIFIER_TYPE.EMAIL
        );
        break;
    }

    dispatch(setForgotPasswordMode(mode));
  };

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
