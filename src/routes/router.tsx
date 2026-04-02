import { lazy } from "react";
import {
  InsideProfile,
  RedirectMain,
  RequireAuth,
} from "@/components/routeGuard/RequireAuth";
import { ROUTER } from "@/common/constants/routet";
import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader/Main/Loader.tsx";

// ======================= LAYOUT
const AuthLayout = Loader(lazy(() => import("@/layouts/Auth/AuthLayout")));
const BaseLayout = Loader(lazy(() => import("@/layouts/Base/BaseLayout")));
const SettingsLayout = lazy(() => import("@/layouts/Settings/SettingsLayout"));
const UsersLayout = lazy(() => import("@/layouts/Users/UsersLayout"));

const Messenger = lazy(() => import("@/modules/messenger/ui/Messenger"));

// ======================= AUTH
import authRoutes from "@/modules/auth/router/router";

// ======================= TERMS AND CONDITIONS
import termsAndConditionsRoutes from "@/modules/termsAndConditions/router/router";

// ======================= USERS
import usersRoutes from "@/modules/users/Users/router/router";
import allUsersRoutes from "@/modules/users/AllUsers/router/router";
import userProfileRoutes from "@/modules/users/UserProfile/router/router";

// ======================= SETTINGS
import settingsRoutes from "@/modules/settings/Settings/router/router";
import generalSettingsRoutes from "@/modules/settings/GeneralSettings/router/router";
import accountSettingsRoutes from "@/modules/settings/AccountSettings/router/router";
import privacySettingsRoutes from "@/modules/settings/PrivacySettings/router/router";
import notificationSettingsRoutes from "@/modules/settings/NotificationSettings/router/router";

// ======================= PROFILE
import profileRoutes from "@/modules/profile/router/router";

const routes = [
  // ======================= ROOT REDIRECT
  {
    path: "/",
    element: <RedirectMain />,
  },
  // ======================= AUTH
  {
    path: "/",
    element: (
      <InsideProfile>
        <AuthLayout />
      </InsideProfile>
    ),
    children: [
      ...authRoutes,
      {
        path: "*",
        element: (
          <Navigate to={`${ROUTER.AUTH.LOGIN}?method=username`} replace />
        ),
      },
    ],
  },
  // ======================= TERMS AND CONDITIONS
  ...termsAndConditionsRoutes,
  // ======================= MAIN APP
  {
    path: "/",
    element: (
      <RequireAuth>
        <BaseLayout />
      </RequireAuth>
    ),
    children: [
      // ======================= MESSENGER
      {
        path: ROUTER.MESSENGER.MAIN,
        element: <Messenger />,
      },

      // ======================= PROFILE
      ...profileRoutes,
      ...userProfileRoutes,

      // ======================= USERS
      {
        path: "/",
        element: <UsersLayout />,
        children: [...usersRoutes, ...allUsersRoutes],
      },

      // ======================= SETTINGS
      {
        path: "/",
        element: <SettingsLayout />,
        children: [
          // {
          //   index: true,
          //   element: <Settings />,
          // },
          ...settingsRoutes,
          ...generalSettingsRoutes,
          ...accountSettingsRoutes,
          ...privacySettingsRoutes,
          ...notificationSettingsRoutes,
        ],
      },

      // ======================= *
      { path: "*", element: <Navigate to={ROUTER.MESSENGER.MAIN} replace /> },
    ],
  },
];

export default routes;
