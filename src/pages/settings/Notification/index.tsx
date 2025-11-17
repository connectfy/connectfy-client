import { Bell } from "lucide-react";
import { Fragment } from "react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import ToggleCard from "@/components/Card/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import SettingCard from "@/components/Card/SettingsCard";
import {
  messageSoundCard,
  notificationBannerCards,
  notificationSoundCard,
} from "./constants/constant";

const NotificationSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const MESSAGE_SOUND_CARD = messageSoundCard(t);
  const NOTIFICATION_SOUNDS_CARDS = notificationSoundCard(t);
  const NOTIFICATION_BANNER_CARDS = notificationBannerCards(t);

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  return (
    <Fragment>
      <section className="notification-settings">
        <div className="notification-settings-container">
          <UniqueHeader
            headerTitle={t("common.notification_header")}
            headerSubtitle={t("common.notification_subheader")}
            onClickBack={onClickBack}
            onClickSave={() => {}}
            showChangesButton
            isChangesDisasbled={false}
          />

          <div className="notification-settings-content">
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
                content={
                  <div className="general-notification-modes">
                    <div className="general-notification-mode active">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.sound_notifications")}</h4>
                        <p>{t("common.all_notifications_with_sound")}</p>
                      </div>
                    </div>
                    <div className="general-notification-mode">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.silent_mode")}</h4>
                        <p>{t("common.only_visual_no_sound")}</p>
                      </div>
                    </div>
                    <div className="general-notification-mode">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.do_not_disturb")}</h4>
                        <p>{t("common.no_notifications")}</p>
                      </div>
                    </div>
                  </div>
                }
              />

              <SettingCard
                header={{
                  icon: Bell,
                  title: t("common.notification_content"),
                  subtitle: t("common.select_default_content"),
                }}
                content={
                  <div className="general-notification-modes">
                    <div className="general-notification-mode active">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.show_header_and_content")}</h4>
                        <p>{t("common.show_header_and_content_desc")}</p>
                      </div>
                    </div>
                    <div className="general-notification-mode">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.show_header_only")}</h4>
                        <p>{t("common.show_header_only_desc")}</p>
                      </div>
                    </div>
                    <div className="general-notification-mode">
                      <div className="general-mode-radio"></div>
                      <div className="general-mode-content">
                        <h4>{t("common.hide_notifications")}</h4>
                        <p>{t("common.hide_notifications_desc")}</p>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>

            {/* MESSAGE SOUND SETTINGS */}
            <div className="notification-privacy-section">
              <h2 className="notification-section-title">
                {t("common.message_sound_section_title")}
              </h2>

              {MESSAGE_SOUND_CARD.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <ToggleCard
                    key={`sound-${idx}`}
                    header={{
                      icon: Icon,
                      title: card.title,
                      subtitle: card.desc,
                    }}
                    slider={{
                      checked: card.checked,
                      onClick: card.onClick,
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

              {NOTIFICATION_SOUNDS_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <ToggleCard
                    key={`sound-${idx}`}
                    header={{
                      icon: Icon,
                      title: card.title,
                      subtitle: card.desc,
                    }}
                    slider={{
                      checked: card.checked,
                      onClick: card.onClick,
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

              {NOTIFICATION_BANNER_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <ToggleCard
                    key={`banner-${idx}`}
                    header={{
                      icon: Icon,
                      title: card.title,
                      subtitle: card.desc,
                    }}
                    slider={{
                      checked: card.checked,
                      onClick: card.onClick,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default NotificationSettings;
