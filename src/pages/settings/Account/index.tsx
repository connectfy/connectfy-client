import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Key,
  Phone,
  Calendar,
  Trash2,
  ChevronRight,
  Clock,
  AlertTriangle,
  LogOutIcon,
} from "lucide-react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { PROVIDER, Resource, TOKEN_TYPE } from "@/types/enum.types";
import AuthenticateModal from "@/components/Modal/AuthenticateModal";
import UsernameModal from "./components/Modal/UsernameModal";
import EmailModal from "./components/Modal/EmailModal/ChangeEmailModal";
import PasswordModal from "./components/Modal/PasswordModal";
import { ChangeModalKey } from "@/types/account/settings/account/account-settings.type";
import { clearError, verifyChangeEmail } from "@/features/auth/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/utils/snackManager";
import useBoolean from "@/hooks/useBoolean";
import VerifyChangeEmail from "./components/Modal/EmailModal/VerifyChangeEmailModal";
import { useToastError } from "@/hooks/useToastError";

const AccountSettings: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const processedTokenRef = useRef<string | null>(null);

  const { me, LOADING_VERIFY_CHANGE_EMAIL, ERROR_VERIFY_CHANGE_EMAIL } =
    useAppSelector((state) => state[Resource.user]);
  const { user } = me!;

  const [authModal, setAuthModal] = useState<{
    open: boolean;
    authType?: TOKEN_TYPE;
    next?: ChangeModalKey;
  }>({ open: false, authType: undefined, next: null });

  const [openModal, setOpenModal] = useState<ChangeModalKey>(null);

  const {
    open: verifiedModalOpen,
    onClose: onVerifiedModalClose,
    onOpen: onVerifiedOpen,
  } = useBoolean();

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  const openAuthThen = (authType: TOKEN_TYPE, next: ChangeModalKey = null) => {
    setAuthModal({ open: true, authType, next });
  };

  const closeAuth = () =>
    setAuthModal({ open: false, authType: undefined, next: null });

  const handleAuthenticated = () => {
    const next = authModal.next || null;
    closeAuth();
    setOpenModal(next);
  };

  const closeChangeModal = () => setOpenModal(null);

  const items = [
    {
      id: "username",
      header: {
        icon: User,
        title: t("common.username"),
        subtitle: t("common.change_username"),
      },
      renderContent: () => (
        <AccountActionButton
          onClick={() => openAuthThen(TOKEN_TYPE.CHANGE_USERNAME, "username")}
        >
          <strong>@{user.username}</strong>
        </AccountActionButton>
      ),
    },
    {
      id: "email",
      header: {
        icon: Mail,
        title: t("common.email_address"),
        subtitle: t("common.update_email"),
      },
      renderContent: () => (
        <AccountActionButton
          onClick={() => openAuthThen(TOKEN_TYPE.CHANGE_EMAIL, "email")}
          disabled={user.provider !== PROVIDER.PASSWORD}
        >
          {user.email}
        </AccountActionButton>
      ),
    },
    {
      id: "password",
      header: {
        icon: Key,
        title: t("common.password"),
        subtitle: t("common.change_password"),
      },
      renderContent: () => (
        <AccountActionButton
          onClick={() => openAuthThen(TOKEN_TYPE.CHANGE_PASSWORD, "password")}
          disabled={user.provider !== PROVIDER.PASSWORD}
        >
          {"••••••••"}
        </AccountActionButton>
      ),
    },
  ];

  useToastError({
    error: ERROR_VERIFY_CHANGE_EMAIL,
    clearErrorAction: () => clearError("verifyChangeEmail"),
  });

  useEffect(() => {
    const action = searchParams.get("action");
    const token = searchParams.get("token");

    if (!action || !token || action !== TOKEN_TYPE.CHANGE_EMAIL || !user)
      return;

    if (processedTokenRef.current === token) {
      return;
    }
    processedTokenRef.current = token;

    let decoded: Record<string, any> | null = null;
    try {
      decoded = jwtDecode<Record<string, any>>(token);
    } catch (err) {
      setSearchParams({});
      processedTokenRef.current = null;
      return;
    }

    if (!decoded || !decoded.userId || decoded.userId !== String(user._id)) {
      navigate(ROUTER.SETTINGS.ACCOUNT, { replace: true });
      setSearchParams({});
      processedTokenRef.current = null;
      return;
    }

    (async () => {
      try {
        onVerifiedOpen();

        const actionResult = await dispatch(verifyChangeEmail({ token }));
        const res = unwrapResult(actionResult);
        if (res) {
          snack.success(t("user_messages.email_changed_successfully"));
        }
      } finally {
        setSearchParams({});
        processedTokenRef.current = null;
      }
    })();
  }, [searchParams, setSearchParams, navigate, dispatch, user, t]);

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
            {items.map((it) => (
              <SettingCard key={it.id} header={it.header}>
                {it.renderContent()}
              </SettingCard>
            ))}

            <SettingCard
              header={{
                icon: Phone,
                title: t("common.phone_number"),
                subtitle: t("common.update_phone"),
              }}
            >
              <AccountActionButton>
                {user.phoneNumber?.fullPhoneNumber
                  ? user.phoneNumber.fullPhoneNumber
                  : t("common.add_phone_number")}
              </AccountActionButton>
            </SettingCard>

            <SettingCard
              header={{
                icon: Calendar,
                title: t("common.account_info"),
                subtitle: t("common.account_creation_login"),
              }}
            >
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
            </SettingCard>

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
            >
              <div className="account-danger-actions">
                <button className="account-danger-button deactivate">
                  <span>
                    <LogOutIcon size={18} />
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
            </SettingCard>
          </div>
        </div>
      </section>

      {authModal.open && (
        <AuthenticateModal
          open={authModal.open}
          onClose={closeAuth}
          onAuthenticate={handleAuthenticated}
          authType={authModal.authType as TOKEN_TYPE}
        />
      )}

      {openModal === "username" && (
        <UsernameModal open={true} onClose={closeChangeModal} />
      )}
      {openModal === "email" && (
        <EmailModal open={true} onClose={closeChangeModal} />
      )}
      {openModal === "password" && (
        <PasswordModal open={true} onClose={closeChangeModal} />
      )}

      {verifiedModalOpen && (
        <VerifyChangeEmail
          open={true}
          onClose={onVerifiedModalClose}
          isLoading={LOADING_VERIFY_CHANGE_EMAIL}
        />
      )}
    </Fragment>
  );
};

const AccountActionButton: FC<{
  onClick?: () => void;
  disabled?: boolean;
  right?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ onClick, disabled, right, children }) => (
  <button
    className="account-action-button"
    onClick={onClick}
    disabled={disabled}
  >
    <span>{children}</span>
    {right ?? <ChevronRight size={18} className="chevron" />}
  </button>
);

export default AccountSettings;
