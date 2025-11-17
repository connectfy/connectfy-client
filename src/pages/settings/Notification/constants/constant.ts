import { TFunction } from "i18next";
import {
  Bell,
  Cog,
  MessageSquare,
  UserPlus,
  Users,
  Volume2,
} from "lucide-react";
import { useState } from "react";

export const messageSoundCard = (t: TFunction) => {
  const [sentSound, setSentSound] = useState(true);
  const [receiveSound, setReceiveSound] = useState(true);

  return [
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
};

export const notificationSoundCard = (t: TFunction) => {
  const [notificationSound, setNotificationSound] = useState(true);
  const [privateMessageSound, setPrivateMessageSound] = useState(true);
  const [groupMessageSound, setGroupMessageSound] = useState(true);
  const [systemNotificationSound, setSystemNotificationSound] = useState(true);
  const [friendshipNotificationSound, setFriendshipNotificationSound] =
    useState(true);

  return [
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
};

export const notificationBannerCards = (t: TFunction) => {
  const [showPrivateMessageNotification, setShowPrivateMessageNotification] =
    useState(true);
  const [showGroupMessageNotification, setShowGroupMessageNotification] =
    useState(true);
  const [showFriendshipNotification, setShowFriendshipNotification] =
    useState(true);
  const [showSystemNotification, setShowSystemNotification] = useState(true);

  return [
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
};
