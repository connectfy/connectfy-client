import "./termsAndConditions.style.css";
import { useCallback, useState, Fragment } from "react";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LANGUAGE } from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";
import { Globe } from "lucide-react";
import SelectionModal from "@/components/Modal/SelectionModal/SelectionModal";

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
          <Tooltip title={t("terms.contact_email_text")} placement="top">
            <p
              className="contact-email"
              onClick={() => {
                window.navigator.clipboard.writeText(
                  "connectfy.team@gmail.com",
                );

                snack.success(t("common.email_copied"));
              }}
            >
              connectfy.team@gmail.com
            </p>
          </Tooltip>
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
