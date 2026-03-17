import { memo } from "react";
import { Skeleton } from "../Skeleton";
import "@/modules/profile/ui/components/ProfileHeader/profileHeader.style.css";

const ProfileHeaderSkeleton = memo(() => {
  return (
    <header
      className="profile-header-actions"
      role="status"
      aria-busy="true"
      aria-label="Loading profile header..."
    >
      <div className="profile-header-left">
        <div className="profile-back-btn p-0 border-none bg-transparent hover:transform-none hover:bg-transparent cursor-default">
          <Skeleton variant="text" width={35} height={35} />
        </div>
        <div className="profile-page-title inline-block">
          <Skeleton variant="text" width={120} height={28} />
        </div>
      </div>

      <div className="profile-header-right">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="profile-icon-btn p-0 border-none bg-transparent hover:transform-none hover:bg-transparent cursor-default shadow-none"
          >
            <Skeleton variant="text" width={35} height={35} />
          </div>
        ))}
      </div>
    </header>
  );
});

ProfileHeaderSkeleton.displayName = "ProfileHeaderSkeleton";

export default ProfileHeaderSkeleton;
