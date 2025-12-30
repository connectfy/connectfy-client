import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";

export interface IPrivacySettings {
  _id: string;
  userId: string;
  email: PRIVACY_SETTINGS_CHOICE;
  bio: PRIVACY_SETTINGS_CHOICE;
  gender: PRIVACY_SETTINGS_CHOICE;
  location: PRIVACY_SETTINGS_CHOICE;
  socialLinks: PRIVACY_SETTINGS_CHOICE;
  lastSeen: PRIVACY_SETTINGS_CHOICE;
  avatar: PRIVACY_SETTINGS_CHOICE;
  messageRequest: PRIVACY_SETTINGS_CHOICE;
  birthdayDate: PRIVACY_SETTINGS_CHOICE;
  phoneNumber: PRIVACY_SETTINGS_CHOICE;
  friendshipRequest: boolean;
  readReceipts: boolean;
}

export interface IEditPrivacySettings
  extends Partial<Omit<IPrivacySettings, "userId">> {
  _id: string;
}
