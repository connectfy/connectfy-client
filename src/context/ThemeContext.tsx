import { LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useGetGeneralSettingsQuery } from "@/modules/settings/GeneralSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetMeQuery } from "@/modules/profile/api/api";

interface ThemeContextType {
  theme: THEME;
  toggleTheme: (theme: THEME) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { access_token } = useAuthStore();
  const { isSuccess: isMeSuccess, isError: isMeError } = useGetMeQuery(
    undefined,
    {
      skip: !access_token,
    },
  );

  const { data } = useGetGeneralSettingsQuery(undefined, {
    skip: !access_token || !isMeSuccess || isMeError,
  });

  const [theme, setTheme] = useState<THEME>(() => {
    const localTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME);

    if (!localTheme) return THEME.LIGHT;

    if (!["light", "dark", "device"].includes(localTheme)) return THEME.LIGHT;

    return localTheme as THEME;
  });

  const getDeviceTheme = (): THEME => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return THEME.DARK;
    }
    return THEME.LIGHT;
  };

  useEffect(() => {
    if (theme !== THEME.DEVICE) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const deviceTheme = e.matches ? THEME.DARK : THEME.LIGHT;
      document.documentElement.setAttribute("data-theme", deviceTheme);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (data?.theme) {
      setTheme(data.theme as THEME);
    }
  }, [data?.theme]);

  useEffect(() => {
    const actualTheme = theme === THEME.DEVICE ? getDeviceTheme() : theme;

    document.documentElement.setAttribute(
      "data-theme",
      actualTheme.toLocaleLowerCase(),
    );

    if (data?.theme) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.APP_THEME);
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, theme);
    }
  }, [theme, data?.theme]);

  const toggleTheme = (newTheme: THEME): void => setTheme(newTheme);

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
