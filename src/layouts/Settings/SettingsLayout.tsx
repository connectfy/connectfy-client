import { FC, memo, ReactNode, useEffect, useState } from "react";
import "./settingsLayout.style.css";
import { Outlet, useNavigate, useLocation, matchPath } from "react-router-dom";
import UniqueSidebar from "@/components/Sidebar/UniqueSidebar/UniqueSidebar";
import { useTranslation } from "react-i18next";
import { ROUTER } from "@/common/constants/routet";
import {
  Settings,
  KeyRound,
  Paintbrush,
  UserCog,
  BellRing,
  Keyboard,
} from "lucide-react";

interface Props {
  children?: ReactNode;
}

const SettingsLayout: FC<Props> = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const TITLE = {
    name: t("common.settings"),
    icon: Settings,
  };

  const SUBJECTS = [
    {
      name: t("common.general_settings"),
      path: ROUTER.SETTINGS.GENERAL,
      icon: Settings,
      key: "general",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.GENERAL),
    },
    {
      name: t("common.account_settings"),
      path: ROUTER.SETTINGS.ACCOUNT,
      icon: UserCog,
      key: "account",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.ACCOUNT),
    },
    {
      name: t("common.privacy_settings"),
      path: ROUTER.SETTINGS.PRIVACY,
      icon: KeyRound,
      key: "privacy",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.PRIVACY),
    },
    {
      name: t("common.notification_settings"),
      path: ROUTER.SETTINGS.NOTIFICATION,
      icon: BellRing,
      key: "notification",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.NOTIFICATION),
    },
    {
      name: t("common.change_background"),
      path: ROUTER.SETTINGS.BACKGROUND,
      icon: Paintbrush,
      key: "background",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.BACKGROUND),
    },
    {
      name: t("common.keyboard_shortcuts"),
      path: ROUTER.SETTINGS.SHORTCUT,
      icon: Keyboard,
      key: "keyboard",
      badge: null,
      onClick: () => navigate(ROUTER.SETTINGS.SHORTCUT),
    },
  ];

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < 886 : false
  );

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isIndex = Boolean(
    matchPath({ path: ROUTER.SETTINGS.MAIN, end: true }, location.pathname)
  );

  if (!isMobile) {
    return (
      <section id="settings-layout" className="settings-layout desktop">
        <div className="settings-layout__sidebar">
          <UniqueSidebar title={TITLE} subjects={SUBJECTS} />
        </div>
        <div className="settings-layout__content">{children || <Outlet />}</div>
      </section>
    );
  }

  if (isMobile && isIndex) {
    return (
      <section
        id="settings-layout"
        className="settings-layout mobile sidebar-only"
      >
        <div className="settings-layout__sidebar-mobile">
          <UniqueSidebar title={TITLE} subjects={SUBJECTS} />
        </div>
      </section>
    );
  }

  return (
    <section
      id="settings-layout"
      className="settings-layout mobile content-only"
    >
      <div className="settings-layout__content">{children || <Outlet />}</div>
    </section>
  );
};

export default memo(SettingsLayout);
