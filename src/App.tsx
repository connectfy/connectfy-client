import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import routes from "@/routes/router";
import { useRoutes } from "react-router-dom";
import "@/styles/index.css";
import "flag-icons/css/flag-icons.min.css";
import { checkDeviceId } from "./common/utils/checkDevice";
import { useGetGeneralSettingsQuery } from "./modules/settings/GeneralSettings/api/api";
import { useAuthTokenManager } from "./common/helpers/authToken.manager";
import { useGetNotificationSettingsQuery } from "./modules/settings/NotificationSettings/api/api";
import { useTheme } from "./context/ThemeContext";
import { useGetMeQuery } from "./modules/profile/api/api";

function App() {
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const { toggleTheme } = useTheme();
  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
  const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  const { isSuccess: isMeSuccess, isError: isMeError } = useGetMeQuery(
    undefined,
    {
      skip: !access_token,
    },
  );

  const { data } = useGetGeneralSettingsQuery(undefined, {
    skip: !access_token || !isMeSuccess || isMeError,
  });
  useGetNotificationSettingsQuery(undefined, {
    skip: !access_token || !isMeSuccess || isMeError,
  });
  const userLang = data?.language;
  const userTheme = data?.theme;

  useEffect(() => {
    if (!access_token || !isMeSuccess || isMeError) {
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
    if (userTheme) {
      toggleTheme(userTheme);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.APP_THEME);
    }
  }, [userTheme]);

  useEffect(() => {
    checkDeviceId();
  }, [deviceId]);

  return <>{content}</>;
}

export default App;
