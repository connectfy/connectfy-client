import { useTranslation } from "react-i18next";
import "./index.style.css";
import {
  Settings as SettingsIcon,
  Zap,
  KeyRound,
  Shield,
  Paintbrush,
  UserCog,
} from "lucide-react";

const Settings = () => {
  const { t } = useTranslation();

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
          <div className="stat-card" role="button" tabIndex={0}>
            <div className="stat-icon general">
              <SettingsIcon size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.general")}</h3>
              <p>{t("common.general_description")}</p>
            </div>
          </div>

          <div className="stat-card" role="button" tabIndex={0}>
            <div className="stat-icon privacy">
              <KeyRound size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.privacy")}</h3>
              <p>{t("common.privacy_description")}</p>
            </div>
          </div>

          <div className="stat-card" role="button" tabIndex={0}>
            <div className="stat-icon theme">
              <Paintbrush size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.appearance")}</h3>
              <p>{t("common.appearance_description")}</p>
            </div>
          </div>

          <div className="stat-card" role="button" tabIndex={0}>
            <div className="stat-icon account">
              <UserCog size={24} />
            </div>
            <div className="stat-info">
              <h3>{t("common.account")}</h3>
              <p>{t("common.account_description")}</p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="settings-info-section">
          <div className="info-card primary">
            <div className="info-card-header">
              <div className="info-card-icon">
                <Zap size={20} />
              </div>
              <h3>{t("common.quick_start")}</h3>
            </div>
            <p>{t("common.quick_start_description")}</p>
          </div>

          <div className="info-card secondary">
            <div className="info-card-header">
              <div className="info-card-icon">
                <Shield size={20} />
              </div>
              <h3>{t("common.security_tip")}</h3>
            </div>
            <p>{t("common.security_tip_description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
