import { FC, useState } from "react";
import Modal from "@/components/Modal";
import { Globe, Users, Lock, Shield, Check, X } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import { IEditPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";
import { snack } from "@/common/utils/snackManager";
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
      gradient: "from-blue-500 to-blue-700",
      title: t(`enum.${PRIVACY_SETTINGS_CHOICE.EVERYONE}`),
      description: t("common.privacy_everyone_description"),
    },
    {
      value: PRIVACY_SETTINGS_CHOICE.MY_FRIENDS,
      icon: Users,
      gradient: "from-amber-500 to-amber-700",
      title: t(`enum.${PRIVACY_SETTINGS_CHOICE.MY_FRIENDS}`),
      description: t("common.privacy_friends_description"),
    },
    {
      value: PRIVACY_SETTINGS_CHOICE.NOBODY,
      icon: Lock,
      gradient: "from-violet-500 to-violet-700",
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
      <div className="w-[95%] max-w-[480px] bg-(--bg-color) rounded-2xl shadow-(--card-shadow) overflow-y-auto animate-slide-up duration-300">
        {/* Header */}
        <div className="flex flex-col p-6 border-b border-(--border-color) sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <h2 className="flex items-center gap-2.5 text-xl font-bold text-(--text-color) m-0">
              <Shield size={24} className="text-(--primary-color)" />
              {t("common.privacy_title")}
            </h2>

            {/* Yeni Close Button */}
            <Button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 transition-all text-(--muted-color) hover:bg-black/5 dark:hover:bg-white/5 hover:text-(--text-color)"
              aria-label="Close"
            >
              <X size={18} />
            </Button>
          </div>
          <p className="m-0 text-sm font-medium text-(--muted-color)">
            {t("common.privacy_subtitle")}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-3 mb-6">
            {privacyOptions.map((option) => {
              const Icon = option.icon;
              const isActive = privacy === option.value;

              return (
                <div
                  key={option.value}
                  onClick={() => setPrivacy(option.value)}
                  className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2 
                    ${
                      isActive
                        ? "bg-(--active-bg) border-(--primary-color) shadow-(--active-shadow)"
                        : "bg-(--bg-color) border-transparent shadow-(--card-shadow) hover:bg-(--active-bg-2) hover:-translate-y-0.5 duration-500"
                    }`}
                >
                  {/* Icon Box */}
                  <div
                    className={`flex items-center justify-center shrink-0 w-11 h-11 rounded-xl bg-linear-to-br transition-transform duration-500 ${option.gradient} ${isActive ? "scale-110 shadow-lg shadow-black/20" : ""}`}
                  >
                    <Icon size={22} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="m-0 text-base font-bold text-(--text-color)">
                        {option.title}
                      </h3>

                      {/* Custom Checkbox */}
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all 
                        ${
                          isActive
                            ? "bg-(--primary-color) border-(--primary-color)"
                            : "border-(--border-color)"
                        }`}
                      >
                        {isActive && (
                          <Check size={12} className="text-white stroke-3" />
                        )}
                      </div>
                    </div>
                    <p className="m-0 text-sm leading-relaxed text-(--muted-color)">
                      {option.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={submitSelect}
            className="w-full py-3 font-bold transition-all rounded-xl bg-(--primary-color) translate-y-0 hover:-translate-y-0.5 duration-500"
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
