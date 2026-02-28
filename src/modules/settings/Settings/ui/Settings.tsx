import { useTranslation } from "react-i18next";
import {
  Settings as SettingsIcon,
  KeyRound,
  Paintbrush,
  UserCog,
  Bell,
  Keyboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: t("common.general"),
      description: t("common.general_description"),
      icon: <SettingsIcon size={24} />,
      gradient: "from-blue-500 to-blue-600",
      path: ROUTER.SETTINGS.GENERAL,
    },
    {
      title: t("common.account"),
      description: t("common.account_description"),
      icon: <UserCog size={24} />,
      gradient: "from-pink-500 to-pink-600",
      path: ROUTER.SETTINGS.ACCOUNT,
    },
    {
      title: t("common.privacy"),
      description: t("common.privacy_description"),
      icon: <KeyRound size={24} />,
      gradient: "from-violet-500 to-purple-600",
      path: ROUTER.SETTINGS.PRIVACY,
    },
    {
      title: t("common.notifications"),
      description: t("common.notification_description"),
      icon: <Bell size={24} />,
      gradient: "from-sky-400 to-blue-600",
      path: ROUTER.SETTINGS.NOTIFICATION,
    },
    {
      title: t("common.appearance"),
      description: t("common.appearance_description"),
      icon: <Paintbrush size={24} />,
      gradient: "from-amber-400 to-orange-600",
      path: ROUTER.SETTINGS.BACKGROUND,
    },
    {
      title: t("common.keyboard_shortcuts"),
      description: t("common.keyboard_shortcuts_description"),
      icon: <Keyboard size={24} />,
      gradient: "from-indigo-500 to-indigo-700",
      path: ROUTER.SETTINGS.SHORTCUT,
    },
  ];

  return (
    <div className="w-full min-h-screen p-6 transition-colors duration-300 bg-(--bg-color)">
      <div className="max-w-[900px] mx-auto">
        {/* Header / Hero Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center text-white rounded-[24px] bg-(--primary-color) shadow-(--active-shadow)">
            <SettingsIcon size={48} strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 text-(--text-primary)">
            {t("common.settings_title")}
          </h1>
          <p className="max-w-[600px] mx-auto text-lg leading-relaxed text-(--muted-color)">
            {t("common.settings_description")}
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {settingsOptions.map((option, index) => (
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

export default Settings;
