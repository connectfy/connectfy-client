import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGE, LOCAL_STORAGE_KEYS, RESOURCE } from "@/common/enums/enums";
import routes from "@/routes/router";
import { useRoutes } from "react-router-dom";
import "@/styles/index.css";
import "flag-icons/css/flag-icons.min.css";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";
import { setAccessToken } from "./modules/auth/api/api";
import { checkDeviceId } from "./common/utils/checkDevice";

function App() {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);
  const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);
  const access_token = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  const { data } = useAppSelector((state) => state[RESOURCE.GENERAL_SETTINGS]);
  const userLang = data?.language;

  useEffect(() => {
    if (access_token) {
      dispatch(setAccessToken(access_token));
    }
  }, [dispatch, access_token]);

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
