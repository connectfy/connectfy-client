import { ArrowLeft, Settings, User, UserRoundX, Users } from "lucide-react";
import "./index.style.css";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useTranslation } from "react-i18next";

const ProfileHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="profile-header-actions">
      <div className="profile-header-left">
        <button
          className="profile-icon-btn profile-back-btn"
          title="Go back"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="profile-page-title">
          <User size={20} />
          {t("common.profile")}
        </h1>
      </div>

      <div className="profile-header-right">
        <button
          className="profile-icon-btn"
          title="Blocklist"
          aria-label="Manage blocked users"
          onClick={() => navigate(ROUTER.USERS.BLOCKLIST)}
        >
          <UserRoundX size={20} />
          <span className="profile-btn-label">{t("common.blocklist")}</span>
        </button>
        <button
          className="profile-icon-btn"
          title="Settings"
          aria-label="Open profile settings"
          onClick={() => navigate(ROUTER.USERS.FRIENDS)}
        >
          <Users size={20} />
          <span className="profile-btn-label">{t("common.my_friends")}</span>
        </button>
        <button
          className="profile-icon-btn"
          title="Settings"
          aria-label="Open profile settings"
          onClick={() => navigate(ROUTER.SETTINGS.MAIN)}
        >
          <Settings size={20} />
          <span className="profile-btn-label">{t("common.settings")}</span>
        </button>
      </div>
    </header>
  );
};

export default ProfileHeader;
