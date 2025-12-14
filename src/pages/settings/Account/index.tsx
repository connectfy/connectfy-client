import {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  TriangleAlert,
} from "lucide-react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  DATE_FORMAT,
  PROVIDER,
  Resource,
  TIME_FORMAT,
  TOKEN_TYPE,
} from "@/types/enum.types";
import AuthenticateModal from "@/components/Modal/AuthenticateModal";
import UsernameModal from "./components/Modal/UsernameModal";
import EmailModal from "./components/Modal/EmailModal/ChangeEmailModal";
import PasswordModal from "./components/Modal/PasswordModal";
import { ChangeModalKey } from "@/types/account/settings/account/account-settings.type";
import {
  clearError,
  clearMe,
  verifyChangeEmail,
} from "@/features/auth/user/userSlice";
import {
  clearError as clearAuthError,
  deactivateAccount,
} from "@/features/auth/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/utils/snackManager";
import useBoolean from "@/hooks/useBoolean";
import VerifyChangeEmail from "./components/Modal/EmailModal/VerifyChangeEmailModal";
import { useToastError } from "@/hooks/useToastError";
import PhoneNumberModal from "./components/Modal/PhoneNumberModal";
import { DDMMMYYYY, showDateWithHour } from "@/utils/formatDate";
import { logout } from "@/features/auth/auth/authSlice";
import ActionConfirmModal from "@/components/Modal/ActionConfirmModal";
import DeleteAccountModal from "./components/Modal/DeleteAccountModal";

const AccountSettings: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const processedTokenRef = useRef<string | null>(null);

  const { me, LOADING_VERIFY_CHANGE_EMAIL, ERROR_VERIFY_CHANGE_EMAIL } =
    useAppSelector((state) => state[Resource.user]);
  const {
    authToken,
    LOADING_LOGOUT,
    ERROR_LOGOUT,
    LOADING_DEACTIVATE_ACCOUNT,
    ERROR_DEACTIVATE_ACCOUNT,
  } = useAppSelector((state) => state[Resource.auth]);

  const { user } = me ?? {};

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

  const {
    open: logoutModalOpen,
    onClose: onLogoutModalClose,
    onOpen: onLogoutOpen,
  } = useBoolean();

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  const openAuthThen = useCallback(
    (authType: TOKEN_TYPE, next: ChangeModalKey = null) => {
      const sensitiveForPasswordOnly = [
        TOKEN_TYPE.CHANGE_PASSWORD,
        TOKEN_TYPE.CHANGE_EMAIL,
      ];

      if (
        user?.provider !== PROVIDER.PASSWORD &&
        sensitiveForPasswordOnly.includes(authType)
      ) {
        snack.error(t("user_messages.google_login_error"), {
          autoHideDuration: 3000,
          anchorOrigin: { horizontal: "center", vertical: "bottom" },
        });
        return;
      }

      setAuthModal({ open: true, authType, next });
    },
    [user?.provider, t]
  );

  const closeAuth = () =>
    setAuthModal({ open: false, authType: undefined, next: null });

  const handleAuthenticated = () => {
    const next = authModal.next || null;
    closeAuth();
    setOpenModal(next);
  };

  const closeChangeModal = () => setOpenModal(null);

  const handleLogout = async () => {
    const actionResult = await dispatch(logout());
    const res = unwrapResult(actionResult);

    if (res) {
      localStorage.setItem("app-theme", me!.settings.generalSettings.theme);
      localStorage.setItem("lang", me!.settings.generalSettings.language);
      localStorage.removeItem("access_token");
      navigate(ROUTER.AUTH.MAIN);
      snack.success(t("user_messages.logout_successfull"));
      dispatch(clearMe());
    }
  };

  const handleDeactivateAccount = async () => {
    const actionResult = await dispatch(
      deactivateAccount({ token: authToken })
    );
    const res = unwrapResult(actionResult);

    if (res) {
      localStorage.setItem("app-theme", me!.settings.generalSettings.theme);
      localStorage.setItem("lang", me!.settings.generalSettings.language);
      localStorage.removeItem("access_token");
      navigate(ROUTER.AUTH.MAIN);
      snack.success(t("user_messages.account_deactivated"));
      dispatch(clearMe());
    }
  };

  const items = useMemo(
    () => [
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
            <strong>@{user?.username}</strong>
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
          >
            {user?.email}
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
          >
            {"••••••••"}
          </AccountActionButton>
        ),
      },
      {
        id: "phone_number",
        header: {
          icon: Phone,
          title: t("common.phone_number"),
          subtitle: t("common.update_phone"),
        },
        renderContent: () => (
          <AccountActionButton
            onClick={() =>
              openAuthThen(TOKEN_TYPE.CHANGE_PHONE_NUMBER, "phone_number")
            }
          >
            {user?.phoneNumber?.fullPhoneNumber
              ? user.phoneNumber.fullPhoneNumber
              : t("common.add_phone_number")}
          </AccountActionButton>
        ),
      },
    ],
    [user, t]
  );

  useToastError({
    error: ERROR_VERIFY_CHANGE_EMAIL,
    clearErrorAction: () => clearError("verifyChangeEmail"),
  });

  useToastError({
    error: ERROR_LOGOUT,
    clearErrorAction: () => clearError("logout"),
  });

  useToastError({
    error: ERROR_DEACTIVATE_ACCOUNT,
    clearErrorAction: () => clearAuthError("deactivateAccount"),
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
                    {user?.createdAt ? DDMMMYYYY(user.createdAt) : "-"}
                  </p>
                </div>
                <div className="account-info-item">
                  <p className="account-info-item-label">
                    {t("common.last_login")}
                  </p>
                  <p className="account-info-item-value">
                    <Clock size={16} className="account-info-item-icon" />
                    {showDateWithHour(
                      me?.account.lastSeen as Date,
                      me?.settings.generalSettings.timeZone
                        .dateFormat as DATE_FORMAT,
                      me?.settings.generalSettings.timeZone
                        .timeFormat as TIME_FORMAT
                    )}
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
                <button
                  className="account-danger-button deactivate"
                  onClick={() =>
                    openAuthThen(
                      TOKEN_TYPE.DEACTIVATE_ACCOUNT,
                      "deactivate_account"
                    )
                  }
                >
                  <span>
                    <LogOutIcon size={18} />
                    {t("common.deactivate_account")}
                  </span>
                  <ChevronRight size={18} />
                </button>
                <button
                  className="account-danger-button delete"
                  onClick={() =>
                    openAuthThen(TOKEN_TYPE.DELETE_ACCOUNT, "delete_account")
                  }
                >
                  <span>
                    <Trash2 size={18} />
                    {t("common.delete_account")}
                  </span>
                  <ChevronRight size={18} />
                </button>
                <button
                  className="account-danger-button delete"
                  onClick={onLogoutOpen}
                >
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
        <UsernameModal open onClose={closeChangeModal} />
      )}
      {openModal === "email" && <EmailModal open onClose={closeChangeModal} />}
      {openModal === "password" && (
        <PasswordModal open onClose={closeChangeModal} />
      )}
      {openModal === "phone_number" && (
        <PhoneNumberModal open onClose={closeChangeModal} />
      )}

      {verifiedModalOpen && (
        <VerifyChangeEmail
          open
          onClose={onVerifiedModalClose}
          isLoading={LOADING_VERIFY_CHANGE_EMAIL}
        />
      )}

      {openModal === "delete_account" && (
        <DeleteAccountModal open onClose={closeChangeModal} />
      )}

      {openModal === "deactivate_account" && (
        <ActionConfirmModal
          open
          onClose={closeChangeModal}
          onCancel={closeChangeModal}
          onConfirm={handleDeactivateAccount}
          header={{
            title: t("common.deactivate_account"),
          }}
          cancelBtn={{ title: t("common.cancel") }}
          confirmBtn={{
            title: t("common.confirm"),
            color: "var(--error-color)",
          }}
          icon={{
            content: TriangleAlert,
            color: "var(--error-color)",
          }}
          isLoading={LOADING_DEACTIVATE_ACCOUNT}
        >
          {t("common.deactivate_account_desc")}
        </ActionConfirmModal>
      )}

      {logoutModalOpen && (
        <ActionConfirmModal
          open={logoutModalOpen}
          onClose={onLogoutModalClose}
          onCancel={onLogoutModalClose}
          onConfirm={handleLogout}
          header={{
            title: t("common.logout"),
          }}
          cancelBtn={{ title: t("common.cancel") }}
          confirmBtn={{
            title: t("common.logout"),
            color: "var(--error-color)",
          }}
          icon={{
            content: TriangleAlert,
            color: "var(--error-color)",
          }}
          isLoading={LOADING_LOGOUT}
        >
          {t("common.logout_desc")}
        </ActionConfirmModal>
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
