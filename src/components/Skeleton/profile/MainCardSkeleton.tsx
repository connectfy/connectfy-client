import { memo } from "react";
import { Skeleton } from "../Skeleton";

const MainCardSkeleton = memo(() => {
  return (
    <section
      className="flex flex-col items-center gap-6 p-8 mb-8 transition-all bg-(--auth-main-bg) rounded-[24px] shadow-(--card-shadow) md:p-10"
      role="status"
      aria-busy="true"
      aria-label="Loading profile card..."
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <Skeleton
          variant="avatar"
          className="w-[140px]! h-[140px]! md:w-[140px]! sm:w-[120px]! xs:w-[100px]! border-4 border-(--primary-color)"
        />
      </div>

      {/* Identity */}
      <div className="flex flex-col items-center gap-2 w-full max-w-[220px]">
        <Skeleton variant="text" width="75%" height="1.75rem" />
        <Skeleton variant="text" width="50%" height="1rem" />
        <Skeleton variant="text" width="60%" height="0.875rem" />
      </div>

      {/* Stats Container */}
      <div className="flex flex-col items-center w-full max-w-[400px] gap-4 p-4 rounded-2xl bg-(--active-bg-2) sm:flex-row sm:gap-6 sm:p-6 md:px-8">
        {/* Friends Stat */}
        <div className="flex flex-row items-center justify-center flex-1 gap-3 sm:flex-col sm:gap-1.5">
          <Skeleton variant="text" width="50px" height="1.5rem" />
          <Skeleton variant="text" width="70px" height="0.8rem" />
        </div>

        {/* Divider */}
        <div
          className="w-full h-px opacity-30 bg-(--border-color) sm:w-px sm:h-10"
          aria-hidden="true"
        />

        {/* Blocked Stat */}
        <div className="flex flex-row items-center justify-center flex-1 gap-3 sm:flex-col sm:gap-1.5">
          <Skeleton variant="text" width="50px" height="1.5rem" />
          <Skeleton variant="text" width="70px" height="0.8rem" />
        </div>
      </div>
    </section>
  );
});

MainCardSkeleton.displayName = "MainCardSkeleton";

export default MainCardSkeleton;
