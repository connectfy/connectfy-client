import {
  Sun,
  Moon,
  Globe,
  Home,
  Clock,
  RefreshCw,
  TriangleAlert,
  MonitorSmartphone,
} from "lucide-react";
import "./generalSetttings.style.css";
import { Fragment, useEffect, useState } from "react";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader/UniqueHeader";
import SettingCard from "@/components/Card/SettingsCard/SettingCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import {
  homepageOptions,
  initialState,
  languageOptions,
  validateGenerateSettings,
} from "../constants/contant";
import { useFormik } from "formik";
import { DATE_FORMAT, THEME, TIME_FORMAT } from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";
import { useBlocker } from "@/hooks/useBlocker";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import SaveChangesModal from "@/components/Modal/SaveChangesModal/SaveChangesModal";
import useBoolean from "@/hooks/useBoolean";
import ActionConfirmModal from "@/components/Modal/ActionConfirmModal/ActionConfirmModal";
import {
  useEditGeneralSettingsMutation,
  useGetGeneralSettingsQuery,
  useResetSettingsMutation,
} from "../api/api";
import { useErrors } from "@/hooks/useErrors";
import { SettingsSpinner } from "@/components/Spinner/Settings/SettingsSpinner";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";

const GeneralSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  const { data, isLoading: LOADING_GET } = useGetGeneralSettingsQuery(
    undefined,
    {
      skip: !access_token,
    },
  );
  const [updateGeneralSettings, { isLoading: LOADING_UPDATE }] =
    useEditGeneralSettingsMutation();
  const [resetSettings, { isLoading: LOADING_RESET_SETTINGS }] =
    useResetSettingsMutation();

  const { showResponseErrors } = useErrors();

  const resetSettingsModal = useBoolean();

  const formik = useFormik({
    initialValues: initialState(data!),
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateGenerateSettings(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await updateGeneralSettings(values).unwrap();
        if (res) {
          snack.success(t("user_messages.information_updated"));
          resetForm();
        }
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const { pending, confirm, cancel } = useBlocker(!!formik.dirty);
  useBeforeUnload(!!formik.dirty, t("common.unsaved_changes_message"));

  const isActiveTheme = (theme: THEME) => selectedTheme === theme;
  const LANGUAGE_OPTIONS = languageOptions(t, formik);
  const HOMEPAGE_OPTIONS = homepageOptions(t, formik);

  const changeAppTheme = (appTheme: THEME) => {
    if (theme === appTheme) return;
    formik.setFieldValue("theme", appTheme);
    toggleTheme(appTheme);
  };

  const getLabel = (options: any) =>
    options.selections.find((s: any) => s.key === options.activeKey)?.name ||
    options.title;

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleSaveAndLeave = async () => {
    await formik.submitForm();
    confirm();
  };

  const handleDiscardChanges = () => {
    if (formik.values.theme !== data?.theme) {
      formik.setFieldValue("theme", data?.theme);
      toggleTheme(data?.theme as THEME);
    }

    formik.resetForm();
    confirm();
  };

  const handleCancelModal = () => {
    cancel();
  };

  const handleResetSettings = async () => {
    try {
      const res = await resetSettings().unwrap();
      if (res) {
        snack.success(t("user_messages.information_updated"));

        if (formik.values.theme !== data?.theme) {
          formik.setFieldValue("theme", data?.theme);
          toggleTheme(data?.theme as THEME);
        }

        formik.resetForm();
        resetSettingsModal.onClose();
      }
    } catch (error) {
      showResponseErrors(error);
    }
  };

  return (
    <Fragment>
      <section className="general-settings">
        <div className="general-settings-container">
          <UniqueHeader
            headerTitle={t("common.general_settings")}
            headerSubtitle={t("common.configure_app_settings")}
            onClickBack={onClickBack}
            onHeaderButtonClick={formik.handleSubmit}
            showHeaderButton
            isHeaderButtonDisabled={!formik.dirty || LOADING_UPDATE}
            isLoading={LOADING_UPDATE}
          />

          {LOADING_GET ? (
            <SettingsSpinner />
          ) : (
            <Fragment>
              <div className="general-settings-content">
                <SettingCard
                  header={{
                    icon: Sun,
                    title: t("common.app_theme"),
                    subtitle: t("common.choose_light_dark_system"),
                  }}
                >
                  <div className="general-theme-options">
                    <div
                      className={`general-theme-option ${isActiveTheme(THEME.LIGHT) ? "active" : ""}`}
                      onClick={() => changeAppTheme(THEME.LIGHT)}
                    >
                      <div className="general-theme-option-icon">
                        <Sun size={24} />
                      </div>
                      <span>{t("common.light")}</span>
                    </div>
                    <div
                      className={`general-theme-option ${isActiveTheme(THEME.DARK) ? "active" : ""}`}
                      onClick={() => changeAppTheme(THEME.DARK)}
                    >
                      <div className="general-theme-option-icon">
                        <Moon size={24} />
                      </div>
                      <span>{t("common.dark")}</span>
                    </div>
                    <div
                      className={`general-theme-option ${isActiveTheme(THEME.DEVICE) ? "active" : ""}`}
                      onClick={() => changeAppTheme(THEME.DEVICE)}
                    >
                      <div className="general-theme-option-icon">
                        <MonitorSmartphone size={24} />
                      </div>
                      <span>{t("common.device")}</span>
                    </div>
                  </div>
                </SettingCard>

                <SettingCard
                  header={{
                    icon: Globe,
                    title: t("common.language"),
                    subtitle: t("common.language"),
                  }}
                >
                  <CustomSelect
                    buttonTitle={getLabel(LANGUAGE_OPTIONS)}
                    options={LANGUAGE_OPTIONS}
                  />
                </SettingCard>

                <SettingCard
                  header={{
                    icon: Home,
                    title: t("common.startup_page"),
                    subtitle: t("common.which_page_on_start"),
                  }}
                >
                  <CustomSelect
                    buttonTitle={getLabel(HOMEPAGE_OPTIONS)}
                    options={HOMEPAGE_OPTIONS}
                  />
                </SettingCard>

                <SettingCard
                  header={{
                    icon: Clock,
                    title: t("common.timezone_and_format"),
                    subtitle: t("common.select_time_display_format"),
                  }}
                >
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
                          className={`general-format-option ${
                            formik.values.timeZone?.timeFormat ===
                            TIME_FORMAT.H24
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            formik.setFieldValue(
                              "timeZone.timeFormat",
                              TIME_FORMAT.H24,
                            )
                          }
                        >
                          {t("common.format_24_hour_example")}
                        </div>
                        <div
                          className={`general-format-option ${
                            formik.values.timeZone?.timeFormat ===
                            TIME_FORMAT.H12
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            formik.setFieldValue(
                              "timeZone.timeFormat",
                              TIME_FORMAT.H12,
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
                          className={`general-format-option ${
                            formik.values.timeZone?.dateFormat ===
                            DATE_FORMAT.DDMMYYYY
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            formik.setFieldValue(
                              "timeZone.dateFormat",
                              DATE_FORMAT.DDMMYYYY,
                            )
                          }
                        >
                          {t("common.date_dd_mm_yyyy")}
                        </div>
                        <div
                          className={`general-format-option ${
                            formik.values.timeZone?.dateFormat ===
                            DATE_FORMAT.MMDDYYYY
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            formik.setFieldValue(
                              "timeZone.dateFormat",
                              DATE_FORMAT.MMDDYYYY,
                            )
                          }
                        >
                          {t("common.date_mm_dd_yyyy")}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                </SettingCard>

                <SettingCard
                  header={{
                    icon: RefreshCw,
                    title: t("common.reset_to_defaults"),
                    subtitle: t("common.reset_all_general_settings"),
                  }}
                >
                  <button
                    className="general-reset-button"
                    onClick={resetSettingsModal.onOpen}
                  >
                    <RefreshCw size={18} />
                    {t("common.reset_settings")}
                  </button>
                </SettingCard>
              </div>
            </Fragment>
          )}
        </div>
      </section>

      <SaveChangesModal
        open={!!pending}
        handleSave={handleSaveAndLeave}
        handleCancel={handleCancelModal}
        handleDiscardChanges={handleDiscardChanges}
        isLoading={LOADING_UPDATE}
      />

      <ActionConfirmModal
        open={resetSettingsModal.open}
        onClose={resetSettingsModal.onClose}
        onCancel={resetSettingsModal.onClose}
        onConfirm={handleResetSettings}
        header={{
          title: t("common.reset_settings_title"),
        }}
        cancelBtn={{ title: t("common.cancel") }}
        confirmBtn={{ title: t("common.reset"), color: "var(--error-color)" }}
        icon={{
          content: TriangleAlert,
          color: "var(--error-color)",
        }}
        isLoading={LOADING_RESET_SETTINGS}
      >
        <div className="reset-settings-modal-content">
          <p className="reset-settings-modal-subtitle">
            {t("common.reset_settings_subtitle")}
          </p>
          <ul className="reset-settings-modal-list">
            <li>{t("common.general_settings_reset")}</li>
            <li>{t("common.privacy_settings")}</li>
            <li>{t("common.notification_settings")}</li>
          </ul>
        </div>
      </ActionConfirmModal>
    </Fragment>
  );
};

export default GeneralSettings;
