import { Pencil, UserRoundX, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { FC, Fragment } from "react";
import { IAccount, IMe } from "@/modules/profile/types/types";
import NoProfilePhotoIcon from "@/assets/icons/NoProfilePhotoIcon";
import { useAvatarModalStore } from "@/store/zustand/useAvatarModalStore";

interface IProps {
  user: IMe | undefined;
  profile: IAccount | undefined;
}

const MainCard: FC<IProps> = ({ user, profile }) => {
  const { t } = useTranslation();

  const onOpenShowModal = useAvatarModalStore((state) => state.onOpenShowModal);
  const onOpenChangeModal = useAvatarModalStore(
    (state) => state.onOpenChangeModal,
  );

  return (
    <Fragment>
      <section
        className="flex flex-col items-center gap-6 p-8 mb-8 transition-all bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow) md:p-10"
        aria-labelledby="profile-main-heading"
      >
        <div className="relative shrink-0">
          <div className="size-[140px] xs:size-[100px] sm:size-[120px] md:size-[140px] rounded-full overflow-hidden shadow-[0_8px_24px_var(--shadow-color)] border-4 border-(--primary-color)">
            {profile?.avatar?.url ? (
              <img
                src={profile.avatar.url}
                alt={`Profile picture of ${profile?.firstName} ${profile?.lastName}`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="object-cover w-full h-full bg-(--skeleton-card-bg) cursor-pointer"
                onClick={() =>
                  onOpenShowModal(
                    profile?.avatar?.url ?? "",
                    user?.username,
                    user?._id,
                    profile?._id,
                  )
                }
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-(--active-bg-2)">
                <NoProfilePhotoIcon />
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => onOpenChangeModal(profile?.avatar, profile?._id)}
            className="absolute bottom-1 right-1 md:bottom-0 md:right-0 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-(--primary-color) border-4 border-(--auth-main-bg) rounded-full shadow-md text-white hover:bg-(--hover-bg) transition-colors"
            icon={<Pencil size={18} />}
          />
        </div>

        <div className="text-center">
          <h1
            id="profile-main-heading"
            className="m-0 mb-2 text-2xl font-bold leading-tight md:text-[28px] text-(--text-color)"
          >
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="m-0 mb-2 text-sm font-medium md:text-base text-(--muted-color)">
            @{user?.username}
          </p>
          <p className="m-0 text-sm italic text-(--muted-color)">
            {t("common.lastSeen")}:{" "}
            {profile?.lastSeen
              ? new Date(profile.lastSeen).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div className="flex flex-col items-center w-full max-w-[400px] gap-4 p-4 rounded-2xl bg-(--active-bg-2) sm:flex-row sm:gap-6 sm:p-6 md:px-8">
          <div className="flex flex-row items-center justify-center flex-1 gap-3 sm:flex-col sm:gap-1.5 text-(--text-color)">
            <div className="flex items-center gap-1.5">
              <Users
                size={18}
                className="text-(--primary-color)"
                aria-hidden="true"
              />
              <span className="text-xl font-bold md:text-2xl text-(--primary-color)">
                15
              </span>
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider text-(--muted-color)">
              {t("common.friends")}
            </span>
          </div>

          <div
            className="w-full h-px opacity-30 bg-(--border-color) sm:w-px sm:h-10"
            aria-hidden="true"
          />

          <div className="flex flex-row items-center justify-center flex-1 gap-3 sm:flex-col sm:gap-1.5 text-(--text-color)">
            <div className="flex items-center gap-1.5">
              <UserRoundX
                size={18}
                className="text-(--error-color)"
                aria-hidden="true"
              />
              <span className="text-xl font-bold md:text-2xl text-(--primary-color)">
                5
              </span>
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider text-(--muted-color)">
              {t("common.blocked")}
            </span>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default MainCard;
