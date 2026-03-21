import { Fragment, memo, useEffect, useState, useMemo } from "react";
import {
  MessageCircle,
  Users,
  Radio,
  UserCircle,
  Bell,
  User,
  Settings,
} from "lucide-react";
import "./desktopSidebar.style.css";
import { useLocation } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import { getHomeRouteByStartup } from "@/common/utils/routes";
import { Avatar } from "@mui/material";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useGeneralSettings } from "@/modules/settings/GeneralSettings/hooks/useGeneralSettings";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useContextMenu } from "@/hooks/useContextMenu";
import DesktopSidebarContextMenu from "@/components/ContextMenu/Sidebar/DesktopSidebarContextMenu";

const DesktopSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { navigate, isPending } = useAppNavigation();

  const [activeItem, setActiveItem] = useState<string | null>(null);

  const { user } = useUser();
  const { generalSettings, isLoading: settingsLoading } = useGeneralSettings();

  const { handleContextMenu } = useContextMenu();

  const menuItems = useMemo(
    () => [
      {
        key: "messenger",
        icon: MessageCircle,
        name: t("common.messenger"),
        badge: null,
        path: ROUTER.MESSENGER.MAIN,
        onClick: () => navigate(ROUTER.MESSENGER.MAIN),
      },
      {
        key: "groups",
        icon: Users,
        name: t("common.groups"),
        badge: null,
        path: ROUTER.GROUPS.MAIN,
        onClick: () => navigate(ROUTER.GROUPS.MAIN),
      },
      {
        key: "channels",
        icon: Radio,
        name: t("common.channels"),
        badge: 3,
        path: ROUTER.CHANNELS.MAIN,
        onClick: () => navigate(ROUTER.CHANNELS.MAIN),
      },
      {
        key: "users",
        icon: UserCircle,
        name: t("common.users"),
        badge: null,
        path: ROUTER.USERS.MAIN,
        onClick: () => navigate(ROUTER.USERS.MAIN),
      },
      {
        key: "notifications",
        icon: Bell,
        name: t("common.notifications"),
        badge: 12,
        path: ROUTER.NOTIFICATIONS.MAIN,
        onClick: () => navigate(ROUTER.NOTIFICATIONS.MAIN),
      },
    ],
    [t, navigate],
  );

  useEffect(() => {
    const currentPath = location.pathname || "/";
    const matched = menuItems.find((m) =>
      currentPath === m.path ? true : currentPath.startsWith(m.path),
    );

    if (matched) {
      setActiveItem(matched.key);
    }

    if (
      currentPath === ROUTER.SETTINGS.MAIN ||
      currentPath.startsWith(ROUTER.SETTINGS.MAIN)
    ) {
      setActiveItem("settings");
    }
  }, [location.pathname, menuItems]);

  return (
    <Fragment>
      <section
        id="sidebar"
        style={{
          opacity: isPending ? 0.7 : 1,
          pointerEvents: isPending ? "none" : "auto",
        }}
      >
        <div className="sidebar">
          <div className="logo-section">
            <div
              className="logo-container"
              onClick={() => {
                if (settingsLoading) return;
                const startup = generalSettings?.startupPage;
                navigate(getHomeRouteByStartup(startup));
              }}
            >
              <svg
                viewBox="0 0 576 512"
                aria-hidden="true"
                role="img"
                className="logo-svg"
              >
                <path
                  fill="currentColor"
                  d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"
                />
              </svg>
            </div>
          </div>

          <div className="menu-section">
            {menuItems.map((item) => (
              <div
                key={item.key}
                className={`menu-item ${activeItem === item.key ? "active" : ""}`}
                onClick={item.onClick}
              >
                <div className="icon-wrapper">
                  <item.icon size={24} strokeWidth={2.2} />
                  {item.badge && <div className="badge">{item.badge}</div>}
                </div>
                <div className="tooltip">{item.name}</div>
              </div>
            ))}
          </div>

          <div className="settings-section">
            <div
              className={`menu-item ${activeItem === "settings" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("settings");
                navigate(ROUTER.SETTINGS.MAIN);
              }}
            >
              <div className="icon-wrapper">
                <Settings size={24} strokeWidth={2.2} />
              </div>
              <div className="tooltip">{t("common.settings")}</div>
            </div>
          </div>

          <div className="profile-section">
            <div
              className={`profile-item ${activeItem === "profile" ? "active" : ""}`}
              onClick={() => {
                setActiveItem("profile");
                navigate(ROUTER.PROFILE.MAIN);
              }}
            >
              <div
                className="avatar"
                onContextMenu={(e) =>
                  handleContextMenu(e, <DesktopSidebarContextMenu />)
                }
              >
                {user?.avatar ? (
                  <Avatar
                    src={user?.avatar}
                    sx={{
                      borderRadius: "50%",
                      borderWidth: "2px",
                      borderColor: "var(--primary-color)",
                    }}
                  />
                ) : (
                  <div className="default-avatar">
                    <User size={20} />
                  </div>
                )}
              </div>
              <div className="tooltip">{t("common.my_profile")}</div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default memo(DesktopSidebar);
