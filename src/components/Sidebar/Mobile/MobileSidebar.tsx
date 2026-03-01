import { memo, useMemo, useState, useEffect } from "react";
import { MessageCircle, Users, Radio, UserCircle, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import { Avatar } from "@mui/material";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import Button from "@/components/ui/CustomButton/Button/Button";

const MobileSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { access_token } = useAuthStore();
  const { data: userData } = useGetMeQuery(undefined, { skip: !access_token });

  const [activeItem, setActiveItem] = useState<string | null>(null);

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
        badge: 12,
      },
      {
        key: "profile",
        icon: User,
        name: t("common.my_profile"),
        path: ROUTER.PROFILE.MAIN,
      },
    ],
    [t],
  );

  useEffect(() => {
    const currentPath = location.pathname || "/";
    const matched = menuItems.find(
      (m) => currentPath === m.path || currentPath.startsWith(m.path),
    );
    if (matched) {
      setActiveItem(matched.key);
    } else if (currentPath.startsWith(ROUTER.SETTINGS.MAIN)) {
      setActiveItem("profile");
    }
  }, [location.pathname, menuItems]);

  return (
    <div className="fixed z-50 w-[92%] h-16 max-w-lg -translate-x-1/2 border border-(--auth-glass-border) rounded-full bottom-5 left-1/2 bg-(--auth-glass-bg) backdrop-blur-md shadow-lg transition-all duration-300">
      <div className="grid h-full grid-cols-5 mx-auto">
        {menuItems.map((item) => {
          const isActive = activeItem === item.key;

          return (
            <Button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`inline-flex flex-col items-center justify-center px-2 group transition-colors duration-200 ${
                item.key === "messenger" ? "rounded-s-full" : ""
              } ${item.key === "profile" ? "rounded-e-full" : ""}`}
            >
              <div className="relative">
                {item.key === "profile" ? (
                  <Avatar
                    src={userData?.avatar ?? undefined}
                    sx={{
                      width: 24,
                      height: 24,
                      border: isActive
                        ? "2px solid var(--primary-color)"
                        : "2px solid var(--text-color)",
                      transition: "0.2s",
                    }}
                    className="group-active:scale-90"
                  />
                ) : (
                  <item.icon
                    size={22}
                    className={`transition-transform duration-200 group-active:scale-90 ${
                      isActive
                        ? "text-(--primary-color) scale-110"
                        : "text-(--muted-color) group-hover:text-(--primary-color)"
                    }`}
                  />
                )}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white border border-(--bg-color)">
                    {item.badge}
                  </span>
                )}
              </div>
              {/* <span
                className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive ? "text-(--primary-color)" : "text-(--muted-color)"
                }`}
              >
                {item.name}
              </span> */}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default memo(MobileSidebar);
