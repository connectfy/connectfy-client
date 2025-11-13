import "./index.style.css";
import { Shield, Lock, Eye, UserCheck } from "lucide-react";
import { Fragment, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { useTranslation } from "react-i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import ToggleCard from "@/components/Card/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";

const PrivacySettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.EVERYONE}`),
      icon: Eye,
    },
    {
      key: "MY_FRIENDS",
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.MY_FRIENDS}`),
      icon: UserCheck,
    },
    {
      key: "NOBODY",
      name: t(`enum.${PRIVACY_SETTINGS_CHOICE.NOBODY}`),
      icon: Lock,
    },
  ];

  const privacySections = [
    {
      label: t("common.email_visibility"),
      key: emailKey,
      setter: setEmailKey,
    },
    {
      label: t("common.gender_visibility"),
      key: genderKey,
      setter: setGenderKey,
    },
    {
      label: t("common.bio_visibility"),
      key: bioKey,
      setter: setBioKey,
    },
    {
      label: t("common.location_visibility"),
      key: locationKey,
      setter: setLocationKey,
    },
    {
      label: t("common.social_visibility"),
      key: socialKey,
      setter: setSocialKey,
    },
    {
      label: t("common.last_seen_visibility"),
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

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN)

  return (
    <Fragment>
      <section className="privacy-settings">
        <div className="privacy-settings-container">
          <UniqueHeader
            headerTitle={t("common.privacy_header")}
            headerSubtitle={t("common.privacy_description")}
            onClickBack={onClickBack}
            onClickSave={() => {}}
            showChangesButton
            isChangesDisasbled={false}
          />

          <div className="privacy-settings-content">
            {/* ACTION PRIVACY */}
            <div className="privacy-section">
              <h2 className="privacy-section-title">
                {t("common.activity_privacy")}
              </h2>

              <ToggleCard
                header={{
                  icon: UserCheck,
                  title: t("common.friend_requests"),
                  subtitle: t("common.friend_requests_desc"),
                }}
                slider={{
                  checked: friendRequestsOpen,
                  onClick: () => setFriendRequestsOpen(!friendRequestsOpen),
                }}
              />

              <SettingCard
                header={{
                  icon: Shield,
                  title: t("common.message_privacy"),
                  subtitle: t("common.message_privacy_desc"),
                }}
                content={
                  <CustomSelect
                    buttonTitle={getLabel(messageKey)}
                    options={createOptions(messageKey, setMessageKey)}
                  />
                }
              />
            </div>

            {/* DATA PRIVACY */}
            <div className="privacy-section">
              <h2 className="privacy-section-title">
                {t("common.data_privacy")}
              </h2>

              <SettingCard
                content={
                  <Fragment>
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
                  </Fragment>
                }
                cardStyle={{
                  padding: "5px 16px 20px 16px",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default PrivacySettings;
