import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGE, Resource } from "./types/enum.types";
import routes from "@/routes/router";
import { useRoutes } from "react-router-dom";
import { setAccessToken } from "@/features/auth/authSlice";
import "@/styles/index.css";
import "flag-icons/css/flag-icons.min.css";
import { useAppDispatch, useAppSelector } from "./hooks/useStore";

function App() {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const lang = localStorage.getItem("lang");

  const { data } = useAppSelector((state) => state[Resource.generalSettings]);
  const userLang = data?.language;
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    if (access_token) {
      dispatch(setAccessToken(access_token));
    }
  }, [dispatch, access_token]);

  useEffect(() => {
    if (userLang) {
      i18n.changeLanguage(userLang);
      localStorage.removeItem("lang");
      return;
    }

    const availableLangs = Object.values(LANGUAGE);

    const validLang =
      lang && availableLangs.includes(lang as LANGUAGE)
        ? (lang as LANGUAGE)
        : LANGUAGE.EN;

    i18n.changeLanguage(validLang);
    localStorage.setItem("lang", validLang);
  }, [lang, i18n, userLang]);

  return <>{content}</>;
}

export default App;
