import { Sun, Moon, Globe, Home, Clock, RefreshCw } from "lucide-react";
import "./index.style.css";
import { Fragment, useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import {
  homepageOptions,
  initialState,
  languageOptions,
  validateGenerateSettings,
} from "./constants/contant";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { DATE_FORMAT, Resource, TIME_FORMAT } from "@/types/enum.types";
import { snack } from "@/utils/snackManager";
import { updateGeneralSettings } from "@/features/account/settings/general/generalSettingsSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const GeneralSettings = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();

  const { data } = useAppSelector((state) => state[Resource.generalSettings]);

  const [selectedTheme, setSelectedTheme] = useState(theme);

  const formik = useFormik({
    initialValues: initialState(data!),
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateGenerateSettings(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const actionResult = await dispatch(updateGeneralSettings(values));
        const res = unwrapResult(actionResult);
        if (res) {
          snack.success(t("user_messages.successfully_updated"));
          resetForm();
        }
      } catch (err) {
        snack.error((err as Error).message);
      }
    },
  });

  const isActiveTheme = (theme: string) => selectedTheme === theme;
  const LANGUAGE_OPTIONS = languageOptions(t, formik);
  const HOMEPAGE_OPTIONS = homepageOptions(t, formik);

  const changeAppTheme = (appTheme: "dark" | "light") => {
    if (theme === appTheme) return;
    formik.setFieldValue("theme", appTheme);
    toggleTheme();
  };

  const getLabel = (
    options: typeof LANGUAGE_OPTIONS | typeof HOMEPAGE_OPTIONS
  ) =>
    options.selections.find((s) => s.key === options.activeKey)?.name ||
    options.title;

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

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
            onClickSave={formik.handleSubmit}
            showChangesButton
            isChangesDisasbled={!formik.dirty}
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
                  buttonTitle={getLabel(LANGUAGE_OPTIONS)}
                  options={LANGUAGE_OPTIONS}
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
                  buttonTitle={getLabel(HOMEPAGE_OPTIONS)}
                  options={HOMEPAGE_OPTIONS}
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
                      <div
                        className={`general-format-option ${formik.values.timeZone?.timeFormat === TIME_FORMAT.H24 ? "active" : null}`}
                        onClick={() =>
                          formik.setFieldValue(
                            "timeZone.timeFormat",
                            TIME_FORMAT.H24
                          )
                        }
                      >
                        {t("common.format_24_hour_example")}
                      </div>
                      <div
                        className={`general-format-option ${formik.values.timeZone?.timeFormat === TIME_FORMAT.H12 ? "active" : null}`}
                        onClick={() =>
                          formik.setFieldValue(
                            "timeZone.timeFormat",
                            TIME_FORMAT.H12
                          )
                        }
                      >
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
                      <div
                        className={`general-format-option ${formik.values.timeZone?.dateFormat === DATE_FORMAT.DDMMYYYY ? "active" : null}`}
                        onClick={() =>
                          formik.setFieldValue(
                            "timeZone.dateFormat",
                            DATE_FORMAT.DDMMYYYY
                          )
                        }
                      >
                        {t("common.date_dd_mm_yyyy")}
                      </div>
                      <div
                        className={`general-format-option ${formik.values.timeZone?.dateFormat === DATE_FORMAT.MMDDYYYY ? "active" : null}`}
                        onClick={() =>
                          formik.setFieldValue(
                            "timeZone.dateFormat",
                            DATE_FORMAT.MMDDYYYY
                          )
                        }
                      >
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
