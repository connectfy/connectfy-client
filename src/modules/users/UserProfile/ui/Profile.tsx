import { FC, Fragment, memo } from "react";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import MainCard from "./components/MainCard/MainCard";
import PersonalInformation from "./components/PersonalInformation/PersonalInformation";
import Bio from "./components/Bio/Bio";
import SocialLinks from "./components/SocialLinks/SocialLinks";
import MainCardSkeleton from "@/components/Skeleton/profile/MainCardSkeleton";
import PersonalInformationSkeleton from "@/components/Skeleton/profile/PersonalInformationSkeleton";
import BioSkeleton from "@/components/Skeleton/profile/BioSkeleton";
import { useFindUserQuery } from "../api/api";
import { Navigate, useParams } from "react-router-dom";
import { validate } from "uuid";

const Profile: FC = () => {
  const { id } = useParams<{ id: string }>();

  // UUID yoxlamasını bir dəyişəndə saxlayırıq
  const isValidId = id && validate(id);

  // 1. Hook mütləq yuxarıda olmalıdır. Əgər ID səhvdirsə, `skip` ilə API sorğusunu dayandırırıq.
  const { data, isLoading, isError } = useFindUserQuery(id as string, {
    skip: !isValidId,
  });

  // 2. Early Return-ləri Hook-dan sonra edirik
  if (!isValidId) {
    return <Navigate to="/" replace />;
  }

  if (!isLoading && (!data || isError)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-(--bg-color) font-sans">
      <div className="flex-1 h-full overflow-x-hidden overflow-y-auto scroll-smooth">
        <ProfileHeader relationship={data?.relationship} user={data?.user} />

        <main className="mx-auto max-w-[900px] pt-8 px-6 pb-[60px] animate-slide-up">
          {/* 3. Data yoxdursa (yəni yüklənirsə), Skeleton-ları göstəririk. Destructuring xətası olmur. */}
          {isLoading || !data ? (
            <Fragment>
              <MainCardSkeleton />
              <PersonalInformationSkeleton />
              <BioSkeleton />
            </Fragment>
          ) : (
            <Fragment>
              {/* 4. Data yalnız bu blokda mövcud (defined) olduğu üçün təhlükəsiz ötürürük */}
              <MainCard
                user={data.user}
                profile={data.profile}
                actions={data.actions}
                relationship={data.relationship}
              />
              <PersonalInformation user={data.user} profile={data.profile} />
              <Bio profile={data.profile} />

              <SocialLinks userId={data.user._id} />
            </Fragment>
          )}
        </main>
      </div>
    </div>
  );
};

export default memo(Profile);
