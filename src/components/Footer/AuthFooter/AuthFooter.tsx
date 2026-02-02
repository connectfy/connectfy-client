import "./authFooter.style.css";
import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

import { useTheme } from "@/context/ThemeContext";
import LanguageModal from "@/components/Modal/LanguageModal/LanguageModal";
import { LANGUAGE, LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import useBoolean from "@/hooks/useBoolean";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { setAuthForm } from "@/modules/auth/api/api";

const AuthFooter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const { theme, toggleTheme } = useTheme();

  const { authForm } = useAppSelector((state) => state.auth);

  const langModal = useBoolean();

  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG)
    ? (localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) as LANGUAGE)
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
      {location === ROUTER.AUTH.MAIN && authForm === "login" && (
        <p
          className="auth-footer-other-link"
          onClick={() => navigate(ROUTER.AUTH.FORGOT_PASSWORD)}
        >
          {t("common.forgot_password")}
        </p>
      )}
      {location === ROUTER.AUTH.MAIN && (
        <p className="auth-footer-other-links">
          {authForm === "login"
            ? t("common.do_not_have_account")
            : t("common.already_have_account")}{" "}
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
          <button
            className="auth-footer-action-btn"
            onClick={() =>
              toggleTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT)
            }
          >
            {theme === THEME.LIGHT ? (
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
