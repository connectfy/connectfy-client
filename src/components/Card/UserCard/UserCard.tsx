import NoProfilePhotoIcon from "@/assets/icons/NoProfilePhotoIcon";
import { ROUTER } from "@/common/constants/routet";
import { FriendshipStatus } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { ISearchUserResult } from "@/modules/users/AllUsers/types/types";
import { Clock, UserCheck, UserPlus } from "lucide-react";
import { FC } from "react";

interface IProps {
  user: ISearchUserResult;
  onToggleFriend: (id: string) => void;
}

const UserCard: FC<IProps> = ({ user, onToggleFriend }) => {
  const { _id, firstName, lastName, username, avatar, relationship } = user;
  const { navigate } = useAppNavigation();

  return (
    <li
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer group"
      style={{ background: "transparent" }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLLIElement).style.background =
          "var(--active-bg-2)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLLIElement).style.background = "transparent")
      }
    >
      {/* Avatar */}
      <div className="relative w-11 h-11 min-w-[44px] rounded-full overflow-hidden ring-2 ring-(--active-bg) shrink-0">
        {avatar?.url ? (
          <img
            src={avatar.url}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-(--active-bg-2)">
            <NoProfilePhotoIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className="flex-1 min-w-0"
        onClick={() => navigate(`${ROUTER.USERS.PROFILE}/${_id}`)}
      >
        <p
          className="text-sm font-semibold leading-tight truncate"
          style={{ color: "var(--text-color)" }}
        >
          {firstName} {lastName}
        </p>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "var(--muted-color)" }}
        >
          @{username}
        </p>
      </div>

      {/* Add / Friend button */}
      <Button
        onClick={() => onToggleFriend(_id)}
        // aria-label={relationship?.status ? "Remove friend" : "Add friend"}
        className="p-2 rounded-lg shrink-0 transition-all duration-200"
        style={{
          background:
            relationship?.status === FriendshipStatus.Accepted
              ? "var(--active-bg)"
              : "transparent",
          color: "var(--primary-color)",
          border: `1.5px solid ${relationship?.status === FriendshipStatus.Accepted ? "var(--primary-color)" : "var(--active-bg)"}`,
        }}
      >
        {!relationship ? (
          <UserPlus size={15} strokeWidth={2} />
        ) : relationship?.status === FriendshipStatus.Accepted ? (
          <UserCheck size={15} strokeWidth={2} />
        ) : (
          <Clock size={15} strokeWidth={2} />
        )}
      </Button>
    </li>
  );
};

export default UserCard;
