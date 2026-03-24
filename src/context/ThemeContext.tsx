import { LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { generalSettingsApi } from "@/modules/settings/GeneralSettings/api/api";

interface ThemeContextType {
  theme: THEME;
  toggleTheme: (theme: THEME) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Redux-dan API theme-i oxu (login olduqdan sonra gəlir)
  const apiTheme = useSelector(
    (state: any) =>
      generalSettingsApi.endpoints.getGeneralSettings.select(undefined)(state)
        ?.data?.theme as THEME | undefined,
  );

  // LocalStorage-dan fallback — API gəlməmişdən əvvəl işləyir (login yoxdur vs.)
  const [localTheme, setLocalTheme] = useState<THEME>(
    () =>
      (localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME) as THEME) ||
      THEME.LIGHT,
  );

  // API theme gəldikdə local state-i sinxronlaşdır
  useEffect(() => {
    if (apiTheme) {
      setLocalTheme(apiTheme);
      localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, apiTheme);
    }
  }, [apiTheme]);

  // Aktiv theme: API varsa onu, yoxdursa local-ı götür
  const theme = apiTheme ?? localTheme;

  useEffect(() => {
    const applyTheme = (targetTheme: THEME) => {
      const actual =
        targetTheme === THEME.DEVICE
          ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? THEME.DARK
            : THEME.LIGHT
          : targetTheme;

      document.documentElement.setAttribute("data-theme", actual.toLowerCase());
    };

    applyTheme(theme);

    if (theme === THEME.DEVICE) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme(THEME.DEVICE);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  // toggleTheme artıq local state-i yeniləyir
  // API update-i settings səhifəsindəki mutation həll edir
  const toggleTheme = (newTheme: THEME) => {
    setLocalTheme(newTheme);
    localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
