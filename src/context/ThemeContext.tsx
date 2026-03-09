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

  // 1. İlkin dəyəri hər zaman LocalStorage-dan götürürük
  const [theme, setTheme] = useState<THEME>(() => {
    const localTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.APP_THEME);
    return (localTheme as THEME) || THEME.LIGHT;
  });

  // 2. API-dən data gələndə state-i və localStorage-ı yeniləyirik
  useEffect(() => {
    if (data?.theme) {
      setTheme(data.theme as THEME);
      localStorage.setItem(LOCAL_STORAGE_KEYS.APP_THEME, data.theme);
    }
  }, [data?.theme]);

  // 3. Mövzunu tətbiq edirik (Body-yə attribute veririk)
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

    // Əgər mövzu "device" seçilibsə, sistem dəyişikliklərini izləyirik
    if (theme === THEME.DEVICE) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme(THEME.DEVICE);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  const toggleTheme = (newTheme: THEME) => {
    setTheme(newTheme);
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
