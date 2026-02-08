import "./bio.style.css";
import { Edit2, MinusIcon } from "lucide-react";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { useTranslation } from "react-i18next";
import { IMe } from "@/modules/profile/types/types";
import { useGetMeQuery } from "@/modules/profile/api/api";

const Bio = () => {
  const { t } = useTranslation();

  const { data: profile } = useGetMeQuery();
  const { account, settings } = profile as IMe;
  const { privacySettings } = settings;

  return (
    <section className="profile-page-section" aria-labelledby="bio-heading">
      <div className="profile-page-section-header">
        <h2 id="bio-heading" className="profile-page-section-title">
          {t("common.bio")}
        </h2>

        <div className="profile-page-section-actions">
          <PrivacyIcon privacy={privacySettings.bio} fieldName="bio" />
          <button
            className="profile-edit-button"
            aria-label="Edit personal information"
          >
            <Edit2 size={16} />
            <span>{t("common.edit")}</span>
          </button>
        </div>
      </div>
      <p className="profile-bio">{account.bio ?? <MinusIcon />}</p>
    </section>
  );
};

export default Bio;
