import {
  Bell,
  Volume2,
  MessageSquare,
  Users,
  UserPlus,
  Cog,
} from "lucide-react";
import { Fragment, useState } from "react";
import "./index.style.css";
import { useTranslation } from "react-i18next";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import ToggleCard from "@/components/Card/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import SettingCard from "@/components/Card/SettingsCard";

const NotificationSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Notification Sound Settings
  const [sentSound, setSentSound] = useState(true);
  const [receiveSound, setReceiveSound] = useState(true);
  const [notificationSound, setNotificationSound] = useState(true);
  const [privateMessageSound, setPrivateMessageSound] = useState(true);
  const [groupMessageSound, setGroupMessageSound] = useState(true);
  const [systemNotificationSound, setSystemNotificationSound] = useState(true);
  const [friendshipNotificationSound, setFriendshipNotificationSound] =
    useState(true);

  // Notification Banner Settings
  // const [showNotification, setShowNotification] = useState(true);
  // const [showNotificationContent, setShowNotificationContent] = useState(true);
  const [showPrivateMessageNotification, setShowPrivateMessageNotification] =
    useState(true);
  const [showGroupMessageNotification, setShowGroupMessageNotification] =
    useState(true);
  const [showFriendshipNotification, setShowFriendshipNotification] =
    useState(true);
  const [showSystemNotification, setShowSystemNotification] = useState(true);

  const MESSAGE_SOUND_CARD = [
    {
      icon: MessageSquare,
      title: t("common.sent_sound"),
      desc: t("common.sent_sound_desc"),
      checked: sentSound,
      onClick: () => setSentSound(!sentSound),
    },
    {
      icon: Volume2,
      title: t("common.receive_sound"),
      desc: t("common.receive_sound_desc"),
      checked: receiveSound,
      onClick: () => setReceiveSound(!receiveSound),
    },
  ];

  const NOTIFICATION_SOUNDS_CARDS = [
    {
      icon: Bell,
      title: t("common.notification_sound"),
      desc: t("common.notification_sound_desc"),
      checked: notificationSound,
      onClick: () => setNotificationSound(!notificationSound),
    },
    {
      icon: MessageSquare,
      title: t("common.private_message_sound"),
      desc: t("common.private_message_sound_desc"),
      checked: privateMessageSound,
      onClick: () => setPrivateMessageSound(!privateMessageSound),
    },
    {
      icon: Users,
      title: t("common.group_message_sound"),
      desc: t("common.group_message_sound_desc"),
      checked: groupMessageSound,
      onClick: () => setGroupMessageSound(!groupMessageSound),
    },
    {
      icon: Cog,
      title: t("common.system_notification_sound"),
      desc: t("common.system_notification_sound_desc"),
      checked: systemNotificationSound,
      onClick: () => setSystemNotificationSound(!systemNotificationSound),
    },
    {
      icon: UserPlus,
      title: t("common.friendship_notification_sound"),
      desc: t("common.friendship_notification_sound_desc"),
      checked: friendshipNotificationSound,
      onClick: () =>
        setFriendshipNotificationSound(!friendshipNotificationSound),
    },
  ];

  const NOTIFICATION_BANNER_CARDS = [
    // {
    //   icon: Bell,
    //   title: t("common.show_notification"),
    //   desc: t("common.show_notification_desc"),
    //   checked: showNotification,
    //   onClick: () => setShowNotification(!showNotification),
    // },
    // {
    //   icon: Volume2,
    //   title: t("common.show_notification_content"),
    //   desc: t("common.show_notification_content_desc"),
    //   checked: showNotificationContent,
    //   onClick: () => setShowNotificationContent(!showNotificationContent),
    // },
    {
      icon: MessageSquare,
      title: t("common.show_private_message_notification"),
      desc: t("common.show_private_message_notification_desc"),
      checked: showPrivateMessageNotification,
      onClick: () =>
        setShowPrivateMessageNotification(!showPrivateMessageNotification),
    },
    {
      icon: Users,
      title: t("common.show_group_message_notification"),
      desc: t("common.show_group_message_notification_desc"),
      checked: showGroupMessageNotification,
      onClick: () =>
        setShowGroupMessageNotification(!showGroupMessageNotification),
    },
    {
      icon: UserPlus,
      title: t("common.show_friendship_notification"),
      desc: t("common.show_friendship_notification_desc"),
      checked: showFriendshipNotification,
      onClick: () => setShowFriendshipNotification(!showFriendshipNotification),
    },
    {
      icon: Cog,
      title: t("common.show_system_notification"),
      desc: t("common.show_system_notification_desc"),
      checked: showSystemNotification,
      onClick: () => setShowSystemNotification(!showSystemNotification),
    },
  ];

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
