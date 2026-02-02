import React from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGE, LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import Modal from "..";
import CloseButton from "@/components/ui/CustomButton/CloseButton/CloseButton";

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
}

const languages: { code: LANGUAGE; label: string }[] = [
  { code: LANGUAGE.EN, label: "English (US)" },
  { code: LANGUAGE.AZ, label: "Azərbaycan (AZ)" },
  { code: LANGUAGE.TR, label: "Türkçe (TR)" },
  { code: LANGUAGE.RU, label: "Русский (RU)" },
];

const LanguageModal: React.FC<LanguageModalProps> = ({ open, onClose }) => {
  const { i18n, t } = useTranslation();

  const lang = localStorage.getItem(LOCAL_STORAGE_KEYS.LANG)
    ? (localStorage.getItem(LOCAL_STORAGE_KEYS.LANG) as LANGUAGE)
    : LANGUAGE.EN;

  const handleLanguageChange = (code: LANGUAGE) => {
    i18n.changeLanguage(code);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANG, code);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-(--bg-color) text-(--text-color) rounded-xl w-full max-w-[400px] overflow-hidden outline-none animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-4 border-b border-(--input-border)">
          <h2 className="text-xl font-bold m-0 ml-2">
            {t("common.select_lang")}
          </h2>
          <CloseButton onClick={onClose} />
        </div>

        {/* Language List */}
        <div className="p-0">
          {languages.map(({ code, label }) => (
            <label
              key={code}
              className={`
                flex items-center justify-between w-full px-5 py-4 cursor-pointer transition-all duration-200
                ${
                  lang === code
                    ? "bg-(--primary-color) text-white"
                    : "bg-transparent text-(--text-color) hover:bg-(--hover-bg) hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="min-w-[40px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">
                    globe
                  </span>
                </div>
                <span
                  className={`text-base ${
                    lang === code ? "font-semibold" : "font-normal"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Custom Radio Button */}
              <input
                type="radio"
                name="language"
                value={code}
                checked={lang === code}
                onChange={() => handleLanguageChange(code)}
                className="sr-only"
              />
              <div
                className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                  ${lang === code ? "border-white" : "border-(--input-border)"}
                `}
              >
                {lang === code && (
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-scaleIn" />
                )}
              </div>
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default LanguageModal;
