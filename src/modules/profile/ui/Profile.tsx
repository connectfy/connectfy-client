import { FC, memo } from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";
import { useUser } from "../hooks/useUser";
import { useProfile } from "../hooks/useProfile";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import MainCardSkeleton from "@/components/Skeleton/profile/MainCardSkeleton";
import PersonalInformationSkeleton from "@/components/Skeleton/profile/PersonalInformationSkeleton";
import BioSkeleton from "@/components/Skeleton/profile/BioSkeleton";

const Profile: FC = () => {
  const { user, isLoading: userLoading, hasPhoneNumber } = useUser();
  const { profile, isLoading: profileLoading } = useProfile();
  const { privacySettings, isLoading: privacyLoading } = usePrivacySettings();

  return (
    <div className="relative w-full h-screen overflow-x-hidden overflow-y-auto font-sans scroll-smooth bg-(--bg-color)">
      {/* Header */}
      <ProfileHeader />

      <main className="mx-auto max-w-[900px] pt-8 px-6 pb-[60px] animate-slide-up">
        {/* Main Profile Section */}
        {userLoading || profileLoading ? (
          <MainCardSkeleton />
        ) : (
          <MainCard user={user} profile={profile} />
        )}

        {/* Personal Info Grid */}
        {userLoading || profileLoading || privacyLoading ? (
          <PersonalInformationSkeleton />
        ) : (
          <PersonalInformation
            user={user}
            profile={profile}
            privacySettings={privacySettings}
            hasPhoneNumber={!!hasPhoneNumber}
          />
        )}

        {/* Bio Section */}
        {profileLoading || privacyLoading ? (
          <BioSkeleton />
        ) : (
          <Bio profile={profile} privacySettings={privacySettings} />
        )}

        {/* Social Links */}
        <SocialLinks userId={user?._id} />
      </main>
    </div>
  );
};

export default memo(Profile);
