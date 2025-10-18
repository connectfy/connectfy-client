// import { useRoutes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { LANGUAGE } from "./types/enum.types";
import routes from "@/routes/router";
import { useRoutes } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setAccessToken } from "@/features/auth/authSlice";
import "@/styles/index.css";
import "flag-icons/css/flag-icons.min.css";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();
  const content = useRoutes(routes);
  const lang = localStorage.getItem("lang");

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
      dispatch(setAccessToken(access_token));
    }
  }, [dispatch]);

useEffect(() => {
    const availableLangs = Object.values(LANGUAGE);

    const validLang =
      lang && availableLangs.includes(lang as LANGUAGE)
        ? (lang as LANGUAGE)
        : LANGUAGE.EN;

    i18n.changeLanguage(validLang);
    localStorage.setItem("lang", validLang);
  }, [lang, i18n]);

  return (
    <>
      {content}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        aria-label="notification"
      />
    </>
  );
}

export default App;
