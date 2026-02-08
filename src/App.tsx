import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import routes from "@/routes/router";
import { useRoutes } from "react-router-dom";
import "@/styles/index.css";
import "flag-icons/css/flag-icons.min.css";
import { checkDeviceId } from "./common/utils/checkDevice";
import { useGetGeneralSettingsQuery } from "./modules/settings/GeneralSettings/api/api";
import { authTokenManager } from "./common/helpers/authToken.manager";
import { useGetPrivacySettingsQuery } from "./modules/settings/PrivacySettings/api/api";
import { useGetNotificationSettingsQuery } from "./modules/settings/NotificationSettings/api/api";

function App() {
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
  const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
  const access_token = authTokenManager.getToken("accessToken");

  const { data } = useGetGeneralSettingsQuery(undefined, {
    skip: !access_token,
  });
  useGetPrivacySettingsQuery(undefined, {
    skip: !access_token,
  });
  useGetNotificationSettingsQuery(undefined, {
    skip: !access_token,
  });
  const userLang = data?.language;

  useEffect(() => {
    if (userLang) {
      i18n.changeLanguage(userLang);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LANG);
      return;
    }

    const availableLangs = Object.values(LANGUAGE);

    const validLang =
      lang && availableLangs.includes(lang as LANGUAGE)
        ? (lang as LANGUAGE)
        : LANGUAGE.EN;

    i18n.changeLanguage(validLang);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, validLang);
  }, [lang, i18n, userLang]);

  useEffect(() => {
    checkDeviceId();
  }, [deviceId]);

  return <>{content}</>;
}

export default App;
