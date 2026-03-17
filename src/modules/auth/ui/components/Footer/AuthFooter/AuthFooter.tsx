import { LANGUAGE, THEME } from "@/common/enums/enums";
import SelectionModal from "@/components/Modal/SelectionModal/SelectionModal";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTheme } from "@/context/ThemeContext";
import useBoolean from "@/hooks/useBoolean";
import { Globe, Moon, Sun } from "lucide-react";
import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

const AuthFooter = () => {
  const { i18n, t } = useTranslation();

  const screenWidth = window.innerWidth;

  const { theme, toggleTheme } = useTheme();
  const { open, onOpen, onClose } = useBoolean();

  const getButtonClass = (isActive: boolean) =>
    `cursor-pointer flex items-center justify-center rounded-xl duration-300 w-10 h-10 border transition-colors ${
      isActive
        ? "bg-[#34d399] border-[#34d399] text-white shadow-[0_4px_14px_0_rgba(52,211,153,0.39)]"
        : "bg-(--input-bg) border-(--input-border) text-(--text-secondary) hover:border-[#34d399]/30 hover:text-(--text-(--primary-color))"
    }`;

  const language = i18n.language;

  const languageList = [
    {
      name: "English",
      value: LANGUAGE.EN,
      icon: Globe,
      key: "EN",
      onClick: () => i18n.changeLanguage(LANGUAGE.EN),
    },
    {
      name: "Azərbaycan",
      value: LANGUAGE.AZ,
      icon: Globe,
      key: "AZ",
      onClick: () => i18n.changeLanguage(LANGUAGE.AZ),
    },
    {
      name: "Русский",
      value: LANGUAGE.RU,
      icon: Globe,
      key: "RU",
      onClick: () => i18n.changeLanguage(LANGUAGE.RU),
    },
    {
      name: "Türkçe",
      value: LANGUAGE.TR,
      icon: Globe,
      key: "TR",
      onClick: () => i18n.changeLanguage(LANGUAGE.TR),
    },
  ];

  const renderCurrentLanguage = useCallback(() => {
    const currentLanguage = languageList.find(
      (lang) => lang.value === language,
    );

    if (screenWidth < 1024) {
      return currentLanguage?.key;
    }

    return currentLanguage?.name;
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
            icon={<Globe size={15} />}
            title={renderCurrentLanguage()}
            hideTitleInMobile={false}
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
              <Sun
                size={20}
                className={`${theme === THEME.LIGHT ? "font-bold" : ""}`}
              />
            }
          />
          <Button
            type="button"
            className={getButtonClass(theme === THEME.DARK)}
            onClick={() => toggleTheme(THEME.DARK)}
            aria-pressed={theme === THEME.DARK}
            tooltip={t("common.dark_theme")}
            icon={
              <Moon
                size={20}
                className={`${theme === THEME.DARK ? "font-bold" : ""}`}
              />
            }
          />
        </div>
      </div>

      <SelectionModal
        open={open}
        onClose={onClose}
        title={t("common.change_lang")}
        selections={languageList}
        activeKey={(language as string).toUpperCase()}
      />
    </Fragment>
  );
};

export default AuthFooter;
