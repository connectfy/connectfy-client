import { memo } from "react";
import "./index.style.css";
import { Globe, Users, Lock } from "lucide-react";
import { PRIVACY_SETTINGS_CHOICE } from "@/types/enum.types";

interface Props {
  privacy: PRIVACY_SETTINGS_CHOICE;
}

export const PrivacyIcon = memo((data: Props) => {
  const { privacy } = data;

  const icons = {
    EVERYONE: <Globe size={16} className="profile-privacy-icon" />,
    MY_FRIENDS: <Users size={16} className="profile-privacy-icon" />,
    NOBODY: <Lock size={16} className="profile-privacy-icon" />,
  };

  return <span className="profile-privacy-badge">{icons[privacy]}</span>;
});
