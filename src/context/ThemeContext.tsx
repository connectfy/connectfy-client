import { useAppSelector } from "@/hooks/useStore";
import { Resource, THEME } from "@/types/enum.types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: THEME;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { data } = useAppSelector((state) => state[Resource.generalSettings]);

  const [theme, setTheme] = useState<THEME>(() => {
    const localTheme = localStorage.getItem("app-theme");

    if (!localTheme) return THEME.LIGHT;

    if (!["light", "dark"].includes(localTheme)) return THEME.LIGHT;

    return localTheme as THEME;
  });

  useEffect(() => {
    if (data?.theme) {
      setTheme(data.theme);
    }
  }, [data?.theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    if (data?.theme) {
      localStorage.removeItem("app-theme");
    } else {
      localStorage.setItem("app-theme", theme);
    }
  }, [theme, data?.theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
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
