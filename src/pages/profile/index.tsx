import "./index.style.css";
import { memo } from "react";
import ProfileHeader from "./components/ProfileHeader";
import MainCard from "./components/MainCard";
import PersonalInformation from "./components/PersonalInformation";
import Bio from "./components/Bio";
import SocialLinks from "./components/SocialLinks";

const Profile = () => {
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
