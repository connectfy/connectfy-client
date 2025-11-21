import {
  DATE_FORMAT,
  LANGUAGE,
  STARTUP_PAGE,
  THEME,
  TIME_FORMAT,
} from "@/types/enum.types";
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
import { IEditGeneralSettings, IGeneralSettings } from "@/types/account/settings/general/general-settings.type";
import { snack } from "@/utils/snackManager";
import { FormikProps } from "formik";

export const languageOptions = (
  t: TFunction,
  formik: FormikProps<IEditGeneralSettings>
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
  formik: FormikProps<IEditGeneralSettings>
) => {
  return {
    title: t("common.homepage"),
    activeKey: formik.values.startupPage!,
    selections: [
      {
        key: STARTUP_PAGE.MESSENGER,
        name: t("common.messenger"),
        title: t("common.messenger"),
        icon: MessageCircle,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.MESSENGER),
      },
      {
        key: STARTUP_PAGE.GROUPS,
        name: t("common.groups"),
        title: t("common.groups"),
        icon: Users,
        onClick: () => formik.setFieldValue("startupPage", STARTUP_PAGE.GROUPS),
      },
      {
        key: STARTUP_PAGE.CHANNELS,
        name: t("common.channels"),
        title: t("common.channels"),
        icon: Radio,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.CHANNELS),
      },
      {
        key: STARTUP_PAGE.USERS,
        name: t("common.users"),
        title: t("common.users"),
        icon: UserCircle,
        onClick: () => formik.setFieldValue("startupPage", STARTUP_PAGE.USERS),
      },
      {
        key: STARTUP_PAGE.NOTIFICATION,
        name: t("common.notifications"),
        title: t("common.notifications"),
        icon: Bell,
        onClick: () =>
          formik.setFieldValue("startupPage", STARTUP_PAGE.NOTIFICATION),
      },
      {
        key: STARTUP_PAGE.PROFILE,
        name: t("common.my_profile"),
        title: t("common.my_profile"),
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
  t: TFunction
): void => {
  const { theme, language, startupPage, timeZone } = values;

  if (theme && !Object.values(THEME).includes(theme))
    snack.error(t("error_messages.invalid_choice"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });

  if (language && !Object.values(LANGUAGE).includes(language))
    snack.error(t("error_messages.invalid_choice"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });

  if (startupPage && !Object.values(STARTUP_PAGE).includes(startupPage))
    snack.error(t("error_messages.invalid_choice"), {
      anchorOrigin: { vertical: "top", horizontal: "center" },
    });

  if (timeZone) {
    if (
      timeZone.dateFormat &&
      !Object.values(DATE_FORMAT).includes(timeZone.dateFormat)
    )
      snack.error(t("error_messages.invalid_choice"), {
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });

    if (
      timeZone.timeFormat &&
      !Object.values(TIME_FORMAT).includes(timeZone.timeFormat)
    )
      snack.error(t("error_messages.invalid_choice"), {
        anchorOrigin: { vertical: "top", horizontal: "center" },
      });
  }
};
