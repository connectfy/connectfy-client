import { FC, memo, ReactNode } from "react";
import "./usersLayout.style.css";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import UniqueSidebar from "@/components/Sidebar/UniqueSidebar/UniqueSidebar";
import { useTranslation } from "react-i18next";
import { ROUTER } from "@/common/constants/routet";
import {
  Users,
  UserSearch,
  UsersIcon,
  UserPlus,
  UserRoundX,
  UserStar,
} from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useIsMobile } from "@/hooks/useIsMobile";

interface Props {
  children?: ReactNode;
}

const UsersLayout: FC<Props> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();

  const TITLE = {
    name: t("common.users"),
    icon: Users,
  };

  const SUBJECTS = [
    {
      name: t("common.find_user"),
      path: ROUTER.USERS.SEARCH,
      icon: UserSearch,
      key: "search",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.SEARCH),
    },
    {
      name: t("common.friends"),
      path: ROUTER.USERS.FRIENDS,
      icon: UsersIcon,
      key: "friends",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.FRIENDS),
    },
    {
      name: t("common.close_friends"),
      path: ROUTER.USERS.CLOSE_FRIENDS,
      icon: UserStar,
      key: "close-friends",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.CLOSE_FRIENDS),
    },
    {
      name: t("common.friendship_requests"),
      path: ROUTER.USERS.REQUESTS,
      icon: UserPlus,
      key: "requests",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.REQUESTS),
    },
    {
      name: t("common.muted_users"),
      path: ROUTER.USERS.MUTED,
      icon: UserRoundX,
      key: "muted",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.MUTED),
    },
    {
      name: t("common.blocked_users"),
      path: ROUTER.USERS.BLOCKLIST,
      icon: UserRoundX,
      key: "blocklist",
      badge: null,
      onClick: () => navigate(ROUTER.USERS.BLOCKLIST),
    },
  ];

  const isMobile = useIsMobile();

  const isIndex = Boolean(
    matchPath({ path: ROUTER.USERS.MAIN, end: true }, location.pathname),
  );

  if (!isMobile) {
    return (
      <section id="users-layout" className="users-layout desktop">
        <div className="users-layout__sidebar">
          <UniqueSidebar title={TITLE} subjects={SUBJECTS} />
        </div>
        <div className="users-layout__content">{children || <Outlet />}</div>
      </section>
    );
  }

  if (isMobile && isIndex) {
    return (
      <section id="users-layout" className="users-layout mobile sidebar-only">
        <div className="users-layout__sidebar-mobile">
          <UniqueSidebar title={TITLE} subjects={SUBJECTS} />
        </div>
      </section>
    );
  }

  return (
    <section id="users-layout" className="users-layout mobile content-only">
      <div className="users-layout__content">{children || <Outlet />}</div>
    </section>
  );
};

export default memo(UsersLayout);
