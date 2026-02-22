import { LOCAL_STORAGE_KEYS, THEME } from "@/common/enums/enums";
import LanguageModal from "@/components/Modal/LanguageModal/LanguageModal";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTheme } from "@/context/ThemeContext";
import useBoolean from "@/hooks/useBoolean";
import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

const AuthFooter = () => {
  const { t } = useTranslation();

  const screenWidth = window.innerWidth;

  const { theme, toggleTheme } = useTheme();
  const { open, onOpen, onClose } = useBoolean();

  const getButtonClass = (isActive: boolean) =>
    `cursor-pointer flex items-center justify-center rounded-xl duration-300 w-10 h-10 border transition-colors ${
      isActive
        ? "bg-[#34d399] border-[#34d399] text-white shadow-[0_4px_14px_0_rgba(52,211,153,0.39)]"
        : "bg-(--input-bg) border-(--input-border) text-(--text-secondary) hover:border-[#34d399]/30 hover:text-(--text-(--primary-color))"
    }`;

  const language = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG);

  const languageList = [
    {
      key: "US",
      label: "English (US)",
      value: "en",
    },
    {
      key: "AZ",
      label: "Azərbaycan (AZ)",
      value: "az",
    },
    {
      key: "RU",
      label: "Русский (RU)",
      value: "ru",
    },
    {
      key: "TR",
      label: "Türkçe (TR)",
      value: "tr",
    },
  ];

  const renderCurrentLanguage = useCallback(() => {
    const currentLanguage = languageList.find(
      (lang) => lang.value === language,
    );

    if (screenWidth < 1024) {
      return currentLanguage?.key;
    }

    return currentLanguage?.label;
  }, [language, screenWidth]);

  return (
    <Fragment>
      <div className="pt-8 pb-0 md:pb-8 flex items-center justify-between border-t border-(--input-border)">
        <div className="flex gap-4">
          <Button
            type="button"
            className="cursor-pointer flex items-center gap-1.5 text-xs font-medium text-(--text-secondary) hover:text-(--text-(--primary-color)) transition-colors"
            onClick={onOpen}
            tooltip={t("common.change_lang")}
            icon={
              <span className="material-symbols-outlined text-sm">globe</span>
            }
            title={renderCurrentLanguage()}
          />
        </div>
        <div className="flex gap-3 items-center">
          <Button
            type="button"
            className={getButtonClass(theme === THEME.LIGHT)}
            onClick={() => toggleTheme(THEME.LIGHT)}
            aria-pressed={theme === THEME.LIGHT}
            tooltip={t("common.light_theme")}
            icon={
              <span
                className={`material-symbols-outlined ${
                  theme === THEME.LIGHT ? "font-bold" : ""
                }`}
                style={{ fontSize: "20px" }}
              >
                light_mode
              </span>
            }
          />
          <Button
            type="button"
            className={getButtonClass(theme === THEME.DARK)}
            onClick={() => toggleTheme(THEME.DARK)}
            aria-pressed={theme === THEME.DARK}
            tooltip={t("common.dark_theme")}
            icon={
              <span
                className={`material-symbols-outlined ${
                  theme === THEME.DARK ? "font-bold" : ""
                }`}
                style={{ fontSize: "20px" }}
              >
                dark_mode
              </span>
            }
          />
        </div>
      </div>

      <LanguageModal open={open} onClose={onClose} />
    </Fragment>
  );
};

export default AuthFooter;
