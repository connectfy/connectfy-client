import {
  DATE_FORMAT,
  LANGUAGE,
  STARTUP_PAGE,
  THEME,
  TIME_FORMAT,
} from "@/types/enum.types";
import { IPrivacySettings } from "../privacy/privacy-settings.type";
import { INotificationSettings } from "../notification/notification-settings.type";

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
