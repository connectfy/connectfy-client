import { Fragment, memo, useEffect, useMemo, useState } from "react";
import { MessageCircle, Users, Radio, UserCircle, User } from "lucide-react";
import "./index.style.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/useStore";
import { Resource } from "@/types/enum.types";
import { Avatar } from "@mui/material";

const MobileSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const { me: userData } = useAppSelector((state) => state[Resource.user]);

  const [activeItem, setActiveItem] = useState<string | null>(null);

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
        badge: 12,
        path: ROUTER.USERS.MAIN,
        onClick: () => navigate(ROUTER.USERS.MAIN),
      },
      {
        key: "profile",
        icon: User,
        name: t("common.my_profile"),
        badge: null,
        path: ROUTER.PROFILE.MAIN,
        onClick: () => navigate(ROUTER.PROFILE.MAIN),
      },
      // {
      //   key: "settings",
      //   icon: Settings,
      //   name: "Settings",
      //   badge: null,
      //   path: ROUTER.SETTINGS.MAIN, // ROUTER.SETTINGS.MAIN əlavə etməyi unutma
      //   onClick: () => navigate(ROUTER.SETTINGS.MAIN),
      // },
    ],
    [t, navigate]
  );

  useEffect(() => {
    const currentPath = location.pathname || "/";

    const matched = menuItems.find((m) =>
      currentPath === m.path ? true : currentPath.startsWith(m.path)
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
      <nav className="mobile-sidebar">
        <div className="mobile-nav-container">
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`mobile-nav-item ${activeItem === item.key ? "active" : ""}`}
              onClick={() => {
                setActiveItem(item.key);
                item.onClick();
              }}
            >
              <div className="mobile-icon-wrapper">
                {item.key === "profile" ? (
                  !userData?.account.avatar ? (
                    <Avatar
                      // src={userData?.account.avatar}
                      sx={{
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  ) : (
                    <div className="default-avatar">
                      <User size={20} />
                    </div>
                  )
                ) : (
                  <item.icon
                    size={22}
                    strokeWidth={2.5}
                    className="mobile-nav-icon"
                  />
                )}
                {item.badge && (
                  <div className="mobile-badge">
                    {item.badge > 99 ? "99+" : item.badge}
                  </div>
                )}
              </div>
              <span className="mobile-nav-label">{item.name}</span>
            </div>
          ))}
        </div>
      </nav>
    </Fragment>
  );
};

export default memo(MobileSidebar);
