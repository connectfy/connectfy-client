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
import "./index.style.css";
import { Resource } from "@/types/enum.types";
import { useAppSelector } from "@/hooks/useStore";
import { PrivacyIcon } from "../PrivacyIcon";
import { IMe } from "@/types/auth/user/user.type";
import { useTranslation } from "react-i18next";
import { DDMMMMYYY } from "@/utils/formatDate";

const PersonalInformation = () => {
  const { t } = useTranslation();

  const { me: profile } = useAppSelector((state) => state[Resource.user]);
  const { user, account, settings } = profile as IMe;
  const { privacySettings } = settings;

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
              <PrivacyIcon privacy={privacySettings.email} />
            </div>
            <p className="profile-info-value">{user.email}</p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <UserIcon size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.gender")}</span>
              <PrivacyIcon privacy={privacySettings.gender} />
            </div>
            <p className="profile-info-value">{account.gender}</p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <MapPin size={16} aria-hidden="true" />
              <span className="profile-info-label">{t("common.location")}</span>
              <PrivacyIcon privacy={privacySettings.location} />
            </div>
            <p className="profile-info-value">
              {account.location ?? <MapMinusIcon />}
            </p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <Cake size={16} aria-hidden="true" />
              <span className="profile-info-label">
                {t("common.birthday")}
              </span>
              <PrivacyIcon privacy={privacySettings.birthdayDate} />
            </div>
            <p className="profile-info-value">
              {DDMMMMYYY(account.birthdayDate)}
            </p>
          </div>

          <div className="profile-info-card">
            <div className="profile-info-header">
              <Phone size={16} aria-hidden="true" />
              <span className="profile-info-label">
                {t("common.phone")}
              </span>
              <PrivacyIcon privacy={privacySettings.phoneNumber} />
            </div>
            <p className="profile-info-value">{user.phoneNumber ? user.phoneNumber.fullPhoneNumber : <Minus />}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalInformation;