import { Fragment, memo } from "react";
import "./privacyIcon.style.css";
import { Globe, Users, Lock } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import useBoolean from "@/hooks/useBoolean";
import PrivacyIconModal from "../Modal/PrivacyIconModal/PrivacyIconModal";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";
import { IEditPrivacySettings } from "@/modules/settings/PrivacySettings/types/types";

interface Props {
  privacy: PRIVACY_SETTINGS_CHOICE;
  fieldName: keyof IEditPrivacySettings;
}

export const PrivacyIcon = memo((data: Props) => {
  const { t } = useTranslation();
  const { privacy, fieldName } = data;

  const { open, onOpen, onClose } = useBoolean();

  const icons = {
    EVERYONE: <Globe size={16} className="profile-privacy-icon" />,
    MY_FRIENDS: <Users size={16} className="profile-privacy-icon" />,
    NOBODY: <Lock size={16} className="profile-privacy-icon" />,
  };

  return (
    <Fragment>
      <Tooltip placement="top" title={t(`enum.${privacy}`)}>
        <span className="profile-privacy-badge" onClick={onOpen}>
          {icons[privacy]}
        </span>
      </Tooltip>

      <PrivacyIconModal
        open={open}
        onClose={onClose}
        currentPrivacy={privacy}
        fieldName={fieldName}
      />
    </Fragment>
  );
});
