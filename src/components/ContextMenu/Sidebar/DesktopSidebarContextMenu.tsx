import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SunMoon,
  ChevronLeft,
  Sun,
  Moon,
  MonitorSmartphone,
  Languages,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ContextMenuItem from "../ContextMenuItem";
import { useEditGeneralSettingsMutation } from "@/modules/settings/GeneralSettings/api/api";
import { useErrors } from "@/hooks/useErrors";
import { useTheme } from "@/context/ThemeContext";
import { LANGUAGE, THEME } from "@/common/enums/enums";
import { useGeneralSettings } from "@/modules/settings/GeneralSettings/hooks/useGeneralSettings";

// Menyular arası keçid üçün tiplər
type MenuView = "main" | "theme" | "language";

const DesktopSidebarContextMenu: FC = () => {
  const { t, i18n } = useTranslation();
  const { showResponseErrors } = useErrors();
  const { theme, toggleTheme } = useTheme();

  const { generalSettings } = useGeneralSettings();
  const [updateGeneralSettings] = useEditGeneralSettingsMutation();

  // Hansı menyunun açıq olduğunu izləyən state
  const [currentView, setCurrentView] = useState<MenuView>("main");

  const handleChangeTheme = async (appTheme: THEME) => {
    try {
      if (theme === appTheme || !generalSettings) return;

      toggleTheme(appTheme);
      await updateGeneralSettings({
        _id: generalSettings._id,
        theme: appTheme,
      }).unwrap();
    } catch (error) {
      toggleTheme(generalSettings?.theme as THEME);
      showResponseErrors(error);
    }
  };

  const handleChangeLanguage = async (language: LANGUAGE) => {
    try {
      if (language === generalSettings?.language || !generalSettings) return;

      i18n.changeLanguage(language);
      await updateGeneralSettings({
        _id: generalSettings._id,
        language,
      }).unwrap();
    } catch (error) {
      i18n.changeLanguage(generalSettings?.language as LANGUAGE);
      showResponseErrors(error);
    }
  };

  // Alt-menyulara keçid animasiyaları
  const viewVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col min-w-[220px] bg-(--bg-color) rounded-2xl shadow-2xl overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {/* ƏSAS MENYU */}
        {currentView === "main" && (
          <motion.div
            key="main"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={viewVariants}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <ContextMenuItem
              icon={SunMoon}
              label={t("common.change_theme")}
              onClick={() => setCurrentView("theme")}
            />
            <ContextMenuItem
              icon={Languages}
              className={
                theme === THEME.LIGHT
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={theme === THEME.LIGHT ? "text-white!" : undefined}
              label={t("common.change_lang")}
              onClick={() => setCurrentView("language")}
            />
          </motion.div>
        )}

        {/* THEME MENYUSU */}
        {currentView === "theme" && (
          <motion.div
            key="theme"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={viewVariants}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <div className="border-b border-white/10 mb-1 pb-1">
              <ContextMenuItem
                icon={ChevronLeft}
                label={t("common.back", "Back")}
                onClick={() => setCurrentView("main")}
              />
            </div>

            <ContextMenuItem
              icon={Sun}
              label={
                <div className="flex items-center justify-between w-full">
                  {t(`enum.${THEME.LIGHT}`)}
                </div>
              }
              onClick={() => handleChangeTheme(THEME.LIGHT)}
              className={
                theme === THEME.LIGHT
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={theme === THEME.LIGHT ? "text-white!" : undefined}
            />
            <ContextMenuItem
              icon={Moon}
              label={
                <div className={`flex items-center justify-between w-full`}>
                  {t(`enum.${THEME.DARK}`)}
                </div>
              }
              onClick={() => handleChangeTheme(THEME.DARK)}
              className={
                theme === THEME.DARK
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={theme === THEME.DARK ? "text-white!" : undefined}
            />
            <ContextMenuItem
              icon={MonitorSmartphone}
              label={
                <div className="flex items-center justify-between w-full">
                  {t(`enum.${THEME.DEVICE}`)}
                </div>
              }
              onClick={() => handleChangeTheme(THEME.DEVICE)}
              className={
                theme === THEME.DEVICE
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={theme === THEME.DEVICE ? "text-white!" : undefined}
            />
          </motion.div>
        )}

        {/* LANGUAGE MENYUSU */}
        {currentView === "language" && (
          <motion.div
            key="language"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={viewVariants}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full"
          >
            <div className="border-b border-white/10 mb-1 pb-1">
              <ContextMenuItem
                icon={ChevronLeft}
                label={t("common.back", "Back")}
                onClick={() => setCurrentView("main")}
              />
            </div>

            <ContextMenuItem
              label={
                <div className="flex items-center justify-between w-full">
                  English (EN)
                </div>
              }
              onClick={() => handleChangeLanguage(LANGUAGE.EN)}
              icon={Languages}
              className={
                i18n.language === LANGUAGE.EN
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={
                i18n.language === LANGUAGE.EN ? "text-white!" : undefined
              }
            />
            <ContextMenuItem
              label={
                <div className="flex items-center justify-between w-full">
                  Azərbaycan (AZ)
                </div>
              }
              onClick={() => handleChangeLanguage(LANGUAGE.AZ)}
              icon={Languages}
              className={
                i18n.language === LANGUAGE.AZ
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={
                i18n.language === LANGUAGE.AZ ? "text-white!" : undefined
              }
            />
            <ContextMenuItem
              label={
                <div className="flex items-center justify-between w-full">
                  Русский (RU)
                </div>
              }
              onClick={() => handleChangeLanguage(LANGUAGE.RU)}
              icon={Languages}
              className={
                i18n.language === LANGUAGE.RU
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={
                i18n.language === LANGUAGE.RU ? "text-white!" : undefined
              }
            />
            <ContextMenuItem
              label={
                <div className="flex items-center justify-between w-full">
                  Türkçe (TR)
                </div>
              }
              onClick={() => handleChangeLanguage(LANGUAGE.TR)}
              icon={Languages}
              className={
                i18n.language === LANGUAGE.TR
                  ? "bg-(--primary-color)/70 text-white! font-semibold hover:bg-(--primary-color)/70!"
                  : undefined
              }
              iconClassName={
                i18n.language === LANGUAGE.TR ? "text-white!" : undefined
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DesktopSidebarContextMenu;
