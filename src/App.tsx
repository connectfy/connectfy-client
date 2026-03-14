import "@/styles/index.css";
import { useEffect } from "react";
import routes from "@/routes/router";
import { initFlowbite } from "flowbite";
import "flag-icons/css/flag-icons.min.css";
import { useRoutes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "./modules/profile/hooks/useUser";
import { checkDeviceId } from "./common/utils/checkValues";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import { useGeneralSettings } from "./modules/settings/GeneralSettings/hooks/useGeneralSettings";
import { useNotificationSettings } from "./modules/settings/NotificationSettings/hooks/useNotificationSettings";
import { useAuthStore } from "./hooks/useAuthStore";

function App() {
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
  const deviceId = checkDeviceId();
  const { access_token } = useAuthStore();

  const { isSuccess, isError } = useUser();

  const { data } = useGeneralSettings();
  useNotificationSettings();
  const userLang = data?.language;

  useEffect(() => {
    if (!access_token || !isSuccess || isError) {
      const availableLangs = Object.values(LANGUAGE);
      const validLang =
        lang && availableLangs.includes(lang as LANGUAGE)
          ? (lang as LANGUAGE)
          : LANGUAGE.EN;

      i18n.changeLanguage(validLang);
      localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, validLang);
      return;
    }

    if (userLang && access_token) {
      i18n.changeLanguage(userLang);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LANG);
    }
  }, [lang, i18n, userLang, access_token]);

  useEffect(() => {
    checkDeviceId();
  }, [deviceId]);

  useEffect(() => {
    initFlowbite();
  }, []);

  return <>{content}</>;
}

export default App;
