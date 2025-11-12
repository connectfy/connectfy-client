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
import ToggleSlider from "@/components/ToggleSlider";
import { useTranslation } from "react-i18next";

const NotificationSettings = () => {
  const { t } = useTranslation();

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
  const [showNotification, setShowNotification] = useState(true);
  const [showNotificationContent, setShowNotificationContent] = useState(true);
  const [showPrivateMessageNotification, setShowPrivateMessageNotification] =
    useState(true);
  const [showGroupMessageNotification, setShowGroupMessageNotification] =
    useState(true);
  const [showFriendshipNotification, setShowFriendshipNotification] =
    useState(true);
  const [showSystemNotification, setShowSystemNotification] = useState(true);

  const NOTIFICATION_SOUNDS_CARDS = [
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
    {
      icon: Bell,
      title: t("common.show_notification"),
      desc: t("common.show_notification_desc"),
      checked: showNotification,
      onClick: () => setShowNotification(!showNotification),
    },
    {
      icon: Volume2,
      title: t("common.show_notification_content"),
      desc: t("common.show_notification_content_desc"),
      checked: showNotificationContent,
      onClick: () => setShowNotificationContent(!showNotificationContent),
    },
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

  return (
    <Fragment>
      <section className="notification-settings">
        <div className="notification-settings-container">
          <div className="notification-settings-header">
            <h1>{t("common.notification_header")}</h1>
            <p>{t("common.notification_subheader")}</p>
          </div>

          <div className="notification-settings-content">
            {/* NOTIFICATION SOUND SETTINGS */}
            <div className="notification-privacy-section">
              <h2 className="notification-section-title">
                {t("common.sound_section_title")}
              </h2>

              {NOTIFICATION_SOUNDS_CARDS.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    className="notification-setting-card"
                    key={`sound-${idx}`}
                  >
                    <div className="notification-setting-card-header">
                      <div className="notification-setting-icon">
                        <Icon size={20} />
                      </div>
                      <div className="notification-setting-card-title">
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </div>
                      <ToggleSlider
                        checked={card.checked}
                        onClick={card.onClick}
                      />
                    </div>
                  </div>
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
                  <div
                    className="notification-setting-card"
                    key={`banner-${idx}`}
                  >
                    <div className="notification-setting-card-header">
                      <div className="notification-setting-icon">
                        <Icon size={20} />
                      </div>
                      <div className="notification-setting-card-title">
                        <h3>{card.title}</h3>
                        <p>{card.desc}</p>
                      </div>
                      <ToggleSlider
                        checked={card.checked}
                        onClick={card.onClick}
                      />
                    </div>
                  </div>
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
