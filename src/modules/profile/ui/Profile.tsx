import "./profile.style.css";
import { FC, memo } from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";

const Profile: FC = () => {
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
