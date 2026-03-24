import { Fragment, memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Radio,
  UserCircle,
  Bell,
  Settings,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import { getHomeRouteByStartup } from "@/common/utils/routes";
import { useGeneralSettings } from "@/modules/settings/GeneralSettings/hooks/useGeneralSettings";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useContextMenu } from "@/hooks/useContextMenu";
import DesktopSidebarContextMenu from "@/components/ContextMenu/Sidebar/DesktopSidebarContextMenu";
import NoProfilePhotoIcon from "@/assets/icons/NoProfilePhotoIcon";
import { useUser } from "@/context/UserContext";

const NavItem = ({
  isActive,
  onClick,
  icon: Icon,
  name,
  badge,
  isProfile = false,
  avatarUrl = null,
  onContextMenu = null,
}: any) => (
  <div
    className={`relative group w-full h-[56px] flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-300
      ${
        isActive
          ? "bg-linear-to-br from-[rgba(46,204,113,0.15)] to-[rgba(46,204,113,0.08)] text-(--third-color) shadow-[0_4px_16px_rgba(46,204,113,0.2)]"
          : "text-[#64748b] dark:text-[#94a3b8] hover:bg-[rgba(46,204,113,0.08)] dark:hover:bg-[rgba(46,204,113,0.12)] hover:-translate-y-0.5"
      }`}
    onClick={onClick}
    onContextMenu={onContextMenu}
  >
    {isActive && (
      <motion.div
        layoutId="sidebar-active-pill"
        className="absolute -left-3 w-1.5 h-9 bg-linear-to-b from-(--third-color) to-[#27ae60] rounded-r-full z-10"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}

    <div className="relative flex items-center justify-center">
      {isProfile ? (
        <div
          className={`relative size-10 rounded-full overflow-hidden border-2 ${isActive ? "border-(--primary-color)" : "border-[#64748b] dark:border-[#94a3b8]"}`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              className="object-cover w-full h-full bg-(--skeleton-card-bg)"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <NoProfilePhotoIcon />
            </div>
          )}
        </div>
      ) : (
        <Icon size={24} strokeWidth={2.2} />
      )}

      {badge && (
        <div className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </div>
      )}
    </div>

    <div className="absolute left-[85px] invisible group-hover:visible group-hover:left-[75px] opacity-0 group-hover:opacity-100 bg-[#1e293b] dark:bg-[#f8fafc] text-white dark:text-[#1e293b] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 shadow-2xl z-99999">
      {name}
      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-[#1e293b] dark:border-r-[#f8fafc]" />
    </div>
  </div>
);

const DesktopSidebar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { navigate, isPending } = useAppNavigation();
  const { generalSettings } = useGeneralSettings();
  const { handleContextMenu } = useContextMenu();
  const { user } = useUser();

  const menuItems = useMemo(
    () => [
      {
        key: "messenger",
        icon: MessageCircle,
        name: t("common.messenger"),
        path: ROUTER.MESSENGER.MAIN,
      },
      {
        key: "groups",
        icon: Users,
        name: t("common.groups"),
        path: ROUTER.GROUPS.MAIN,
      },
      {
        key: "channels",
        icon: Radio,
        name: t("common.channels"),
        path: ROUTER.CHANNELS.MAIN,
        badge: 3,
      },
      {
        key: "users",
        icon: UserCircle,
        name: t("common.users"),
        path: ROUTER.USERS.MAIN,
      },
      {
        key: "notifications",
        icon: Bell,
        name: t("common.notifications"),
        path: ROUTER.NOTIFICATIONS.MAIN,
        badge: 12,
      },
    ],
    [t],
  );

  const getActiveKey = () => {
    if (pathname.startsWith(ROUTER.SETTINGS.MAIN)) return "settings";
    if (pathname.startsWith(ROUTER.PROFILE.MAIN)) return "profile";
    const matched = menuItems.find(
      (m) => pathname === m.path || pathname.startsWith(m.path),
    );
    return matched ? matched.key : null;
  };

  const activeItem = getActiveKey();

  return (
    <Fragment>
      <section
        id="sidebar"
        className="relative z-50 transition-opacity duration-300"
        style={{ opacity: isPending ? 0.7 : 1 }}
      >
        <div className="w-[85px] h-screen backdrop-blur-[20px] border-r border-black/5 dark:border-white/10 flex flex-col items-center py-5 shadow-lg bg-white/95 dark:bg-[#0a0f0d]/95">
          {/* Logo */}
          <div
            className="mb-9 cursor-pointer transition-transform hover:scale-110 hover:rotate-[5deg]"
            onClick={() =>
              navigate(getHomeRouteByStartup(generalSettings?.startupPage))
            }
          >
            <div className="relative w-12 h-12 bg-linear-to-br from-(--third-color) to-[#27ae60] rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(46,204,113,0.4)] overflow-hidden">
              {/* ✨ Parıltı animasiyası */}
              <div
                className="absolute pointer-events-none animate-logo-shine"
                style={{
                  top: "-50%",
                  left: "-50%",
                  width: "200%",
                  height: "200%",
                  background:
                    "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                }}
              />
              <svg
                viewBox="0 0 576 512"
                className="w-[28px] h-[28px] text-white fill-current relative z-10"
              >
                <path d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z" />
              </svg>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 flex flex-col gap-2 w-2/3 relative">
            {menuItems.map((item) => (
              <NavItem
                {...item}
                key={item.key}
                isActive={activeItem === item.key}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

          {/* Settings & Profile */}
          <div className="w-2/3 flex flex-col gap-2 mb-2 pt-3 border-t border-black/5 dark:border-white/10">
            <NavItem
              isActive={activeItem === "settings"}
              onClick={() => navigate(ROUTER.SETTINGS.MAIN)}
              icon={Settings}
              name={t("common.settings")}
            />

            <div className="mt-1">
              <NavItem
                isActive={activeItem === "profile"}
                onClick={() => navigate(ROUTER.PROFILE.MAIN)}
                isProfile
                avatarUrl={user?.avatar?.url}
                name={t("common.my_profile")}
                onContextMenu={(e: any) =>
                  handleContextMenu(e, <DesktopSidebarContextMenu />)
                }
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default memo(DesktopSidebar);
