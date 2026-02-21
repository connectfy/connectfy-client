import "./bio.style.css";
import { Edit2, MinusIcon } from "lucide-react";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { useTranslation } from "react-i18next";
import { useGetAccountQuery } from "@/modules/profile/api/api";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";
import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";

const Bio = () => {
  const { t } = useTranslation();
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  const { data: account } = useGetAccountQuery(undefined, {
    skip: !access_token,
  });
  const { data: privacySettings } = useGetPrivacySettingsQuery(undefined, {
    skip: !access_token,
  });

  return (
    <section className="profile-page-section" aria-labelledby="bio-heading">
      <div className="profile-page-section-header">
        <h2 id="bio-heading" className="profile-page-section-title">
          {t("common.bio")}
        </h2>

        <div className="profile-page-section-actions">
          <PrivacyIcon
            privacy={privacySettings?.bio || PRIVACY_SETTINGS_CHOICE.EVERYONE}
            fieldName="bio"
          />
          <button
            className="profile-edit-button"
            aria-label="Edit personal information"
          >
            <Edit2 size={16} />
            <span>{t("common.edit")}</span>
          </button>
        </div>
      </div>
      <p className="profile-bio">{account?.bio ?? <MinusIcon />}</p>
    </section>
  );
};

export default Bio;
