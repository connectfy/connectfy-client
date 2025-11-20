import { FC, Fragment } from "react";
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
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";

const AccountSettings: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { me } = useAppSelector((state) => state[Resource.account]);
  const { user } = me!;

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  return (
    <section className="account-settings">
      <div className="account-settings-container">
        <UniqueHeader
          headerTitle={t("common.account_settings")}
          headerSubtitle={t("common.manage_account_info")}
          onClickBack={onClickBack}
          isChangesDisasbled={false}
        />

        <div className="account-settings-content">
          <SettingCard
            header={{
              icon: User,
              title: t("common.username"),
              subtitle: t("common.change_username"),
            }}
            content={
              <button className="account-action-button">
                <span>
                  <strong>@{user.username}</strong>
                </span>
                <ChevronRight size={18} className="chevron" />
              </button>
            }
          />

          <SettingCard
            header={{
              icon: Mail,
              title: t("common.email_address"),
              subtitle: t("common.update_email"),
            }}
            content={
              <button className="account-action-button">
                <span>{user.email}</span>
                <ChevronRight size={18} className="chevron" />
              </button>
            }
          />

          <SettingCard
            header={{
              icon: Key,
              title: t("common.password"),
              subtitle: t("common.change_password"),
            }}
            content={
              <button className="account-action-button">
                <span>••••••••</span>
                <ChevronRight size={18} className="chevron" />
              </button>
            }
          />

          <SettingCard
            header={{
              icon: Shield,
              title: t("common.two_factor_auth"),
              subtitle: t("common.increase_security"),
            }}
            content={
              <Fragment>
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
              </Fragment>
            }
          />

          <SettingCard
            header={{
              icon: Phone,
              title: t("common.phone_number"),
              subtitle: t("common.update_phone"),
            }}
            content={
              <button className="account-action-button">
                <span>
                  {user.phoneNumber?.fullPhoneNumber
                    ? user.phoneNumber.fullPhoneNumber
                    : t("common.add_phhone_number")}
                </span>
                <ChevronRight size={18} className="chevron" />
              </button>
            }
          />

          <SettingCard
            header={{
              icon: Calendar,
              title: t("common.account_info"),
              subtitle: t("common.account_creation_login"),
            }}
            content={
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
                    <Clock size={16} className="account-info-item-icon" />2{" "}
                    {t("common.hours_ago")}
                  </p>
                </div>
              </div>
            }
          />

          <SettingCard
            header={{
              icon: AlertTriangle,
              title: t("common.danger_zone"),
              subtitle: t("common.deactivate_or_delete"),
              iconStyle: {
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              },
            }}
            content={
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
                    {t("common.logout_account")}
                  </span>
                  <ChevronRight size={18} />
                </button>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default AccountSettings;
