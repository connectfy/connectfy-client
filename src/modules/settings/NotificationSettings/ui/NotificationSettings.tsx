import { Bell } from "lucide-react";
import { Fragment } from "react";
import "./notificationSettings.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader/UniqueHeader";
import ToggleCard from "@/components/Card/ToggleCard/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import SettingCard from "@/components/Card/SettingsCard/SettingCard";
import {
  initialState,
  NOTIFICATION_FIELDS,
  notificationModeOptions,
  notificationContentOptions,
  validateNotificationSettings,
} from "../constants/constant";
import { useFormik } from "formik";
import { snack } from "@/common/utils/snackManager";
import { useBlocker } from "@/hooks/useBlocker";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import SaveChangesModal from "@/components/Modal/SaveChangesModal/SaveChangesModal";
import { useEditNotificationSettingsMutation } from "../api/api";
import { useErrors } from "@/hooks/useErrors";
import { SettingsSkeleton } from "@/common/utils/skeleton";
import { getChangedData } from "@/common/utils/getDirtyValues";
import { IEditNotificationSettings } from "../types/types";
import { useNotificationSettings } from "../hooks/useNotificationSettings";

const NotificationSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { notificationSettings, isLoading: LOADING_GET } =
    useNotificationSettings();
  const [editNotificationSettings, { isLoading: LOADING_UPDATE }] =
    useEditNotificationSettingsMutation();

  const { showResponseErrors } = useErrors();

  const formik = useFormik({
    initialValues: initialState(notificationSettings!),
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateNotificationSettings(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const changedData = getChangedData<IEditNotificationSettings>(
          notificationSettings!,
          values,
        );
        values = {
          _id: notificationSettings!._id,
          ...changedData,
        };
        await editNotificationSettings(values).unwrap();
        snack.success(t("user_messages.information_updated"));
        resetForm();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const { pending, confirm, cancel } = useBlocker(!!formik.dirty);
  useBeforeUnload(!!formik.dirty, t("common.unsaved_changes_message"));

  const handleSaveAndLeave = async () => {
    await formik.submitForm();
    confirm();
  };

  const handleDiscardChanges = () => {
    formik.resetForm();
    confirm();
  };

  const handleCancelModal = () => {
    cancel();
  };

  const NOTIFICATION_MODE_OPTIONS = notificationModeOptions(t);
  const NOTIFICATION_CONTENT_OPTIONS = notificationContentOptions(t);
  const notificationFields = NOTIFICATION_FIELDS(t);

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  return (
    <Fragment>
      <section className="notification-settings">
        <UniqueHeader
          headerTitle={t("common.notification_header")}
          headerSubtitle={t("common.notification_subheader")}
          onClickBack={onClickBack}
          onHeaderButtonClick={formik.handleSubmit}
          showHeaderButton
          isHeaderButtonDisabled={
            !formik.dirty || LOADING_UPDATE || LOADING_GET
          }
          isLoading={LOADING_UPDATE}
        />
        <div className="notification-settings-container">
          {LOADING_GET ? (
            <SettingsSkeleton count={8} />
          ) : (
            <Fragment>
              <div className="notification-settings-content">
                {/* GENERAL NOTIFICATION SETTINGS */}
                <div className="notification-privacy-section">
                  <h2 className="notification-section-title">
                    {t("common.general_notification_title")}
                  </h2>

                  <SettingCard
                    header={{
                      icon: Bell,
                      title: t("common.notification_mode"),
                      subtitle: t("common.select_default_notification"),
                    }}
                  >
                    <div className="general-notification-modes">
                      {NOTIFICATION_MODE_OPTIONS.map((option) => {
                        return (
                          <div
                            key={option.key}
                            className={`general-notification-mode ${
                              formik.values.notificationSoundMode === option.key
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              formik.setFieldValue(
                                "notificationSoundMode",
                                option.key,
                              )
                            }
                          >
                            <div className="general-mode-radio"></div>
                            <div className="general-mode-content">
                              <h4>{option.name}</h4>
                              <p>{option.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SettingCard>

                  <SettingCard
                    header={{
                      icon: Bell,
                      title: t("common.notification_content"),
                      subtitle: t("common.select_default_content"),
                    }}
                  >
                    <div className="general-notification-modes">
                      {NOTIFICATION_CONTENT_OPTIONS.map((option) => {
                        return (
                          <div
                            key={option.key}
                            className={`general-notification-mode ${
                              formik.values.notificationContentMode ===
                              option.key
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              formik.setFieldValue(
                                "notificationContentMode",
                                option.key,
                              )
                            }
                          >
                            <div className="general-mode-radio"></div>
                            <div className="general-mode-content">
                              <h4>{option.name}</h4>
                              <p>{option.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SettingCard>
                </div>

                {/* MESSAGE SOUND SETTINGS */}
                <div className="notification-privacy-section">
                  <h2 className="notification-section-title">
                    {t("common.message_sound_section_title")}
                  </h2>

                  {notificationFields.messageSounds.map((field) => {
                    const Icon = field.icon;
                    return (
                      <ToggleCard
                        key={field.field}
                        header={{
                          icon: Icon,
                          title: field.title,
                          subtitle: field.desc,
                        }}
                        slider={{
                          checked:
                            !!formik.values[
                              field.field as keyof typeof formik.values
                            ],
                          onClick: () =>
                            formik.setFieldValue(
                              field.field,
                              !formik.values[
                                field.field as keyof typeof formik.values
                              ],
                            ),
                        }}
                      />
                    );
                  })}
                </div>

                {/* NOTIFICATION SOUND SETTINGS */}
                <div className="notification-privacy-section">
                  <h2 className="notification-section-title">
                    {t("common.sound_section_title")}
                  </h2>

                  {notificationFields.notificationSounds.map((field) => {
                    const Icon = field.icon;
                    return (
                      <ToggleCard
                        key={field.field}
                        header={{
                          icon: Icon,
                          title: field.title,
                          subtitle: field.desc,
                        }}
                        slider={{
                          checked:
                            !!formik.values[
                              field.field as keyof typeof formik.values
                            ],
                          onClick: () =>
                            formik.setFieldValue(
                              field.field,
                              !formik.values[
                                field.field as keyof typeof formik.values
                              ],
                            ),
                        }}
                      />
                    );
                  })}
                </div>

                {/* NOTIFICATION BANNER SETTINGS */}
                <div className="notification-privacy-section">
                  <h2 className="notification-section-title">
                    {t("common.banner_section_title")}
                  </h2>

                  {notificationFields.notificationBanners.map((field) => {
                    const Icon = field.icon;
                    return (
                      <ToggleCard
                        key={field.field}
                        header={{
                          icon: Icon,
                          title: field.title,
                          subtitle: field.desc,
                        }}
                        slider={{
                          checked:
                            !!formik.values[
                              field.field as keyof typeof formik.values
                            ],
                          onClick: () =>
                            formik.setFieldValue(
                              field.field,
                              !formik.values[
                                field.field as keyof typeof formik.values
                              ],
                            ),
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </Fragment>
          )}
        </div>

        <SaveChangesModal
          open={!!pending}
          handleSave={handleSaveAndLeave}
          handleCancel={handleCancelModal}
          handleDiscardChanges={handleDiscardChanges}
          isLoading={LOADING_UPDATE}
        />
      </section>
    </Fragment>
  );
};

export default NotificationSettings;
