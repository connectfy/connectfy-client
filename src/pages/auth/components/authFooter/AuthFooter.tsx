import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

import { useTheme } from "@hooks/useTheme";
import LanguageModal from "@components/Modal/LanguageModal/LanguageModel";
import "./authFooter.style.css";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "@store/store";
import { setAuthForm } from "@features/auth/authSlice";
import { LANGUAGE } from "@/types/enum.types";
import useBoolean from "@/hooks/useBoolean";

const AuthFooter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { theme, toggleTheme } = useTheme();

  const { authForm } = useSelector((state: RootState) => state.auth);

  const langModal = useBoolean();

  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as LANGUAGE)
    : LANGUAGE.EN;

  const renderLangIcon = useCallback(() => {
    switch (lang) {
      case LANGUAGE.AZ:
        return <span className="fi fi-az"></span>;
      case LANGUAGE.TR:
        return <span className="fi fi-tr"></span>;
      case LANGUAGE.RU:
        return <span className="fi fi-ru"></span>;
      default:
        return <span className="fi fi-gb"></span>;
    }
  }, [lang]);

  return (
    <Fragment>
      {authForm === "login" && (
        <p
          className="auth-footer-other-link"
          onClick={() => dispatch(setAuthForm("forgotPassword"))}
        >
          {t("common.forgot_password")}
        </p>
      )}
      {(authForm === "signup" || authForm === "login") && (
        <p className="auth-footer-other-links">
          {authForm === "login"
            ? t("common.do_not_have_account")
            : t("common.already_have_accpount")} {" "}
          <span
            className="auth-footer-other-link"
            onClick={() =>
              dispatch(setAuthForm(authForm === "login" ? "signup" : "login"))
            }
          >
            {authForm === "login" ? t("common.signup") : t("common.login")}
          </span>
        </p>
      )}

      <div className="auth-footer-actions">
        <Tooltip placement="top" title={t("common.change_theme")}>
          <button className="auth-footer-action-btn" onClick={toggleTheme}>
            {theme === "light" ? (
              <DarkMode fontSize="small" />
            ) : (
              <LightMode fontSize="small" />
            )}
          </button>
        </Tooltip>
        <Tooltip placement="top" title={t("common.change_lang")}>
          <button className="auth-footer-action-btn" onClick={langModal.onOpen}>
            {renderLangIcon()}
          </button>
        </Tooltip>
      </div>

      <LanguageModal open={langModal.open} onClose={langModal.onClose} />
    </Fragment>
  );
};

export default AuthFooter;
