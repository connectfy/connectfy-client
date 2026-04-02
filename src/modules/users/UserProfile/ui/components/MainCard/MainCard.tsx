import { Users, MessageCircle, UserPlus, Clock, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FC, Fragment } from "react";
import NoProfilePhotoIcon from "@/assets/icons/NoProfilePhotoIcon";
import {
  IFindOneActions,
  IFindOneProfile,
  IFindOneRelationship,
  IFindOneUser,
} from "../../../types/types";
import { useGeneralSettings } from "@/modules/settings/GeneralSettings/hooks/useGeneralSettings";
import { showDate } from "@/common/utils/formatValues";
import { DATE_FORMAT, FriendshipStatus } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import useBoolean from "@/hooks/useBoolean";
import AvatarModal from "../AvatarModal/AvatarModal";

interface IProps {
  user: IFindOneUser;
  profile: IFindOneProfile;
  actions: IFindOneActions;
  relationship: IFindOneRelationship;
}

const MainCard: FC<IProps> = ({ user, profile, actions, relationship }) => {
  const { t } = useTranslation();
  const { generalSettings } = useGeneralSettings();

  const openAvatarModal = useBoolean();

  // Dostluq statusuna görə düyməni render edən köməkçi funksiya
  const renderFriendActionButton = () => {
    const status = relationship?.friendship?.status;

    // 1. Əgər dostluq yoxdursa
    if (!relationship?.friendship) {
      return (
        <Button
          type="button"
          disabled={!actions?.canSendFriendRequest}
          className="px-6 py-2.5 text-sm font-semibold text-(--primary-color) transition-colors rounded-xl bg-(--active-bg-2)"
          icon={<UserPlus size={18} />}
          title={t("common.addFriend")}
          hideTitleInMobile={false}
        />
      );
    }

    // 2. Əgər PENDİNG (gözləmədə) vəziyyətindədirsə
    if (status === FriendshipStatus.Pending) {
      return (
        <Button
          type="button"
          className="px-6 py-2.5 text-sm font-semibold text-white transition-colors rounded-xl bg-(--active-bg-2)"
          icon={<Clock size={18} />}
          title={t("common.pending")}
          hideTitleInMobile={false}
        />
      );
    }

    // 3. Əgər ACCEPTED (dostluq qəbul edilibsə) vəziyyətindədirsə
    if (status === FriendshipStatus.Accepted) {
      return (
        <Button
          type="button"
          className="px-6 py-2.5 text-sm font-semibold text-(--primary-color) transition-colors rounded-xl bg-(--active-bg-2)"
          icon={<UserCheck size={18} />}
          title={t("common.friends")}
          hideTitleInMobile={false}
        />
      );
    }

    return null;
  };

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
                onClick={() => openAvatarModal.onOpen()}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-(--active-bg-2)">
                <NoProfilePhotoIcon />
              </div>
            )}
          </div>
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
          {profile?.lastSeen && (
            <p className="m-0 text-sm italic text-(--muted-color)">
              {t("common.lastSeen")}:{" "}
              {showDate(
                profile.lastSeen,
                generalSettings?.timeZone.dateFormat || DATE_FORMAT.DDMMYYYY,
                "/",
              )}
            </p>
          )}
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
                {relationship?.count || 0}
              </span>
            </div>
            <span className="text-[13px] font-medium uppercase tracking-wider text-(--muted-color)">
              {t("common.friends")}
            </span>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col w-full gap-3 mt-2 sm:flex-row sm:justify-center sm:max-w-[400px]">
          {/* Message Button */}
          <Button
            type="button"
            disabled={!actions?.canSendMessage}
            className="px-6 py-2.5 text-sm font-semibold text-(--text-color) transition-colors rounded-xl bg-(--active-bg-2)"
            icon={<MessageCircle size={18} />}
            title={t("common.message")}
            hideTitleInMobile={false}
          />

          {/* Add Friend / Status Button */}
          <div className="flex flex-col flex-1">
            {renderFriendActionButton()}
          </div>
        </div>
      </section>

      <AvatarModal
        open={openAvatarModal.open}
        onClose={openAvatarModal.onClose}
        avatarUrl={profile?.avatar?.url ?? ""}
        username={user.username}
        userId={user._id}
      />
    </Fragment>
  );
};

export default MainCard;
