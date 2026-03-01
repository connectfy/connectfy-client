import { User } from "lucide-react";
import "./profileHeader.style.css";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";

const ProfileHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="profile-header-actions">
      <div className="profile-header-left">
        <Button
          className="profile-icon-btn profile-back-btn"
          aria-label={t("common.back")}
          onClick={() => navigate(-1)}
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              arrow_back
            </span>
          }
        />
        <h1 className="profile-page-title">
          <User size={20} />
          {t("common.profile")}
        </h1>
      </div>

      <div className="profile-header-right">
        <Button
          className="profile-icon-btn"
          onClick={() => navigate(ROUTER.USERS.BLOCKLIST)}
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              block
            </span>
          }
          title={t("common.blocklist")}
        />
        <Button
          className="profile-icon-btn"
          onClick={() => navigate(ROUTER.USERS.FRIENDS)}
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              people
            </span>
          }
          title={t("common.my_friends")}
        />
        <Button
          className="profile-icon-btn"
          onClick={() => navigate(ROUTER.SETTINGS.MAIN)}
          icon={
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              settings
            </span>
          }
          title={t("common.settings")}
        />
      </div>
    </header>
  );
};

export default ProfileHeader;
