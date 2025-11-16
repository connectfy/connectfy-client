import { THEME } from "@/types/enum.types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: THEME;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<THEME>(setThemeFunc());

  function setThemeFunc() {
    const theme = localStorage.getItem("app-theme");

    if (!theme) return THEME.LIGHT;

    if (!Object.values(["light", "dark"]).includes(theme)) return THEME.LIGHT;

    return theme as THEME;
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app-theme", theme);
  }, [theme]);

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
