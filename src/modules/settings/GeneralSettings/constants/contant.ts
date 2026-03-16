import {
  DATE_FORMAT,
  LANGUAGE,
  NOTIFICATION_CONTENT_MODE,
  NOTIFICATION_SOUND_MODE,
  PRIVACY_SETTINGS_CHOICE,
  STARTUP_PAGE,
  THEME,
  TIME_FORMAT,
} from "@/common/enums/enums";
import { TFunction } from "i18next";
import {
  Bell,
  Globe,
  MessageCircle,
  Radio,
  User,
  UserCircle,
  Users,
} from "lucide-react";
import { snack } from "@/common/utils/snackManager";
import { FormikProps } from "formik";
import { IEditGeneralSettings, IGeneralSettings } from "../types/types";

export const languageOptions = (
  t: TFunction,
  formik: FormikProps<IEditGeneralSettings>,
) => {
  const handleLanguageChange = (code: LANGUAGE) => {
    formik.setFieldValue("language", code);
  };

  return {
    title: t("common.language_selection"),
    activeKey: formik.values.language!,
    selections: [
      {
        key: "az",
        name: "Azərbaycan",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.AZ),
      },
      {
        key: "en",
        name: "English",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.EN),
      },
      {
        key: "ru",
        name: "Русский",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.RU),
      },
      {
        key: "tr",
        name: "Türkçe",
        icon: Globe,
        onClick: () => handleLanguageChange(LANGUAGE.TR),
      },
    ],
  };
};

export const homepageOptions = (
  t: TFunction,
  formik: FormikProps<IEditGeneralSettings>,
) => {
  return {
    title: t("common.homepage"),
    activeKey: formik.values.startupPage!,
    selections: [
      {
        key: STARTUP_PAGE.MESSENGER,
        name: t(`enum.${STARTUP_PAGE.MESSENGER}`),
        title: t(`enum.${STARTUP_PAGE.MESSENGER}`),
        icon: MessageCircle,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.MESSENGER),
      },
      {
        key: STARTUP_PAGE.GROUPS,
        name: t(`enum.${STARTUP_PAGE.GROUPS}`),
        title: t(`enum.${STARTUP_PAGE.GROUPS}`),
        icon: Users,
        onClick: () => formik.setFieldValue("startupPage", STARTUP_PAGE.GROUPS),
      },
      {
        key: STARTUP_PAGE.CHANNELS,
        name: t(`enum.${STARTUP_PAGE.CHANNELS}`),
        title: t(`enum.${STARTUP_PAGE.CHANNELS}`),
        icon: Radio,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.CHANNELS),
      },
      {
        key: STARTUP_PAGE.USERS,
        name: t(`enum.${STARTUP_PAGE.USERS}`),
        title: t(`enum.${STARTUP_PAGE.USERS}`),
        icon: UserCircle,
        onClick: () => formik.setFieldValue("startupPage", STARTUP_PAGE.USERS),
      },
      {
        key: STARTUP_PAGE.NOTIFICATION,
        name: t(`enum.${STARTUP_PAGE.NOTIFICATION}`),
        title: t(`enum.${STARTUP_PAGE.NOTIFICATION}`),
        icon: Bell,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.NOTIFICATION),
      },
      {
        key: STARTUP_PAGE.PROFILE,
        name: t(`enum.${STARTUP_PAGE.PROFILE}`),
        title: t(`enum.${STARTUP_PAGE.PROFILE}`),
        icon: User,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.PROFILE),
      },
    ],
  };
};

export const initialState = (data: IGeneralSettings): IEditGeneralSettings => {
  const { _id, theme, language, startupPage, timeZone } = data;

  const initialState = {
    _id,
    theme,
    language,
    startupPage,
    timeZone,
  };

  return initialState;
};

export const validateGenerateSettings = (
  values: IEditGeneralSettings,
  t: TFunction,
): void => {
  const { theme, language, startupPage, timeZone } = values;

  if (theme && !Object.values(THEME).includes(theme))
    snack.error(t("error_messages.invalid_choice"));

  if (language && !Object.values(LANGUAGE).includes(language))
    snack.error(t("error_messages.invalid_choice"));

  if (startupPage && !Object.values(STARTUP_PAGE).includes(startupPage))
    snack.error(t("error_messages.invalid_choice"));

  if (timeZone) {
    if (
      timeZone.dateFormat &&
      !Object.values(DATE_FORMAT).includes(timeZone.dateFormat)
    )
      snack.error(t("error_messages.invalid_choice"));

    if (
      timeZone.timeFormat &&
      !Object.values(TIME_FORMAT).includes(timeZone.timeFormat)
    )
      snack.error(t("error_messages.invalid_choice"));
  }
};

export const resetSettingsResponse = {
  generalSettings: {
    startupPage: STARTUP_PAGE.MESSENGER,
    timeZone: {
      timeFormat: TIME_FORMAT.H24,
      dateFormat: DATE_FORMAT.DDMMYYYY,
    },
  },
  privacySettings: {
    email: PRIVACY_SETTINGS_CHOICE.NOBODY,
    bio: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    gender: PRIVACY_SETTINGS_CHOICE.NOBODY,
    location: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    socialLinks: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    lastSeen: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    avatar: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    messageRequest: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    birthdayDate: PRIVACY_SETTINGS_CHOICE.EVERYONE,
    friendshipRequest: true,
    readReceipts: true,
  },
  notificationSettings: {
    notificationSoundMode: NOTIFICATION_SOUND_MODE.SOUND,
    notificationContentMode: NOTIFICATION_CONTENT_MODE.HEADER_AND_CONTENT,
    sendMessageSound: true,
    receiveMessageSound: true,
    notificationSound: true,
    privateMessageSound: true,
    groupMessageSound: true,
    systemNotificationSound: true,
    friendshipNotificationSound: true,
    showPrivateMessageNotification: true,
    showGroupMessageNotification: true,
    showFriendshipNotification: true,
    showSystemNotification: true,
  },
};
