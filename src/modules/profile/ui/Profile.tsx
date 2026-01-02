import "./profile.style.css";
import { FC, memo } from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";
import { useToastError } from "@/hooks/useToastError";
import { useAppSelector } from "@/hooks/useStore";
import { RESOURCE } from "@/common/enums/enums";
import { clearError } from "@/modules/settings/PrivacySettings/api/api";

const Profile: FC = () => {
  const { ERROR_UPDATE } = useAppSelector(
    (state) => state[RESOURCE.PRIVACY_SETTINGS]
  );

  useToastError({
    error: ERROR_UPDATE,
    clearErrorAction: clearError,
  });

  return (
    <div className="profile-container">
      {/* Header */}
      <ProfileHeader />

      <main className="profile-content">
        {/* Main Profile Section */}
        <MainCard />

        {/* Personal Info Grid */}
        <PersonalInformation />

        {/* Bio Section */}
        <Bio />

        {/* Social Links */}
        <SocialLinks />
      </main>
    </div>
  );
};

export default memo(Profile);
