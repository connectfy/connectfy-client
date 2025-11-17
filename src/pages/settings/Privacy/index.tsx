import "./index.style.css";
import { Shield, UserCheck } from "lucide-react";
import { Fragment, useState } from "react";
import CustomSelect from "@/components/CustomSelect";
import { useTranslation } from "react-i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";
import UniqueHeader from "@/components/Header/UnqiueHeader";
import SettingCard from "@/components/Card/SettingsCard";
import ToggleCard from "@/components/Card/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { privacyOptions, privacySections } from "./constants/constant";

const PrivacySettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [friendRequestsOpen, setFriendRequestsOpen] = useState(true);
  const [messageKey, setMessageKey] = useState(
    PRIVACY_SETTINGS_CHOICE.EVERYONE
  );

  const PRIVACY_OPTIONS = privacyOptions(t);
  const PRIVACY_SECTIONS = privacySections(t);

  const createOptions = (
    activeKey: string,
    setter: (key: PRIVACY_SETTINGS_CHOICE) => void
  ) => ({
    title: t("common.privacy_level"),
    activeKey,
    selections: PRIVACY_OPTIONS.map((opt) => ({
      key: opt.key,
      name: opt.name,
      title: opt.name,
      icon: opt.icon,
      onClick: () => setter(opt.key),
    })),
  });

  const getLabel = (key: string) =>
    PRIVACY_OPTIONS.find((opt) => opt.key === key)?.name || t("common.select");

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

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
                    {PRIVACY_SECTIONS.map((item, idx) => (
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
