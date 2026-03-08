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
  Clock,
  AlertTriangle,
  LogOutIcon,
  TriangleAlert,
} from "lucide-react";
import "./accountSettings.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader/UniqueHeader";
import SettingCard from "@/components/Card/SettingsCard/SettingCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import {
  DATE_FORMAT,
  LOCAL_STORAGE_KEYS,
  PROVIDER,
  TIME_FORMAT,
  TOKEN_TYPE,
} from "@/common/enums/enums";
import AuthenticateModal from "@/components/Modal/AuthenticateModal/AuthenticateModal";
import UsernameModal from "./components/Modal/UsernameModal/UsernameModal";
import ChangeEmailModal from "./components/Modal/EmailModal/ChangeEmailModal/ChangeEmailModal";
import PasswordModal from "./components/Modal/PasswordModal/PasswordModal";
import { ChangeModalKey } from "../types/types";
import { jwtDecode } from "jwt-decode";
import { snack } from "@/common/utils/snackManager";
import useBoolean from "@/hooks/useBoolean";
import VerifyChangeEmailModal from "./components/Modal/EmailModal/VerifyChangeEmailModal/VerifyChangeEmailModal";
import PhoneNumberModal from "./components/Modal/PhoneNumberModal/PhoneNumberModal";
import {
  DDMMMMYYY,
  formatPhoneNumber,
  showDateWithHour,
} from "@/common/utils/formatValues";
import ActionConfirmModal from "@/components/Modal/ActionConfirmModal/ActionConfirmModal";
import DeleteAccountModal from "./components/Modal/DeleteAccountModal/DeleteAccountModal";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetAccountQuery, useGetMeQuery } from "@/modules/profile/api/api";
import {
  useDeactivateAccountMutation,
  useLogoutMutation,
  useVerifyChangeEmailMutation,
} from "../api/api";
import { useErrors } from "@/hooks/useErrors";
import { useTheme } from "@/context/ThemeContext";
import { useGetGeneralSettingsQuery } from "../../GeneralSettings/api/api";
import { SettingsSkeleton } from "@/common/utils/skeleton";
import { useDispatch } from "react-redux";
import { COUNTRIES } from "@/common/constants/constants";
import Button from "@/components/ui/CustomButton/Button/Button";
import { checkDeviceId } from "@/common/utils/checkValues";

const AccountSettings: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { clear } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { access_token, authenticateToken } = useAuthStore();

  const processedTokenRef = useRef<string | null>(null);
  const { showResponseErrors } = useErrors();
  const { theme } = useTheme();

  const {
    data: user,
    isSuccess: isUserSuccess,
    isError: isUserError,
    isLoading: LOADING_USER,
  } = useGetMeQuery(undefined, {
    skip: !access_token,
  });
  const { data: account, isLoading: LOADING_ACCOUNT } = useGetAccountQuery(
    undefined,
    {
      skip: !access_token || !isUserSuccess || isUserError,
    },
  );
  const { data: generalSettings, isLoading: LOADING_GENERAL_SETTINGS } =
    useGetGeneralSettingsQuery(undefined, {
      skip: !access_token || !isUserSuccess || isUserError,
    });

  const [logout, { isLoading: LOADING_LOGOUT }] = useLogoutMutation();
  const [deactivateAccount, { isLoading: LOADING_DEACTIVATE_ACCOUNT }] =
    useDeactivateAccountMutation();
  const [
    verifyChangeEmail,
    {
      isLoading: LOADING_VERIFY_CHANGE_EMAIL,
      isError: isVerifyChangeEmailFailed,
    },
  ] = useVerifyChangeEmailMutation();

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
          duration: 3000,
        });
        return;
      }

      setAuthModal({ open: true, authType, next });
    },
    [user?.provider, t],
  );

  const closeAuth = () =>
    setAuthModal({ open: false, authType: undefined, next: null });

  const handleAuthenticated = () => {
    const next = authModal.next || null;
    closeAuth();
    setOpenModal(next);
  };

  const closeChangeModal = () => {
    setOpenModal(null);
  };

  const handleLogout = async () => {
    try {
      const deviceId = checkDeviceId();
      await logout({ deviceId }).unwrap();
      clear("all");
      dispatch({ type: "RESET" });
      localStorage.clear();
      localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, theme);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, i18n.language);
      navigate(ROUTER.AUTH.MAIN);
      snack.success(t("user_messages.logout_successfull"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deactivateAccount({
        token: authenticateToken as string,
      }).unwrap();

      localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, theme);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, i18n.language);
      clear("all");
      navigate(ROUTER.AUTH.MAIN);
      snack.success(t("user_messages.account_deactivated"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const renderPhoneNumber = () => {
    const country = COUNTRIES.find(
      (country) => country.code === user?.phoneNumber?.countryCode,
    );

    if (!country) return "";
    const formattedNumber = formatPhoneNumber(
      user?.phoneNumber?.number || "",
      country.format || "",
    );

    return country.code + " " + formattedNumber;
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
              ? renderPhoneNumber()
              : t("common.add_phone_number")}
          </AccountActionButton>
        ),
      },
    ],
    [user, t],
  );

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

        await verifyChangeEmail({ token }).unwrap();
        snack.success(t("user_messages.email_changed_successfully"));
      } finally {
        setSearchParams({});
        processedTokenRef.current = null;
      }
    })();
  }, [searchParams, setSearchParams, navigate, user, t]);

  return (
    <Fragment>
      <section className="account-settings">
        <UniqueHeader
          headerTitle={t("common.account_settings")}
          headerSubtitle={t("common.manage_account_info")}
          onClickBack={onClickBack}
          isHeaderButtonDisabled={false}
        />
        <div className="account-settings-container">
          {LOADING_USER || LOADING_ACCOUNT || LOADING_GENERAL_SETTINGS ? (
            <SettingsSkeleton count={6} />
          ) : (
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
                      {user?.createdAt ? DDMMMMYYY(user.createdAt) : "-"}
                    </p>
                  </div>
                  <div className="account-info-item">
                    <p className="account-info-item-label">
                      {t("common.last_login")}
                    </p>
                    <p className="account-info-item-value">
                      <Clock size={16} className="account-info-item-icon" />
                      {showDateWithHour(
                        account?.lastSeen as Date,
                        generalSettings?.timeZone.dateFormat as DATE_FORMAT,
                        generalSettings?.timeZone.timeFormat as TIME_FORMAT,
                        " - ",
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
                  <Button
                    className="account-danger-button deactivate"
                    onClick={() =>
                      openAuthThen(
                        TOKEN_TYPE.DEACTIVATE_ACCOUNT,
                        "deactivate_account",
                      )
                    }
                  >
                    <span>
                      <LogOutIcon size={18} />
                      {t("common.deactivate_account")}
                    </span>
                    <span className="material-symbols-outlined">
                      chevron_forward
                    </span>
                  </Button>
                  <Button
                    className="account-danger-button delete"
                    onClick={() =>
                      openAuthThen(TOKEN_TYPE.DELETE_ACCOUNT, "delete_account")
                    }
                  >
                    <span>
                      <Trash2 size={18} />
                      {t("common.delete_account")}
                    </span>
                    <span className="material-symbols-outlined">
                      chevron_forward
                    </span>
                  </Button>
                  <Button
                    className="account-danger-button delete"
                    onClick={onLogoutOpen}
                  >
                    <span>
                      <LogOutIcon size={18} />
                      {t("common.logout_account")}
                    </span>
                    <span className="material-symbols-outlined">
                      chevron_forward
                    </span>
                  </Button>
                </div>
              </SettingCard>
            </div>
          )}
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
      {openModal === "email" && (
        <ChangeEmailModal open onClose={closeChangeModal} />
      )}
      {openModal === "password" && (
        <PasswordModal open onClose={closeChangeModal} />
      )}
      {openModal === "phone_number" && (
        <PhoneNumberModal open onClose={closeChangeModal} />
      )}

      {verifiedModalOpen && (
        <VerifyChangeEmailModal
          open
          onClose={onVerifiedModalClose}
          isLoading={LOADING_VERIFY_CHANGE_EMAIL}
          isFailed={isVerifyChangeEmailFailed}
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
  <Button
    className="account-action-button"
    onClick={onClick}
    disabled={disabled}
    type="button"
  >
    <span>{children}</span>
    {right ?? (
      <span className="material-symbols-outlined chevron">chevron_forward</span>
    )}
  </Button>
);

export default AccountSettings;
