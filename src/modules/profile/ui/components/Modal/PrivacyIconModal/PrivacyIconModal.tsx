import { FC, useState } from "react";
import "./privacyIconModal.style.css";
import Modal from "@/components/Modal";
import { Globe, Users, Lock, Shield, Check } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import { IEditPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";
import { snack } from "@/common/utils/snackManager";
import CloseButton from "@/components/ui/CustomButton/CloseButton/CloseButton";
import { useEditPrivacySettingsMutation } from "@/modules/settings/PrivacySettings/api/api";
import { useErrors } from "@/hooks/useErrors";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";

interface Props {
  open: boolean;
  onClose: Function;
  currentPrivacy: PRIVACY_SETTINGS_CHOICE;
  fieldName: keyof IEditPrivacySettings;
}

const PrivacyIconModal: FC<Props> = ({
  open,
  onClose,
  currentPrivacy,
  fieldName,
}) => {
  const { t } = useTranslation();

  const { privacySettings } = usePrivacySettings();
  const [updatePrivacySettings, { isLoading: LOADING_UPDATE }] =
    useEditPrivacySettingsMutation();
  const { showResponseErrors } = useErrors();

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

  const [privacy, setPrivacy] =
    useState<PRIVACY_SETTINGS_CHOICE>(currentPrivacy);

  const handleClose = () => {
    setPrivacy(currentPrivacy);
    onClose();
  };

  const submitSelect = async () => {
    try {
      await updatePrivacySettings({
        _id: privacySettings!._id,
        [fieldName]: privacy,
      }).unwrap();

      onClose();
      snack.success(t("user_messages.information_updated"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="privacy-modal-content">
        <div className="privacy-modal-header">
          <div className="privacy-modal-header-top">
            <h2 className="privacy-modal-title">
              <Shield size={24} color="var(--primary-color)" />
              {t("common.privacy_title")}
            </h2>

            <CloseButton onClick={handleClose} />
          </div>

          <p className="privacy-modal-subtitle">
            {t("common.privacy_subtitle")}
          </p>
        </div>

        <div className="privacy-modal-body">
          {privacyOptions.map((option) => {
            const Icon = option.icon;
            const isActive = privacy === option.value;

            return (
              <div
                key={option.value}
                className={`privacy-option ${isActive ? "active" : ""}`}
                onClick={() => setPrivacy(option.value)}
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
            onClick={submitSelect}
            style={{ marginTop: "10px" }}
            disabled={currentPrivacy === privacy || LOADING_UPDATE}
            isLoading={LOADING_UPDATE}
          >
            {t("common.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyIconModal;
