import { ArrowLeft, User, UserLock, Users, Settings } from "lucide-react";
import "./profileHeader.style.css";
import { ROUTER } from "@/common/constants/routet";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const ProfileHeader = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();

  return (
    <header className="profile-header-actions">
      <div className="profile-header-left">
        <Button
          className="profile-icon-btn profile-back-btn"
          aria-label={t("common.back")}
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={18} />}
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
          icon={<UserLock size={20} />}
          title={t("common.blocklist")}
        />
        <Button
          className="profile-icon-btn"
          onClick={() => navigate(ROUTER.USERS.FRIENDS)}
          icon={<Users size={20} />}
          title={t("common.my_friends")}
        />
        <Button
          className="profile-icon-btn"
          onClick={() => navigate(ROUTER.SETTINGS.MAIN)}
          icon={<Settings size={20} />}
          title={t("common.settings")}
        />
      </div>
    </header>
  );
};

export default ProfileHeader;
