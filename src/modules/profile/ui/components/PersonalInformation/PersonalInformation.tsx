import {
  Cake,
  Phone,
  Mail,
  MapPin,
  UserIcon,
  Edit2,
  MapMinusIcon,
  Minus,
} from "lucide-react";
import "./personalInformation.style.css";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { useTranslation } from "react-i18next";
import { DDMMMMYYY } from "@/common/utils/formatDate";
import { useGetAccountQuery, useGetMeQuery } from "@/modules/profile/api/api";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";
import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";

const PersonalInformation = () => {
  const { t } = useTranslation();

  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  const { data: user } = useGetMeQuery(undefined, {
    skip: !access_token,
  });
  const { data: profile } = useGetAccountQuery(undefined, {
    skip: !access_token,
  });
  const { data: privacySettings } = useGetPrivacySettingsQuery(undefined, {
    skip: !access_token,
  });

  return (
    <div>
      <section
        className="profile-page-section"
        aria-labelledby="personal-info-heading"
      >
        <div className="profile-section-header">
          <h2 id="personal-info-heading" className="profile-page-section-title">
            {t("common.personal_information")}
          </h2>
          <div className="profile-page-section-actions">
            <button
              className="profile-edit-button"
              aria-label="Edit personal information"
            >
              <Edit2 size={16} />
              <span>{t("common.edit")}</span>
            </button>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="profile-info-card">
            <div className="profile-info-header">
              <Mail size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.email")}</span>
              <PrivacyIcon
                privacy={
                  privacySettings?.email || PRIVACY_SETTINGS_CHOICE.EVERYONE
                }
                fieldName="email"
              />
            </div>
            <p className="profile-info-value">{user?.email}</p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <UserIcon size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.gender")}</span>
              <PrivacyIcon
                privacy={
                  privacySettings?.gender || PRIVACY_SETTINGS_CHOICE.EVERYONE
                }
                fieldName="gender"
              />
            </div>
            <p className="profile-info-value">{profile?.gender}</p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <MapPin size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.location")}</span>
              <PrivacyIcon
                privacy={
                  privacySettings?.location || PRIVACY_SETTINGS_CHOICE.EVERYONE
                }
                fieldName="location"
              />
            </div>
            <p className="profile-info-value">
              {profile?.location ?? <MapMinusIcon />}
            </p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <Cake size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.birthday")}</span>
              <PrivacyIcon
                privacy={
                  privacySettings?.birthdayDate ||
                  PRIVACY_SETTINGS_CHOICE.EVERYONE
                }
                fieldName="birthdayDate"
              />
            </div>
            <p className="profile-info-value">
              {DDMMMMYYY(
                profile?.birthdayDate || PRIVACY_SETTINGS_CHOICE.EVERYONE,
              )}
            </p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <Phone size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.phone")}</span>
              <PrivacyIcon
                privacy={
                  privacySettings?.phoneNumber ||
                  PRIVACY_SETTINGS_CHOICE.EVERYONE
                }
                fieldName="phoneNumber"
              />
            </div>
            <p className="profile-info-value">
              {user?.phoneNumber?.fullPhoneNumber || <Minus />}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalInformation;
