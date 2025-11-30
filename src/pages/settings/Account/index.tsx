import { FC, Fragment } from "react";
import {
  User,
  Mail,
  Key,
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
import { PROVIDER, Resource, TOKEN_TYPE } from "@/types/enum.types";
import useBoolean from "@/hooks/useBoolean";
import AuthenticateModal from "@/components/Modal/AuthenticateModal";
import UsernameModal from "./components/Modal/UsernameModal";
import EmailModal from "./components/Modal/EmailModal";
import PasswordModal from "./components/Modal/PasswordModal";

const AccountSettings: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { me } = useAppSelector((state) => state[Resource.user]);
  const { user } = me!;

  const {
    open: usernameModalOpen,
    onOpen: onUsernameModalOpen,
    onClose: OnUsernameModalClose,
  } = useBoolean();

  const {
    open: emailModalOpen,
    onOpen: onEmailModalOpen,
    onClose: onEmailModalClose,
  } = useBoolean();

  const {
    open: passwordModalOpen,
    onOpen: onPasswordModalOpen,
    onClose: onPasswordModalClose,
  } = useBoolean();

  const {
    open: changeUsernameModalOpen,
    onOpen: onChangeUsernameModalOpen,
    onClose: onChangeUsernameModalClose,
  } = useBoolean();

  const {
    open: changeEmailModalOpen,
    onOpen: onChangeEmailModalOpen,
    onClose: onChangeEmailModalClose,
  } = useBoolean();

  const {
    open: changePasswordModalOpen,
    onOpen: onChangePasswordModalOpen,
    onClose: onChangePasswordModalClose,
  } = useBoolean();

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  return (
    <Fragment>
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
                <button
                  className="account-action-button"
                  onClick={onUsernameModalOpen}
                >
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
                <button
                  className="account-action-button"
                  onClick={onEmailModalOpen}
                  disabled={user.provider !== PROVIDER.PASSWORD}
                >
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
                <button
                  className="account-action-button"
                  onClick={onPasswordModalOpen}
                  disabled={user.provider !== PROVIDER.PASSWORD}
                >
                  <span>••••••••</span>
                  <ChevronRight size={18} className="chevron" />
                </button>
              }
            />

            {/* <SettingCard
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
            /> */}

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
                      : t("common.add_phone_number")}
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
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
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
      {usernameModalOpen && (
        <AuthenticateModal
          open={usernameModalOpen}
          onClose={OnUsernameModalClose}
          onAuthenticate={onChangeUsernameModalOpen}
          authType={TOKEN_TYPE.CHANGE_USERNAME}
        />
      )}

      {emailModalOpen && (
        <AuthenticateModal
          open={emailModalOpen}
          onClose={onEmailModalClose}
          onAuthenticate={onChangeEmailModalOpen}
          authType={TOKEN_TYPE.CHANGE_EMAIL}
        />
      )}

      {passwordModalOpen && (
        <AuthenticateModal
          open={passwordModalOpen}
          onClose={onPasswordModalClose}
          onAuthenticate={onChangePasswordModalOpen}
          authType={TOKEN_TYPE.CHANGE_PASSWORD}
        />
      )}

      {changeUsernameModalOpen && (
        <UsernameModal
          open={changeUsernameModalOpen}
          onClose={onChangeUsernameModalClose}
        />
      )}

      {changeEmailModalOpen && (
        <EmailModal
          open={changeEmailModalOpen}
          onClose={onChangeEmailModalClose}
        />
      )}

      {changePasswordModalOpen && (
        <PasswordModal
          open={changePasswordModalOpen}
          onClose={onChangePasswordModalClose}
        />
      )}
    </Fragment>
  );
};

export default AccountSettings;
