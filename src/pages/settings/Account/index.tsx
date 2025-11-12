import { FC } from "react";
import {
  User,
  Mail,
  Key,
  Shield,
  Phone,
  Calendar,
  Trash2,
  LogOut,
  ChevronRight,
  Clock,
  AlertTriangle,
  LogOutIcon,
} from "lucide-react";
import "./index.style.css";
import { useTranslation } from "react-i18next";

const AccountSettings: FC = () => {
  const { t } = useTranslation();

  return (
    <section className="account-settings">
      <div className="account-settings-container">
        <div className="account-settings-header">
          <h1>{t("common.account_settings")}</h1>
          <p>{t("common.manage_account_and_security")}</p>
        </div>

        <div className="account-settings-content">
          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <User size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.username")}</h3>
                <p>{t("common.change_username")}</p>
              </div>
            </div>
            <button className="account-action-button">
              <span>
                <strong>@username</strong>
              </span>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <Mail size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.email_address")}</h3>
                <p>{t("common.update_email_address")}</p>
              </div>
            </div>
            <button className="account-action-button">
              <span>example@email.com</span>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <Key size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.password")}</h3>
                <p>{t("common.change_password")}</p>
              </div>
            </div>
            <button className="account-action-button">
              <span>••••••••</span>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <Shield size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.two_factor_authentication")}</h3>
                <p>{t("common.improve_account_security")}</p>
              </div>
            </div>
            <div className="account-twofa-status disabled">
              <div className="account-twofa-icon">
                <AlertTriangle size={18} />
              </div>
              <div className="account-twofa-text">
                <h4>{t("common.disabled")}</h4>
                <p>{t("common.twofa_not_enabled")}</p>
              </div>
            </div>
            <button className="account-action-button">
              <span>{t("common.enable_2fa")}</span>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <Phone size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.phone_number")}</h3>
                <p>{t("common.add_or_update_phone")}</p>
              </div>
            </div>
            <button className="account-action-button">
              <span>+994 XX XXX XX XX</span>
              <ChevronRight size={18} className="chevron" />
            </button>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div className="account-settings-icon">
                <Calendar size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.account_information")}</h3>
                <p>{t("common.creation_and_last_login")}</p>
              </div>
            </div>
            <div className="account-info-grid">
              <div className="account-info-item">
                <p className="account-info-item-label">
                  {t("common.created_date")}
                </p>
                <p className="account-info-item-value">
                  <Calendar size={16} className="account-info-item-icon" />
                  15 Yanvar 2024
                </p>
              </div>
              <div className="account-info-item">
                <p className="account-info-item-label">
                  {t("common.last_login")}
                </p>
                <p className="account-info-item-value">
                  <Clock size={16} className="account-info-item-icon" />
                  {t("common.two_hours_ago")}
                </p>
              </div>
            </div>
          </div>

          <div className="account-settings-card">
            <div className="account-settings-card-header">
              <div
                className="account-settings-icon"
                style={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                }}
              >
                <AlertTriangle size={20} />
              </div>
              <div className="account-settings-card-title">
                <h3>{t("common.danger_zone")}</h3>
                <p>{t("common.deactivate_or_delete_account")}</p>
              </div>
            </div>
            <div className="account-danger-actions">
              <button className="account-danger-button deactivate">
                <span>
                  <LogOut size={18} />
                  {t("common.deactivate_account")}
                </span>
                <ChevronRight size={18} />
              </button>
              <button className="account-danger-button delete">
                <span>
                  <Trash2 size={18} />
                  {t("common.delete_account")}
                </span>
                <ChevronRight size={18} />
              </button>
              <button className="account-danger-button delete">
                <span>
                  <LogOutIcon size={18} />
                  {t("common.logout")}
                </span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;
