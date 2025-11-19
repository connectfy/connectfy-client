import { IPhoneNumber } from "@/types/auth/auth/auth.type";
import { PROVIDER, ROLE } from "@/types/enum.types";
import { IGeneralSettings } from "../settings/general/general-settings.type";
import { INotificationSettings } from "../settings/notification/notification-settings.type";
import { IPrivacySettings } from "../settings/privacy/privacy-settings.type";

export interface IMe {
  user: {
    _id: string;
    username: string;
    email: string;
    role: ROLE;
    provider: PROVIDER;
    phoneNumber: IPhoneNumber | null;
  };
  settings: {
    generalSettings: IGeneralSettings;
    notificationSettings: INotificationSettings;
    privacySettings: IPrivacySettings;
  };
}
