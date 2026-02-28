import { useTranslation } from "react-i18next";
import "./settings.style.css";
import {
  Settings as SettingsIcon,
  KeyRound,
  Paintbrush,
  UserCog,
  Bell,
  Keyboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="settings-main-container">
      <div className="settings-main-content">
        {/* Header Section */}
        <div className="settings-hero">
          <div className="settings-hero-icon">
            <SettingsIcon size={48} strokeWidth={2} />
          </div>
          <h1 className="settings-hero-title">{t("common.settings_title")}</h1>
          <p className="settings-hero-description">
            {t("common.settings_description")}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="settings-stats-grid">
          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.GENERAL)}
          >
            <div className="stat-icon general">
              <SettingsIcon size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.general")}</h3>
              <p>{t("common.general_description")}</p>
            </div>
          </div>

          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.ACCOUNT)}
          >
            <div className="stat-icon account">
              <UserCog size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.account")}</h3>
              <p>{t("common.account_description")}</p>
            </div>
          </div>

          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.PRIVACY)}
          >
            <div className="stat-icon privacy">
              <KeyRound size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.privacy")}</h3>
              <p>{t("common.privacy_description")}</p>
            </div>
          </div>

          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.NOTIFICATION)}
          >
            <div className="stat-icon notification">
              <Bell size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.notifications")}</h3>
              <p>{t("common.notifications_description")}</p>
            </div>
          </div>

          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.BACKGROUND)}
          >
            <div className="stat-icon theme">
              <Paintbrush size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.appearance")}</h3>
              <p>{t("common.appearance_description")}</p>
            </div>
          </div>

          <div
            className="stat-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(ROUTER.SETTINGS.SHORTCUT)}
          >
            <div className="stat-icon shortcut">
              <Keyboard size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.keyboard_shortcuts")}</h3>
              <p>{t("common.keyboard_shortcuts_description")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
