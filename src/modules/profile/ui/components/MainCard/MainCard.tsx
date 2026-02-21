import { UserRoundX, Users } from "lucide-react";
import "./mainCard.style.css";
import { useTranslation } from "react-i18next";
import { useGetAccountQuery, useGetMeQuery } from "@/modules/profile/api/api";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";

const MainCard = () => {
  const { t } = useTranslation();

  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  const { data: user } = useGetMeQuery(undefined, {
    skip: !access_token,
  });
  const { data: profile } = useGetAccountQuery(undefined, {
    skip: !access_token,
  });

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
