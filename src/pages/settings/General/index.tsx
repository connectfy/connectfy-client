import {
  Sun,
  Moon,
  Globe,
  Home,
  Clock,
  Bell,
  RefreshCw,
  MessageCircle,
  Users,
  Radio,
  UserCircle,
  User,
} from "lucide-react";
import "./index.style.css";
import { Fragment, useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "@/types/enum.types";

const GeneralSettings = () => {
  const { t, i18n } = useTranslation();

  const { theme, toggleTheme } = useTheme();

  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [homepageKey, setHomepageKey] = useState("messenger");
  const [timezoneKey, setTimezoneKey] = useState("UTC+4");

  const isActiveTheme = (theme: string) => selectedTheme === theme;

  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as LANGUAGE)
    : LANGUAGE.EN;

  const handleLanguageChange = (code: LANGUAGE) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  const changeAppTheme = (appTheme: "dark" | "light") => {
    if (theme === appTheme) return;
    toggleTheme();
  };

  const languageOptions = {
    title: t("common.language_selection"),
    activeKey: lang as string,
    selections: [
      {
        key: "az",
        name: "Azərbaycan",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.AZ),
      },
      {
        key: "en",
        name: "English",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.EN),
      },
      {
        key: "ru",
        name: "Русский",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.RU),
      },
      {
        key: "tr",
        name: "Türkçe",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.TR),
      },
    ],
  };

  const homepageOptions = {
    title: t("common.homepage"),
    activeKey: homepageKey,
    selections: [
      {
        key: "messenger",
        name: t("common.messages"),
        title: t("common.messages"),
        icon: MessageCircle,
        onClick: () => setHomepageKey("messenger"),
      },
      {
        key: "groups",
        name: t("common.groups"),
        title: t("common.groups"),
        icon: Users,
        onClick: () => setHomepageKey("groups"),
      },
      {
        key: "channels",
        name: t("common.channels"),
        title: t("common.channels"),
        icon: Radio,
        onClick: () => setHomepageKey("channels"),
      },
      {
        key: "users",
        name: t("common.users"),
        title: t("common.users"),
        icon: UserCircle,
        onClick: () => setHomepageKey("users"),
      },
      {
        key: "notifications",
        name: t("common.notifications"),
        title: t("common.notifications"),
        icon: Bell,
        onClick: () => setHomepageKey("notifications"),
      },
      {
        key: "my_profile",
        name: t("common.my_profile"),
        title: t("common.my_profile"),
        icon: User,
        onClick: () => setHomepageKey("my_profile"),
      },
    ],
  };

  const timezoneOptions = {
    title: t("common.timezone"),
    activeKey: timezoneKey,
    selections: [
      {
        key: "UTC+4",
        name: t("common.utc_plus_4_baku"),
        title: t("common.baku"),
        icon: Clock,
        onClick: () => setTimezoneKey("UTC+4"),
      },
      {
        key: "UTC+3",
        name: t("common.utc_plus_3_istanbul"),
        title: t("common.istanbul"),
        icon: Clock,
        onClick: () => setTimezoneKey("UTC+3"),
      },
      {
        key: "UTC+0",
        name: t("common.utc_plus_0_london"),
        title: t("common.london"),
        icon: Clock,
        onClick: () => setTimezoneKey("UTC+0"),
      },
      {
        key: "UTC+5",
        name: t("common.utc_plus_5_tashkent"),
        title: t("common.tashkent"),
        icon: Clock,
        onClick: () => setTimezoneKey("UTC+5"),
      },
    ],
  };

  const getLabel = (options: typeof languageOptions) =>
    options.selections.find((s) => s.key === options.activeKey)?.name ||
    options.title;

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  return (
    <Fragment>
      <section className="general-settings">
        <div className="general-settings-container">
          <div className="settings-header">
            <h1>{t("common.general_settings")}</h1>
            <p>{t("common.configure_app_settings")}</p>
          </div>

          <div className="settings-content">
            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Sun size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.app_theme")}</h3>
                  <p>{t("common.choose_light_dark_system")}</p>
                </div>
              </div>
              <div className="theme-options">
                <div
                  className={`theme-option ${isActiveTheme("light") ? "active" : ""}`}
                  onClick={() => changeAppTheme("light")}
                >
                  <div className="theme-option-icon">
                    <Sun size={24} />
                  </div>
                  <span>{t("common.light")}</span>
                </div>
                <div
                  className={`theme-option ${isActiveTheme("dark") ? "active" : ""}`}
                  onClick={() => changeAppTheme("dark")}
                >
                  <div className="theme-option-icon">
                    <Moon size={24} />
                  </div>
                  <span>{t("common.dark")}</span>
                </div>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Globe size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.language")}</h3>
                  <p>{t("common.select_app_language")}</p>
                </div>
              </div>

              <CustomSelect
                buttonTitle={getLabel(languageOptions)}
                options={languageOptions}
              />
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Home size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.startup_page")}</h3>
                  <p>{t("common.which_page_on_start")}</p>
                </div>
              </div>

              <CustomSelect
                buttonTitle={getLabel(homepageOptions)}
                options={homepageOptions}
              />
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Clock size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.timezone_and_format")}</h3>
                  <p>{t("common.select_time_display_format")}</p>
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <CustomSelect
                  buttonTitle={getLabel(timezoneOptions)}
                  options={timezoneOptions}
                />
              </div>

              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#64748b",
                    margin: "0 0 8px 0",
                  }}
                >
                  {t("common.time_format")}
                </p>
                <div className="time-format-options">
                  <div className="format-option active">
                    {t("common.format_24_hour_example")}
                  </div>
                  <div className="format-option">
                    {t("common.format_12_hour_example")}
                  </div>
                </div>
              </div>

              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#64748b",
                    margin: "0 0 8px 0",
                  }}
                >
                  {t("common.date_format")}
                </p>
                <div className="time-format-options">
                  <div className="format-option active">
                    {t("common.date_dd_mm_yyyy")}
                  </div>
                  <div className="format-option">
                    {t("common.date_mm_dd_yyyy")}
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <Bell size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.notification_mode")}</h3>
                  <p>{t("common.select_default_notification")}</p>
                </div>
              </div>
              <div className="notification-modes">
                <div className="notification-mode active">
                  <div className="mode-radio"></div>
                  <div className="mode-content">
                    <h4>{t("common.sound_notifications")}</h4>
                    <p>{t("common.all_notifications_with_sound")}</p>
                  </div>
                </div>
                <div className="notification-mode">
                  <div className="mode-radio"></div>
                  <div className="mode-content">
                    <h4>{t("common.silent_mode")}</h4>
                    <p>{t("common.only_visual_no_sound")}</p>
                  </div>
                </div>
                <div className="notification-mode">
                  <div className="mode-radio"></div>
                  <div className="mode-content">
                    <h4>{t("common.do_not_disturb")}</h4>
                    <p>{t("common.no_notifications")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-card-header">
                <div className="setting-icon">
                  <RefreshCw size={20} />
                </div>
                <div className="setting-card-title">
                  <h3>{t("common.reset_to_defaults")}</h3>
                  <p>{t("common.reset_all_general_settings")}</p>
                </div>
              </div>
              <button className="reset-button">
                <RefreshCw size={18} />
                {t("common.reset_settings")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default GeneralSettings;
