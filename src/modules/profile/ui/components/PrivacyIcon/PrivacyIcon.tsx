import { Fragment, memo } from "react";
import "./privacyIcon.style.css";
import { Globe, Users, Lock } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import useBoolean from "@/hooks/useBoolean";
import PrivacyIconModal from "../Modal/PrivacyIconModal/PrivacyIconModal";
import { useTranslation } from "react-i18next";
import { Tooltip } from "@mui/material";

interface Props {
  privacy: PRIVACY_SETTINGS_CHOICE;
}

export const PrivacyIcon = memo((data: Props) => {
  const { t } = useTranslation();
  const { privacy } = data;

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
      />
    </Fragment>
  );
});
