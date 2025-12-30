import {
  DATE_FORMAT,
  LANGUAGE,
  STARTUP_PAGE,
  THEME,
  TIME_FORMAT,
} from "@/common/enums/enums";
import { IPrivacySettings } from "../../PrivacySettings/types/types";
import { INotificationSettings } from "../../NotificationSettings/types/types";

export interface ITimeZone {
  timeFormat: TIME_FORMAT;
  dateFormat: DATE_FORMAT;
}

export interface IGeneralSettings {
  _id: string;
  userId: string;
  theme: THEME;
  language: LANGUAGE;
  startupPage: STARTUP_PAGE;
  timeZone: ITimeZone;
}

export interface IEditGeneralSettings
  extends Partial<Omit<IGeneralSettings, "userId">> {
  _id: string;
}

export interface IResetSettings {
  generalSettings: IGeneralSettings;
  privacySettings: IPrivacySettings;
  notificationSettings: INotificationSettings;
}
