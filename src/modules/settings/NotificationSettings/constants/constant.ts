import {
  NOTIFICATION_CONTENT_MODE,
  NOTIFICATION_SOUND_MODE,
} from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";
import { TFunction } from "i18next";
import {
  Bell,
  Cog,
  MessageSquare,
  UserPlus,
  Users,
  Volume2,
} from "lucide-react";
import { IEditNotificationSettings, INotificationSettings } from "../types/types";

export const notificationModeOptions = (t: TFunction) => {
  return [
    {
      key: NOTIFICATION_SOUND_MODE.SOUND,
      name: t("common.sound_notifications"),
      description: t("common.all_notifications_with_sound"),
    },
    {
      key: NOTIFICATION_SOUND_MODE.SILENT,
      name: t("common.silent_mode"),
      description: t("common.only_visual_no_sound"),
    },
    {
      key: NOTIFICATION_SOUND_MODE.DND,
      name: t("common.do_not_disturb"),
      description: t("common.no_notifications"),
    },
  ];
};

export const notificationContentOptions = (t: TFunction) => {
  return [
    {
      key: NOTIFICATION_CONTENT_MODE.HEADER_AND_CONTENT,
      name: t("common.show_header_and_content"),
      description: t("common.show_header_and_content_desc"),
    },
    {
      key: NOTIFICATION_CONTENT_MODE.HEADER_ONLY,
      name: t("common.show_header_only"),
      description: t("common.show_header_only_desc"),
    },
    {
      key: NOTIFICATION_CONTENT_MODE.HIDE_NOTIFICATION,
      name: t("common.hide_notifications"),
      description: t("common.hide_notifications_desc"),
    },
  ];
};

export const NOTIFICATION_FIELDS = (t: TFunction) => ({
  messageSounds: [
    {
      field: "sendMessageSound",
      title: t("common.sent_sound"),
      desc: t("common.sent_sound_desc"),
      icon: MessageSquare,
    },
    {
      field: "receiveMessageSound",
      title: t("common.receive_sound"),
      desc: t("common.receive_sound_desc"),
      icon: Volume2,
    },
  ],
  notificationSounds: [
    {
      field: "notificationSound",
      title: t("common.notification_sound"),
      desc: t("common.notification_sound_desc"),
      icon: Bell,
    },
    {
      field: "privateMessageSound",
      title: t("common.private_message_sound"),
      desc: t("common.private_message_sound_desc"),
      icon: MessageSquare,
    },
    {
      field: "groupMessageSound",
      title: t("common.group_message_sound"),
      desc: t("common.group_message_sound_desc"),
      icon: Users,
    },
    {
      field: "systemNotificationSound",
      title: t("common.system_notification_sound"),
      desc: t("common.system_notification_sound_desc"),
      icon: Cog,
    },
    {
      field: "friendshipNotificationSound",
      title: t("common.friendship_notification_sound"),
      desc: t("common.friendship_notification_sound_desc"),
      icon: UserPlus,
    },
  ],
  notificationBanners: [
    {
      field: "showPrivateMessageNotification",
      title: t("common.show_private_message_notification"),
      desc: t("common.show_private_message_notification_desc"),
      icon: MessageSquare,
    },
    {
      field: "showGroupMessageNotification",
      title: t("common.show_group_message_notification"),
      desc: t("common.show_group_message_notification_desc"),
      icon: Users,
    },
    {
      field: "showFriendshipNotification",
      title: t("common.show_friendship_notification"),
      desc: t("common.show_friendship_notification_desc"),
      icon: UserPlus,
    },
    {
      field: "showSystemNotification",
      title: t("common.show_system_notification"),
      desc: t("common.show_system_notification_desc"),
      icon: Cog,
    },
  ],
});

export const initialState = (
  data: INotificationSettings
): IEditNotificationSettings => {
  const {
    _id,
    notificationSoundMode,
    notificationContentMode,
    sendMessageSound,
    receiveMessageSound,
    notificationSound,
    privateMessageSound,
    groupMessageSound,
    systemNotificationSound,
    friendshipNotificationSound,
    showPrivateMessageNotification,
    showGroupMessageNotification,
    showFriendshipNotification,
    showSystemNotification,
  } = data;

  return {
    _id,
    notificationSoundMode,
    notificationContentMode,
    sendMessageSound,
    receiveMessageSound,
    notificationSound,
    privateMessageSound,
    groupMessageSound,
    systemNotificationSound,
    friendshipNotificationSound,
    showPrivateMessageNotification,
    showGroupMessageNotification,
    showFriendshipNotification,
    showSystemNotification,
  };
};

export const validateNotificationSettings = (
  values: IEditNotificationSettings,
  t: TFunction
): void => {
  const { notificationSoundMode, notificationContentMode } = values;

  if (
    notificationSoundMode &&
    !Object.values(NOTIFICATION_SOUND_MODE).includes(notificationSoundMode)
  ) {
    snack.error(t("error_messages.invalid_choice"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    return;
  }

  if (
    notificationContentMode &&
    !Object.values(NOTIFICATION_CONTENT_MODE).includes(notificationContentMode)
  ) {
    snack.error(t("error_messages.invalid_choice"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });
    return;
  }
};
