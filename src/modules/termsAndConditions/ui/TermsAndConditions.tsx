import "./termsAndConditions.style.css";
import { useCallback, useState, Fragment } from "react";
import { Tooltip } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageModal from "@/components/Modal/LanguageModal";
import { LANGUAGE } from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const lang = localStorage.getItem("lang")
    ? (localStorage.getItem("lang") as LANGUAGE)
    : LANGUAGE.EN;

  const [openLangModal, setOpenLangModal] = useState<boolean>(false);

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
                  "connectfy.team@gmail.com"
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

      <LanguageModal
        open={openLangModal}
        onClose={() => setOpenLangModal(false)}
      />
    </Fragment>
  );
};

export default TermsAndConditions;
