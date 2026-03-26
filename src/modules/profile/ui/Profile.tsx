import {
  FC,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";
import { useUser } from "@/context/UserContext";
import { useProfile } from "../hooks/useProfile";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import MainCardSkeleton from "@/components/Skeleton/profile/MainCardSkeleton";
import PersonalInformationSkeleton from "@/components/Skeleton/profile/PersonalInformationSkeleton";
import BioSkeleton from "@/components/Skeleton/profile/BioSkeleton";
import OnlineFriendsSidebar from "./components/OnlineFriendsSidebar";

const Profile: FC = () => {
  const { user, isLoading: userLoading, hasPhoneNumber } = useUser();
  const { profile, isLoading: profileLoading } = useProfile();
  const { privacySettings, isLoading: privacyLoading } = usePrivacySettings();

  const [_, startTransition] = useTransition();
  const [showContent, setShowContent] = useState(false);
  const [isFriendsSidebarOpen, setIsFriendsSidebarOpen] = useState(false);

  const isDataReady = !userLoading && !profileLoading && !privacyLoading;

  const toggleFriendsSidebar = useCallback(() => {
    setIsFriendsSidebarOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isDataReady) {
      // Browser click eventlərini bu render-dən önə keçirə bilər
      startTransition(() => {
        setShowContent(true);
      });
    } else {
      setShowContent(false);
    }
  }, [isDataReady]);

  return (
    // Əsas flex konteyner (bütün ekranı tutur və scroll gizlədilir, scroll daxili div-lərdə olacaq)
    <div className="flex w-full h-screen overflow-hidden bg-(--bg-color) font-sans">
      {/* Sol tərəf: Əsas Profil Məlumatları */}
      <div className="flex-1 h-full overflow-x-hidden overflow-y-auto scroll-smooth">
        <ProfileHeader onToggleFriends={toggleFriendsSidebar} />

        <main className="mx-auto max-w-[900px] pt-8 px-6 pb-[60px] animate-slide-up">
          {!showContent ? (
            <Fragment>
              <MainCardSkeleton />
              <PersonalInformationSkeleton />
              <BioSkeleton />
            </Fragment>
          ) : (
            <Fragment>
              <MainCard user={user} profile={profile} />
              <PersonalInformation
                user={user}
                profile={profile}
                privacySettings={privacySettings}
                hasPhoneNumber={!!hasPhoneNumber}
              />
              <Bio profile={profile} privacySettings={privacySettings} />
            </Fragment>
          )}

          <SocialLinks userId={user?._id} />
        </main>
      </div>

      {/* Sağ tərəf: Səhifəni bölən Sidebar */}
      <OnlineFriendsSidebar isOpen={isFriendsSidebarOpen} />
    </div>
  );
};

export default memo(Profile);
