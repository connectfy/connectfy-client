import { memo } from "react";
import { Skeleton } from "../Skeleton";

const SocialLinkSkeleton = memo(() => {
  return (
    <section
      className="p-8 mb-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
      role="status"
      aria-busy="true"
      aria-label="Loading bio..."
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3">
          <Skeleton variant="text" width={160} height={28} />
        </div>
        <Skeleton variant="text" width={35} height={35} />
      </div>

      {/* Bio Content */}
      <div className="p-6 rounded-xl bg-(--info-card-bg) border border-(--info-card-border)">
        <Skeleton variant="text" width="100%" height="1em" className="mb-3" />
        <Skeleton variant="text" width="90%" height="1em" className="mb-3" />
        <Skeleton variant="text" width="75%" height="1em" />
      </div>
    </section>
  );
});

SocialLinkSkeleton.displayName = "SocialLinkSkeleton";

export default SocialLinkSkeleton;
