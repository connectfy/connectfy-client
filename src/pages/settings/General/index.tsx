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
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";

const GeneralSettings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

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
        name: t("common.messenger"),
        title: t("common.messenger"),
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

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN)

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  return (
    <Fragment>
      <section className="general-settings">
        <div className="general-settings-container">
          <UniqueHeader
            headerTitle={t("common.general_settings")}
            headerSubtitle={t("common.configure_app_settings")}
            onClickBack={onClickBack}
            onClickSave={() => {}}
            showChangesButton
            isChangesDisasbled={false}
          />

          <div className="general-settings-content">
            <SettingCard
              header={{
                icon: Sun,
                title: t("common.app_theme"),
                subtitle: t("common.choose_light_dark_system"),
              }}
              content={
                <div className="general-theme-options">
                  <div
                    className={`general-theme-option ${isActiveTheme("light") ? "active" : ""}`}
                    onClick={() => changeAppTheme("light")}
                  >
                    <div className="general-theme-option-icon">
                      <Sun size={24} />
                    </div>
                    <span>{t("common.light")}</span>
                  </div>
                  <div
                    className={`general-theme-option ${isActiveTheme("dark") ? "active" : ""}`}
                    onClick={() => changeAppTheme("dark")}
                  >
                    <div className="general-theme-option-icon">
                      <Moon size={24} />
                    </div>
                    <span>{t("common.dark")}</span>
                  </div>
                </div>
              }
            />

            <SettingCard
              header={{
                icon: Globe,
                title: t("common.language"),
                subtitle: t("common.language"),
              }}
              content={
                <CustomSelect
                  buttonTitle={getLabel(languageOptions)}
                  options={languageOptions}
                />
              }
            />

            <SettingCard
              header={{
                icon: Home,
                title: t("common.startup_page"),
                subtitle: t("common.which_page_on_start"),
              }}
              content={
                <CustomSelect
                  buttonTitle={getLabel(homepageOptions)}
                  options={homepageOptions}
                />
              }
            />

            <SettingCard
              header={{
                icon: Clock,
                title: t("common.timezone_and_format"),
                subtitle: t("common.select_time_display_format"),
              }}
              content={
                <Fragment>
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
                    <div className="general-time-format-options">
                      <div className="general-format-option active">
                        {t("common.format_24_hour_example")}
                      </div>
                      <div className="general-format-option">
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
                    <div className="general-time-format-options">
                      <div className="general-format-option active">
                        {t("common.date_dd_mm_yyyy")}
                      </div>
                      <div className="general-format-option">
                        {t("common.date_mm_dd_yyyy")}
                      </div>
                    </div>
                  </div>
                </Fragment>
              }
            />

            <SettingCard
              header={{
                icon: RefreshCw,
                title: t("common.reset_to_defaults"),
                subtitle: t("common.reset_all_general_settings"),
              }}
              content={
                <button className="general-reset-button">
                  <RefreshCw size={18} />
                  {t("common.reset_settings")}
                </button>
              }
            />
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default GeneralSettings;
