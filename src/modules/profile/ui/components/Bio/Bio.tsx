import "./bio.style.css";
import { MinusIcon } from "lucide-react";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { useTranslation } from "react-i18next";
import { useGetAccountQuery } from "@/modules/profile/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";

const Bio = () => {
  const { t } = useTranslation();
  const { access_token } = useAuthStore();

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
          <Button
            title={t("common.edit")}
            className="profile-edit-button"
            aria-label="Edit personal information"
            icon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                edit
              </span>
            }
          />
        </div>
      </div>
      <p className="profile-bio">{account?.bio ?? <MinusIcon />}</p>
    </section>
  );
};

export default Bio;
