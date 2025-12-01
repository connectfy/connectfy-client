import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";
import { TFunction } from "i18next";
import { Eye, UserCheck, Lock } from "lucide-react";
import {
  IEditPrivacySettings,
  IPrivacySettings,
} from "@/types/account/settings/privacy/privacy-settings.type";
import { snack } from "@/utils/snackManager";

export const privacyOptions = (t: TFunction) => {
  return [
    {
      key: PRIVACY_SETTINGS_CHOICE.EVERYONE,
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.EVERYONE}`),
      icon: Eye,
    },
    {
      key: PRIVACY_SETTINGS_CHOICE.MY_FRIENDS,
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.MY_FRIENDS}`),
      icon: UserCheck,
    },
    {
      key: PRIVACY_SETTINGS_CHOICE.NOBODY,
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.NOBODY}`),
      icon: Lock,
    },
  ];
};

export const PRIVACY_FIELDS = (t: TFunction) => [
  { name: "email", label: t("common.email_visibility"), field: "email" },
  { name: "gender", label: t("common.gender_visibility"), field: "gender" },
  { name: "avatar", label: t("common.avatar_visibility"), field: "avatar" },
  { name: "birthdayDate", label: t("common.birthday_date_visibility"), field: "birthdayDate" },
  { name: "bio", label: t("common.bio_visibility"), field: "bio" },
  {
    name: "location",
    label: t("common.location_visibility"),
    field: "location",
  },
  {
    name: "socialLinks",
    label: t("common.social_visibility"),
    field: "socialLinks",
  },
  {
    name: "lastSeen",
    label: t("common.last_seen_visibility"),
    field: "lastSeen",
  },
];

export const initialState = (data: IPrivacySettings): IEditPrivacySettings => {
  const {
    _id,
    email,
    bio,
    gender,
    location,
    socialLinks,
    lastSeen,
    avatar,
    messageRequest,
    birthdayDate,
    friendshipRequest,
    readReceipts
  } = data;

  const initialState = {
    _id,
    email,
    bio,
    gender,
    location,
    socialLinks,
    lastSeen,
    avatar,
    messageRequest,
    birthdayDate,
    friendshipRequest,
    readReceipts
  };

  return initialState;
};

export const validatePrivacySettings = (
  values: IEditPrivacySettings,
  t: TFunction
): void => {
  const {
    email,
    bio,
    gender,
    location,
    socialLinks,
    lastSeen,
    avatar,
    messageRequest,
    birthdayDate,
  } = values;

  const valuesArray = [
    email,
    bio,
    gender,
    location,
    socialLinks,
    lastSeen,
    avatar,
    messageRequest,
    birthdayDate,
  ];

  valuesArray.forEach((val) => {
    if (val && !Object.values(PRIVACY_SETTINGS_CHOICE).includes(val)) {
      snack.error(t("error_messages.invalid_choice"));
      return;
    }
  });
};
