import { PHONE_NUMBER_ACTION, PROVIDER, ROLE } from "@/types/enum.types";
import { IPhoneNumber } from "../auth/auth.type";
import { IGeneralSettings } from "../../account/settings/general/general-settings.type";
import { INotificationSettings } from "../../account/settings/notification/notification-settings.type";
import { IPrivacySettings } from "../../account/settings/privacy/privacy-settings.type";
import { IAccount } from "@/types/account/account/account.type";
import { ISocialLink } from "@/types/account/social-links/social-links.type";

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

export interface IUpdateUsername {
  username: string | null;
  token: string | null;
}

export interface IUpdateEmail {
  email: string | null;
  token: string | null;
}

export interface IUpdatePassword {
  password: string | null;
  confirmPassword: string | null;
  token: string | null;
}

export interface IVerifyChangeEmail {
  token: string | null;
}

export interface IUpdatePhoneNumber {
  token: string | null;
  action: PHONE_NUMBER_ACTION | null;
  phoneNumber: IPhoneNumber | null;
}

export interface IUpdateUsernameResponse extends IUser {}

export interface IUpdateEmailResponse {
  statusCode: number;
}

export interface IUpdatePasswordResponse extends IUser {}

export interface IVerifyChangeEmailResponse extends IUser {}

export interface IUpdatePhoneNumberResponse extends IUser {}
