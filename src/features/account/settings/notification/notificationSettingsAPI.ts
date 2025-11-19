import {
  IEditNotificationSettings,
  INotificationSettings,
} from "@/types/account/settings/notification/notification-settings.type";
import axios from "@/helpers/instance";

export const updateNotificationSettingsApi = (data: IEditNotificationSettings) =>
  axios.patch<INotificationSettings>(
    "/account/settings/notification-settings/update",
    data
  );
