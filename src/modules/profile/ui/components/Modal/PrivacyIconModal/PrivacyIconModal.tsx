import { FC } from "react";
import "./privacyIconModal.style.css";
import Modal from "@/components/Modal";
import { Globe, Users, Lock, Shield, Check } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/Buttons/Button/Button";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: Function;
  currentPrivacy: PRIVACY_SETTINGS_CHOICE;
}

const PrivacyIconModal: FC<Props> = ({ open, onClose, currentPrivacy }) => {
  const { t } = useTranslation();

  const privacyOptions = [
    {
      value: PRIVACY_SETTINGS_CHOICE.EVERYONE,
      icon: Globe,
      iconClass: "everyone",
      title: t(`enum.${PRIVACY_SETTINGS_CHOICE.EVERYONE}`),
      description: t("common.privacy_everyone_description"),
    },
    {
      value: PRIVACY_SETTINGS_CHOICE.MY_FRIENDS,
      icon: Users,
      iconClass: "friends",
      title: t(`enum.${PRIVACY_SETTINGS_CHOICE.MY_FRIENDS}`),
      description: t("common.privacy_friends_description"),
    },
    {
      value: PRIVACY_SETTINGS_CHOICE.NOBODY,
      icon: Lock,
      iconClass: "nobody",
      title: t(`enum.${PRIVACY_SETTINGS_CHOICE.NOBODY}`),
      description: t("common.privacy_nobody_description"),
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="privacy-modal-content">
        <div className="privacy-modal-header">
          <h2 className="privacy-modal-title">
            <Shield size={24} color="var(--primary-color)" />
            {t("common.privacy_title")}
          </h2>
          <p className="privacy-modal-subtitle">
            {t("common.privacy_subtitle")}
          </p>
        </div>

        <div className="privacy-modal-body">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentPrivacy === option.value;

            return (
              <div
                key={option.value}
                className={`privacy-option ${isActive ? "active" : ""}`}
              >
                <div className={`privacy-option-icon ${option.iconClass}`}>
                  <Icon size={24} color="#fff" />
                </div>

                <div className="privacy-option-content">
                  <div className="privacy-option-header">
                    <h3 className="privacy-option-title">{option.title}</h3>
                    <div className="privacy-option-check">
                      {isActive && <Check size={14} color="#fff" />}
                    </div>
                  </div>
                  <p className="privacy-option-description">
                    {option.description}
                  </p>
                </div>
              </div>
            );
          })}

          <Button
            onClick={() => onClose()}
            fillWidth
            style={{ marginTop: "10px" }}
          >
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyIconModal;
