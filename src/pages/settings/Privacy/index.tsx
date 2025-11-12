import "./index.style.css";
import { Shield, Lock, Eye, UserCheck } from "lucide-react";
import { Fragment, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import ToggleSlider from "@/components/ToggleSlider";
import { useTranslation } from "react-i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";

const PrivacySettings = () => {
  const { t } = useTranslation();

  const [messageKey, setMessageKey] = useState("EVERYONE");
  const [emailKey, setEmailKey] = useState("NOBODY");
  const [genderKey, setGenderKey] = useState("EVERYONE");
  const [bioKey, setBioKey] = useState("EVERYONE");
  const [locationKey, setLocationKey] = useState("EVERYONE");
  const [socialKey, setSocialKey] = useState("EVERYONE");
  const [lastSeenKey, setLastSeenKey] = useState("EVERYONE");
  const [friendRequestsOpen, setFriendRequestsOpen] = useState(true);

  const privacyOptions = [
    {
      key: "EVERYONE",
      name: t(`common.${PRIVACY_SETTINGS_CHOICE.EVERYONE}`),
      icon: Eye,
    },
    {
      key: "MY_FRIENDS",
      name: t(`common.${PRIVACY_SETTINGS_CHOICE.MY_FRIENDS}`),
      icon: UserCheck,
    },
    {
      key: "NOBODY",
      name: t(`common.${PRIVACY_SETTINGS_CHOICE.NOBODY}`),
      icon: Lock,
    },
  ];

  const privacySections = [
    {
      label: t("common.email_who_can_see"),
      key: emailKey,
      setter: setEmailKey,
    },
    {
      label: t("common.gender_who_can_see"),
      key: genderKey,
      setter: setGenderKey,
    },
    {
      label: t("common.bio_who_can_see"),
      key: bioKey,
      setter: setBioKey,
    },
    {
      label: t("common.location_who_can_see"),
      key: locationKey,
      setter: setLocationKey,
    },
    {
      label: t("common.social_who_can_see"),
      key: socialKey,
      setter: setSocialKey,
    },
    {
      label: t("common.last_seen_who_can_see"),
      key: lastSeenKey,
      setter: setLastSeenKey,
    },
  ];

  const createOptions = (activeKey: string, setter: (key: string) => void) => ({
    title: t("common.privacy_level"),
    activeKey,
    selections: privacyOptions.map((opt) => ({
      key: opt.key,
      name: opt.name,
      title: opt.name,
      icon: opt.icon,
      onClick: () => setter(opt.key),
    })),
  });

  const getLabel = (key: string) =>
    privacyOptions.find((opt) => opt.key === key)?.name || t("common.select");

  return (
    <Fragment>
      <section className="privacy-settings">
        <div className="privacy-settings-container">
          <div className="privacy-settings-header">
            <h1>{t("common.privacy_header")}</h1>
            <p>{t("common.privacy_description")}</p>
          </div>

          <div className="privacy-settings-content">
            {/* ACTION PRIVACY */}
            <div className="privacy-section">
              <h2 className="privacy-section-title">
                {t("common.privacy_section_action")}
              </h2>

              <div className="privacy-setting-card">
                <div
                  className="privacy-setting-card-header"
                  style={{ marginBottom: 0 }}
                >
                  <div className="privacy-setting-icon">
                    <UserCheck size={20} />
                  </div>
                  <div className="privacy-setting-card-title">
                    <h3>{t("common.friend_requests_title")}</h3>
                    <p>{t("common.friend_requests_desc")}</p>
                  </div>
                  <ToggleSlider
                    checked={friendRequestsOpen}
                    onClick={() => setFriendRequestsOpen(!friendRequestsOpen)}
                  />
                </div>
              </div>

              <div className="privacy-setting-card">
                <div className="privacy-setting-card-header">
                  <div className="privacy-setting-icon">
                    <Shield size={20} />
                  </div>
                  <div className="privacy-setting-card-title">
                    <h3>{t("common.can_message_title")}</h3>
                    <p>{t("common.can_message_desc")}</p>
                  </div>
                </div>
                <CustomSelect
                  buttonTitle={getLabel(messageKey)}
                  options={createOptions(messageKey, setMessageKey)}
                />
              </div>
            </div>

            {/* DATA PRIVACY */}
            <div className="privacy-section">
              <h2 className="privacy-section-title">
                {t("common.privacy_section_data")}
              </h2>

              <div className="privacy-setting-card">
                {privacySections.map((item, idx) => (
                  <div
                    className="privacy-row"
                    key={idx}
                    style={idx > 0 ? { marginTop: "12px" } : {}}
                  >
                    <span className="privacy-row-label">{item.label}</span>
                    <div className="privacy-row-select">
                      <CustomSelect
                        buttonTitle={getLabel(item.key)}
                        options={createOptions(item.key, item.setter)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default PrivacySettings;
