import { GENDER, PROVIDER, ROLE, SOCIAL_LINK_PLATFORM } from "@/common/enums/enums";
import { IPhoneNumber } from "@/modules/auth/types/types";
import { IGeneralSettings } from "@/modules/settings/GeneralSettings/types/types";
import { INotificationSettings } from "@/modules/settings/NotificationSettings/types/types";
import { IPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";

export interface IAccount {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: GENDER;
  bio: string | null;
  location: string | null;
  avatar: string | null;
  lastSeen: Date;
  birthdayDate: Date;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: ROLE;
  provider: PROVIDER;
  phoneNumber: IPhoneNumber | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMe {
  user: IUser;
  account: IAccount;
  settings: {
    generalSettings: IGeneralSettings;
    notificationSettings: INotificationSettings;
    privacySettings: IPrivacySettings;
  };
  socialLinks: ISocialLink[];
}


export interface ISocialLink {
  _id: string;
  userId: string;
  name: string;
  url: string;
  platform: SOCIAL_LINK_PLATFORM;
}
