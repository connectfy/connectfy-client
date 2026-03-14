import {
  Cake,
  Phone,
  Mail,
  MapPin,
  UserIcon,
  MapMinusIcon,
  Minus,
} from "lucide-react";
import "./personalInformation.style.css";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { useTranslation } from "react-i18next";
import { DDMMMMYYY } from "@/common/utils/formatValues";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useProfile } from "@/modules/profile/hooks/useProfile";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";

const PersonalInformation = () => {
  const { t } = useTranslation();

  const { user } = useUser();
  const { profile } = useProfile();
  const { privacySettings } = usePrivacySettings();

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
            <Button
              className="profile-edit-button"
              aria-label="Edit personal information"
              title={t("common.edit")}
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
