import { useTranslation } from "react-i18next";
import {
  Users as UsersIcon,
  UserPlus,
  UserSearch,
  UserRoundX,
  UserStar,
} from "lucide-react";
import { ROUTER } from "@/common/constants/routet";
import { memo } from "react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const Users = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();

  const usersOptions = [
    {
      title: t("common.find_user"),
      description: t("common.find_user_description"),
      icon: <UserSearch size={24} />,
      gradient: "from-blue-500 to-blue-600",
      path: ROUTER.USERS.SEARCH,
    },
    {
      title: t("common.friends"),
      description: t("common.friends_description"),
      icon: <UsersIcon size={24} />,
      gradient: "from-pink-500 to-pink-600",
      path: ROUTER.USERS.FRIENDS,
    },
    {
      title: t("common.close_friends"),
      description: t("common.close_friends_description"),
      icon: <UserStar size={24} />,
      gradient: "from-pink-500 to-pink-600",
      path: ROUTER.USERS.CLOSE_FRIENDS,
    },
    {
      title: t("common.muted_users"),
      description: t("common.muted_users_description"),
      icon: <UserRoundX size={24} />,
      gradient: "from-sky-400 to-blue-600",
      path: ROUTER.USERS.MUTED,
    },
    {
      title: t("common.friendship_requests"),
      description: t("common.friendship_requests_description"),
      icon: <UserPlus size={24} />,
      gradient: "from-violet-500 to-purple-600",
      path: ROUTER.USERS.REQUESTS,
    },
    {
      title: t("common.blocked_users"),
      description: t("common.blocked_users_description"),
      icon: <UserRoundX size={24} />,
      gradient: "from-sky-400 to-blue-600",
      path: ROUTER.USERS.BLOCKLIST,
    },
  ];

  return (
    <div className="w-full min-h-screen p-6 transition-colors duration-300 bg-(--bg-color)">
      <div className="max-w-[900px] mx-auto">
        {/* Header / Hero Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center text-white rounded-[24px] bg-(--primary-color) shadow-(--active-shadow)">
            <UsersIcon size={48} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 text-(--text-primary)">
            {t("common.users_title")}
          </h1>
          <p className="max-w-[600px] mx-auto text-lg leading-relaxed text-(--muted-color)">
            {t("common.users_description")}
          </p>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {usersOptions.map((option, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => navigate(option.path)}
              className="group flex items-center gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-transparent 
                         bg-(--card-bg) shadow-(--card-shadow) 
                         hover:shadow-xl hover:-translate-y-1 hover:border-(--primary-color)
                         active:scale-[0.98]"
            >
              {/* Icon Container */}
              <div
                className={`w-14 h-14 shrink-0 rounded-xl flex items-center justify-center text-white bg-linear-to-br ${option.gradient} shadow-inner`}
              >
                {option.icon}
              </div>

              {/* Text Info */}
              <div className="text-left">
                <h3 className="text-lg font-bold mb-1 transition-colors text-(--text-primary) group-hover:text-(--primary-color)">
                  {option.title}
                </h3>
                <p className="text-sm leading-snug text-(--muted-color)">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Users);
