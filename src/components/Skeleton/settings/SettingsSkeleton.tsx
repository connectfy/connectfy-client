import "./settingsSkeleton.style.css";
import { Skeleton } from "../Skeleton";
import { FC } from "react";

interface SettingsSkeletonProps {
  count?: number;
}

export const SettingsSkeleton: FC<SettingsSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="settings-skeleton-container">
      {Array.from({ length: count }).map((_, index) => (
        <div className="settings-skeleton-wrapper" key={index}>
          {/* Header: icon + title/subtitle */}
          <div className="settings-skeleton-header">
            <Skeleton variant="avatar" width={40} height={40} ariaLabel="" />
            <div className="settings-skeleton-titles">
              <Skeleton variant="text" width={80} height={14} ariaLabel="" />
              <Skeleton variant="text" width={48} height={12} ariaLabel="" />
            </div>
          </div>

          {/* Children rows */}
          <div
            className="settings-skeleton-children"
            role="status"
            aria-busy="true"
            aria-label="Loading settings..."
          >
            <Skeleton variant="rect" width="100%" height={48} ariaLabel="" />
          </div>
        </div>
      ))}
    </div>
  );
};
