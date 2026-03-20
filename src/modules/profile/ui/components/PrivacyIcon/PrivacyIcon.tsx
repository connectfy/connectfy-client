import { memo } from "react";
import { Globe, Users, Lock } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import useBoolean from "@/hooks/useBoolean";
import PrivacyIconModal from "../Modal/PrivacyIconModal/PrivacyIconModal";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { IEditPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Props {
  privacy: PRIVACY_SETTINGS_CHOICE;
  fieldName: keyof IEditPrivacySettings;
}

export const PrivacyIcon = memo(({ privacy, fieldName }: Props) => {
  const { t } = useTranslation();
  const { open, onOpen, onClose } = useBoolean();

  // İkonlar üçün ortaq class
  const iconClassName =
    "text-(--muted-color) transition-all duration-300 group-hover:text-(--primary-color)";

  const icons = {
    [PRIVACY_SETTINGS_CHOICE.EVERYONE]: (
      <Globe size={16} className={iconClassName} />
    ),
    [PRIVACY_SETTINGS_CHOICE.MY_FRIENDS]: (
      <Users size={16} className={iconClassName} />
    ),
    [PRIVACY_SETTINGS_CHOICE.NOBODY]: (
      <Lock size={16} className={iconClassName} />
    ),
  };

  return (
    <>
      <Tooltip placement="top" title={t(`enum.${privacy}`)}>
        <Button
          type="button"
          onClick={onOpen}
          className="group flex items-center justify-center p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer border-none bg-transparent"
        >
          {icons[privacy]}
        </Button>
      </Tooltip>

      <PrivacyIconModal
        open={open}
        onClose={onClose}
        currentPrivacy={privacy}
        fieldName={fieldName}
      />
    </>
  );
});
