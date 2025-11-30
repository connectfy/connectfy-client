import "./index.style.css";
import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";

import { useTheme } from "@/context/ThemeContext";
import LanguageModal from "@/components/Modal/LanguageModal";
import { setAuthForm } from "@/features/auth/auth/authSlice";
import { LANGUAGE } from "@/types/enum.types";
import useBoolean from "@/hooks/useBoolean";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";

const AuthFooter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const { theme, toggleTheme } = useTheme();

  const { authForm } = useAppSelector((state) => state.auth);

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
