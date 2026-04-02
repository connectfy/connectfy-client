import {
  ArrowLeft,
  User,
  UserLock,
  BellRing,
  BellOff,
  Share,
} from "lucide-react";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { FC } from "react";
import { IFindOneRelationship, IFindOneUser } from "../../../types/types";
import { FriendshipStatus } from "@/common/enums/enums";

interface IProps {
  relationship?: IFindOneRelationship;
  user?: IFindOneUser;
}

const ProfileHeader: FC<IProps> = ({ relationship, user }) => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();

  return (
    <header
      className="
        sticky top-0 left-0 right-0 z-100
        flex items-center justify-between
        gap-5 px-4 min-h-[72px]
        bg-(--auth-main-bg)
        backdrop-blur-[10px]
        max-sm:px-3 max-sm:gap-3 max-sm:min-h-[64px]
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4 flex-1 min-w-0 max-sm:gap-3 max-sm:flex-none">
        <Button
          aria-label={t("common.back")}
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={18} />}
          className="
            flex items-center justify-center shrink-0 p-0
            w-[43px] h-[43px] rounded-[10px]
            bg-transparent text-(--text-color) cursor-pointer
            transition-all duration-300 ease-in-out
            hover:bg-(--active-bg) hover:border-(--primary-color) hover:-translate-x-0.5
            active:translate-x-0
            focus-visible:outline-2 focus-visible:outline-(--primary-color) focus-visible:-outline-offset-0.5
            max-[768px]:w-9 max-[768px]:h-9 max-[768px]:min-w-9 max-[768px]:min-h-9
            max-[480px]:w-8 max-[480px]:h-8 max-[480px]:min-w-8 max-[480px]:min-h-8 max-[480px]:rounded-lg
          "
        />
        <h1
          className="
            flex items-center gap-2.5 m-0 p-0
            text-xl font-bold text-(--text-color)
            whitespace-nowrap overflow-hidden text-ellipsis
            [&>svg]:text-(--primary-color) [&>svg]:stroke-[2.5] [&>svg]:shrink-0 [&>svg]:w-[18px]
            max-[768px]:text-lg max-[768px]:gap-2
            max-[640px]:text-base max-[640px]:shrink
            max-[480px]:text-base max-[480px]:gap-1.5 max-[480px]:[&>svg]:w-4 max-[480px]:[&>svg]:h-4
          "
        >
          <User size={20} />
          <span>{user?.username ?? t("common.profile")}</span>
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 max-sm:flex-1 max-sm:justify-end max-sm:min-w-0">
        {/* Blocklist — error rengi (first-of-type) */}
        <Button
          onClick={() => navigate(ROUTER.USERS.BLOCKLIST)}
          icon={<UserLock size={20} />}
          title={t("common.block_user")}
          className="
            px-4 h-10 min-h-10 rounded-xl
            border-none cursor-pointer font-medium text-sm whitespace-nowrap
            shadow-(--card-shadow)
            bg-[rgba(var(--error-color-rgb),0.1)] text-(--error-color)
            transition-all duration-300 ease-in-out
            hover:bg-(--error-color) hover:text-white hover:-translate-y-0.5 hover:shadow-(--active-shadow)
            active:translate-y-0
            focus-visible:outline-2 focus-visible:outline-(--primary-color) focus-visible:-outline-offset-0.5
            max-[768px]:px-3 max-[768px]:h-9 max-[768px]:min-h-9
            max-[480px]:px-2.5 max-[480px]:h-8 max-[480px]:min-h-8 max-[480px]:gap-1.5 lg:w-[150px]
          "
        />

        {/* Friends */}
        {relationship?.friendship?.status !== FriendshipStatus.Accepted ||
          (!relationship?.friendship && (
            <Button
              icon={
                relationship?.friendship?.status ===
                  FriendshipStatus.Accepted &&
                relationship?.friendship?.isMuted ? (
                  <BellOff size={20} />
                ) : (
                  <BellRing size={20} />
                )
              }
              title={t("common.notifications")}
              className="
            px-4 h-10 min-h-10 rounded-xl
            border-none cursor-pointer font-medium text-sm whitespace-nowrap
            shadow-(--card-shadow)
            bg-[rgba(var(--primary-color-rgb),0.1)] text-(--primary-color)
            transition-all duration-300 ease-in-out
            hover:bg-(--primary-color) hover:text-white hover:-translate-y-0.5 hover:shadow-(--active-shadow)
            active:translate-y-0
            focus-visible:outline-2 focus-visible:outline-(--primary-color) focus-visible:-outline-offset-0.5
            max-[768px]:px-3 max-[768px]:h-9 max-[768px]:min-h-9
            max-[480px]:px-2.5 max-[480px]:h-8 max-[480px]:min-h-8 max-[480px]:gap-1.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(var(--primary-color-rgb),0.1)] disabled:hover:text-(--primary-color) disabled:hover:translate-y-0 disabled:hover:shadow-(--card-shadow) lg:w-[150px]
          "
            />
          ))}

        {/* Share */}
        <Button
          icon={<Share size={20} />}
          title={t("common.share")}
          className="
            px-4 h-10 min-h-10 rounded-xl
            border-none cursor-pointer font-medium text-sm whitespace-nowrap
            shadow-(--card-shadow)
            bg-[rgba(var(--primary-color-rgb),0.1)] text-(--primary-color)
            transition-all duration-300 ease-in-out
            hover:bg-(--primary-color) hover:text-white hover:-translate-y-0.5 hover:shadow-(--active-shadow)
            active:translate-y-0
            focus-visible:outline-2 focus-visible:outline-(--primary-color) focus-visible:-outline-offset-0.5
            max-[768px]:px-3 max-[768px]:h-9 max-[768px]:min-h-9
            max-[480px]:px-2.5 max-[480px]:h-8 max-[480px]:min-h-8 max-[480px]:gap-1.5
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[rgba(var(--primary-color-rgb),0.1)] disabled:hover:text-(--primary-color) disabled:hover:translate-y-0 disabled:hover:shadow-(--card-shadow) lg:w-[150px]
          "
        />
      </div>
    </header>
  );
};

export default ProfileHeader;
