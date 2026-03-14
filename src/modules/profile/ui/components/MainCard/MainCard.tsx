import { UserRoundX, Users } from "lucide-react";
import "./mainCard.style.css";
import { useTranslation } from "react-i18next";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useProfile } from "@/modules/profile/hooks/useProfile";

const MainCard = () => {
  const { t } = useTranslation();

  const { user } = useUser();
  const { profile } = useProfile();

  return (
    <section
      className="profile-main-section"
      aria-labelledby="profile-main-heading"
    >
      <div className="profile-avatar-wrapper">
        <img
          src={profile?.avatar ?? ""}
          alt={`Profile picture of ${profile?.firstName} ${profile?.lastName}`}
          className="profile-avatar"
          loading="lazy"
          width={140}
          height={140}
        />
      </div>

      <div className="profile-identity">
        <h1 id="profile-main-heading" className="profile-fullname">
          {profile?.firstName} {profile?.lastName}
        </h1>
        <p className="profile-username">@{user?.username}</p>
        <p className="profile-last-seen">
          {t("common.lastSeen")}:{" "}
          {new Date(profile?.lastSeen as Date).toLocaleDateString()}
        </p>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat-item">
          <Users size={18} aria-hidden="true" />
          <span className="profile-stat-value">15</span>
          <span className="profile-stat-label">{t("common.friends")}</span>
        </div>
        <div className="profile-stat-divider" aria-hidden="true" />
        <div className="profile-stat-item">
          <UserRoundX size={18} aria-hidden="true" />
          <span className="profile-stat-value">5</span>
          <span className="profile-stat-label">{t("common.blocked")}</span>
        </div>
      </div>
    </section>
  );
};

export default MainCard;
