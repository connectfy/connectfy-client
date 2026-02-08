import { UserRoundX, Users } from "lucide-react";
import "./mainCard.style.css";
import { useTranslation } from "react-i18next";
import { useGetMeQuery } from "@/modules/profile/api/api";

const MainCard = () => {
  const { t } = useTranslation();
  const { data: profile } = useGetMeQuery();

  return (
    <section
      className="profile-main-section"
      aria-labelledby="profile-main-heading"
    >
      <div className="profile-avatar-wrapper">
        <img
          src={profile?.account.avatar ?? ""}
          alt={`Profile picture of ${profile?.account.firstName} ${profile?.account.lastName}`}
          className="profile-avatar"
          loading="lazy"
          width={140}
          height={140}
        />
      </div>

      <div className="profile-identity">
        <h1 id="profile-main-heading" className="profile-fullname">
          {profile?.account.firstName} {profile?.account.lastName}
        </h1>
        <p className="profile-username">@{profile?.user.username}</p>
        <p className="profile-last-seen">
          {t("common.lastSeen")}:{" "}
          {new Date(profile?.account.lastSeen as Date).toLocaleDateString()}
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
