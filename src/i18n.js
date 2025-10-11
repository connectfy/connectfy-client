import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "connectfy-i18n";

i18n.use(initReactI18next).init({
  resources: {
    en: resources.en,
    az: resources.az,
    ru: resources.ru,
    tr: resources.tr,
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
