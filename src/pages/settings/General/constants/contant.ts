import { LANGUAGE } from "@/types/enum.types";
import { i18n, TFunction } from "i18next";
import {
  Bell,
  Globe,
  MessageCircle,
  Radio,
  User,
  UserCircle,
  Users,
} from "lucide-react";
import { useState } from "react";

export const languageOptions = (t: TFunction, i18n: i18n) => {
  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as LANGUAGE)
    : LANGUAGE.EN;

  const handleLanguageChange = (code: LANGUAGE) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  return {
    title: t("common.language_selection"),
    activeKey: lang as string,
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

export const homepageOptions = (t: TFunction) => {
  const [homepageKey, setHomepageKey] = useState("messenger");

  return {
    title: t("common.homepage"),
    activeKey: homepageKey,
    selections: [
      {
        key: "messenger",
        name: t("common.messenger"),
        title: t("common.messenger"),
        icon: MessageCircle,
        onClick: () => setHomepageKey("messenger"),
      },
      {
        key: "groups",
        name: t("common.groups"),
        title: t("common.groups"),
        icon: Users,
        onClick: () => setHomepageKey("groups"),
      },
      {
        key: "channels",
        name: t("common.channels"),
        title: t("common.channels"),
        icon: Radio,
        onClick: () => setHomepageKey("channels"),
      },
      {
        key: "users",
        name: t("common.users"),
        title: t("common.users"),
        icon: UserCircle,
        onClick: () => setHomepageKey("users"),
      },
      {
        key: "notifications",
        name: t("common.notifications"),
        title: t("common.notifications"),
        icon: Bell,
        onClick: () => setHomepageKey("notifications"),
      },
      {
        key: "my_profile",
        name: t("common.my_profile"),
        title: t("common.my_profile"),
        icon: User,
        onClick: () => setHomepageKey("my_profile"),
      },
    ],
  };
};
