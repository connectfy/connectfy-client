import {
  NOTIFICATION_CONTENT_MODE,
  NOTIFICATION_SOUND_MODE,
} from "@/types/enum.types";

export interface INotificationSettings {
  _id: string;
  userId: string;
  notificationSoundMode: NOTIFICATION_SOUND_MODE;
  notificationContentMode: NOTIFICATION_CONTENT_MODE;
  sendMessageSound: boolean;
  receiveMessageSound: boolean;
  notificationSound: boolean;
  privateMessageSound: boolean;
  groupMessageSound: boolean;
  systemNotificationSound: boolean;
  friendshipNotificationSound: boolean;
  showPrivateMessageNotification: boolean;
  showGroupMessageNotification: boolean;
  showFriendshipNotification: boolean;
  showSystemNotification: boolean;
}

export interface IEditNotificationSettings
  extends Partial<Omit<INotificationSettings, "userId">> {
  _id: string;
}
