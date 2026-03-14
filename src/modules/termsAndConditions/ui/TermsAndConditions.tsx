import "./termsAndConditions.style.css";
import { useCallback, useState, Fragment } from "react";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";
import SelectionModal from "@/components/Modal/SelectionModal/SelectionModal";
import Input from "@/components/ui/CustomInput/Input/Input";
import Button from "@/components/ui/CustomButton/Button/Button";
import { Globe, ClipboardList, ClipboardCheck } from "lucide-react";

const TermsAndConditions = () => {
  const { i18n, t } = useTranslation();

  const lang = i18n.language;

  const [openLangModal, setOpenLangModal] = useState<boolean>(false);

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

  const renderLangIcon = useCallback(() => {
    switch (lang) {
      case LANGUAGE.AZ:
        return <span className="fi fi-az"></span>;
      case LANGUAGE.TR:
        return <span className="fi fi-tr"></span>;
      case LANGUAGE.RU:
        return <span className="fi fi-ru"></span>;
      default:
        return <span className="fi fi-gb"></span>;
    }
  }, [lang]);

  const [copied, setCopied] = useState(false);
  const email = "connectfy.team@gmail.com";

  const handleCopy = () => {
    window.navigator.clipboard.writeText(email);
    setCopied(true);

    if (typeof snack !== "undefined") {
      snack.success(t("common.email_copied"));
    }

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Fragment>
      <Tooltip placement="top" title={t("common.change_lang")}>
        <div className="lang-switcher" onClick={() => setOpenLangModal(true)}>
          {renderLangIcon()}
        </div>
      </Tooltip>

      <main className="terms-container">
        <h1 className="terms-title">{t("terms.main_title")}</h1>

        <section className="terms-section">
          <h2>{t("terms.section_1_title")}</h2>
          <p>{t("terms.section_1_p1")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_2_title")}</h2>
          <p>{t("terms.section_2_p1")}</p>
          <p>{t("terms.section_2_p2")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_3_title")}</h2>
          <p>{t("terms.section_3_p1")}</p>
          <p>{t("terms.section_3_p2")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_4_title")}</h2>
          <p>{t("terms.section_4_p1")}</p>
          <p>{t("terms.section_4_p2")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_5_title")}</h2>
          <p>{t("terms.section_5_p1")}</p>
          <ul>
            <li>{t("terms.section_5_list_1")}</li>
            <li>{t("terms.section_5_list_2")}</li>
            <li>{t("terms.section_5_list_3")}</li>
          </ul>
          <p>{t("terms.section_5_p2")} </p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_6_title")}</h2>
          <p>{t("terms.section_6_p1")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_7_title")}</h2>
          <p>{t("terms.section_7_p1")}</p>
          <p>{t("terms.section_7_p2")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_8_title")}</h2>
          <p>{t("terms.section_8_p1")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_9_title")}</h2>
          <p>{t("terms.section_9_p1")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_10_title")}</h2>
          <p>{t("terms.section_10_p1")}</p>
        </section>

        <section className="terms-section">
          <h2>{t("terms.section_11_title")}</h2>
          <p>{t("terms.section_11_p1")}</p>
          <div className="">
            <div className="relative">
              <label htmlFor="email-copy-text" className="sr-only">
                Email
              </label>
              <Input
                inputSize="medium"
                id="email-copy-text"
                type="text"
                className="col-span-6 border text-sm rounded-lg block w-full px-3 py-2.5 shadow-sm focus:outline-none bg-(--input-bg) border-(--input-border) text-(--text-primary)"
                value={email}
                // disabled
                readOnly
              />
              <Button
                onClick={handleCopy}
                className="absolute flex items-center end-1.5 top-1/2 -translate-y-1/2 border font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none transition-colors bg-(--primary-color) text-(--text-primary) border-(--auth-glass-border)"
              >
                {!copied ? (
                  <ClipboardList color={"white"} />
                ) : (
                  <ClipboardCheck color={"white"} />
                )}
              </Button>
            </div>
          </div>
        </section>

        <footer className="terms-footer">
          <p>{t("terms.footer_text")}</p>
        </footer>
      </main>

      <SelectionModal
        open={openLangModal}
        onClose={() => setOpenLangModal(false)}
        title={t("common.change_lang")}
        selections={languageList}
        activeKey={(lang as string).toUpperCase()}
      />
    </Fragment>
  );
};

export default TermsAndConditions;
