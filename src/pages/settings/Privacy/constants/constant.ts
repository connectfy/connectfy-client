import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";
import { TFunction } from "i18next";
import { Eye, UserCheck, Lock } from "lucide-react";
import { useState } from "react";

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

export const privacySections = (t: TFunction) => {
  const [emailKey, setEmailKey] = useState(PRIVACY_SETTINGS_CHOICE.NOBODY);
  const [genderKey, setGenderKey] = useState(PRIVACY_SETTINGS_CHOICE.EVERYONE);
  const [bioKey, setBioKey] = useState(PRIVACY_SETTINGS_CHOICE.EVERYONE);
  const [locationKey, setLocationKey] = useState(
    PRIVACY_SETTINGS_CHOICE.EVERYONE
  );
  const [socialKey, setSocialKey] = useState(PRIVACY_SETTINGS_CHOICE.EVERYONE);
  const [lastSeenKey, setLastSeenKey] = useState(
    PRIVACY_SETTINGS_CHOICE.EVERYONE
  );

  return [
    {
      label: t("common.email_visibility"),
      key: emailKey,
      setter: setEmailKey,
    },
    {
      label: t("common.gender_visibility"),
      key: genderKey,
      setter: setGenderKey,
    },
    {
      label: t("common.bio_visibility"),
      key: bioKey,
      setter: setBioKey,
    },
    {
      label: t("common.location_visibility"),
      key: locationKey,
      setter: setLocationKey,
    },
    {
      label: t("common.social_visibility"),
      key: socialKey,
      setter: setSocialKey,
    },
    {
      label: t("common.last_seen_visibility"),
      key: lastSeenKey,
      setter: setLastSeenKey,
    },
  ];
};
