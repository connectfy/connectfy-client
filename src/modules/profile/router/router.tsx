import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";
import MainCardSkeleton from "@/components/Skeleton/profile/MainCardSkeleton";
import PersonalInformationSkeleton from "@/components/Skeleton/profile/PersonalInformationSkeleton";
import BioSkeleton from "@/components/Skeleton/profile/BioSkeleton";
import ProfileHeader from "../ui/components/ProfileHeader/ProfileHeader";

const ProfilePageSkeleton = () => (
  <div className="relative w-full h-screen overflow-x-hidden overflow-y-auto font-sans scroll-smooth bg-(--bg-color)">
    <ProfileHeader />

    <main className="mx-auto max-w-[900px] pt-8 px-6 pb-[60px]">
      <MainCardSkeleton />
      <PersonalInformationSkeleton />
      <BioSkeleton />
    </main>
  </div>
);

const Profile = ComponentLoader(
  lazy(() => import("../ui/Profile")),
  <ProfilePageSkeleton />,
);

const routes: RouteObject[] = [
  {
    path: ROUTER.PROFILE.MAIN,
    element: <Profile />,
  },
];

export default routes;
