import { memo } from "react";
import { Skeleton } from "../Skeleton";

const PersonalInformationSkeleton = memo(() => {
  const items = Array.from({ length: 5 });

  return (
    <section
      className="p-8 mb-8 px-4 md:px-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
      role="status"
      aria-busy="true"
      aria-label="Loading personal information..."
    >
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8">
        <div className="flex items-center gap-2 md:gap-3">
          <Skeleton variant="text" width={160} height={28} />
        </div>
        <Skeleton variant="text" width={35} height={35} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 lg:px-5 bg-(--info-card-bg) border border-(--info-card-border) rounded-xl"
          >
            {/* Icon Box */}
            <Skeleton
              variant="rect"
              className="rounded-xl w-10 h-10 md:w-12 md:h-12 shrink-0"
            />

            {/* Content */}
            <div className="flex flex-col flex-1 gap-2 overflow-hidden">
              <Skeleton variant="text" width="40%" height="0.7rem" />
              <Skeleton variant="text" width="70%" height="1rem" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

PersonalInformationSkeleton.displayName = "PersonalInformationSkeleton";

export default PersonalInformationSkeleton;
