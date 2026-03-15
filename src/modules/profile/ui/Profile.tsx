import { FC, memo } from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";

const Profile: FC = () => {
  return (
    <div className="relative w-full h-screen overflow-x-hidden overflow-y-auto font-sans scroll-smooth bg-(--bg-color)">
      {/* Header */}
      <ProfileHeader />

      <main className="mx-auto max-w-[900px] pt-8 px-6 pb-[60px] animate-slide-up">
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
