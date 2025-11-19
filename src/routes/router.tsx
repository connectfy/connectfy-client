import { lazy } from "react";
import {
  InsideProfile,
  RedirectMain,
  RequireAuth,
} from "@/components/routeGuard/RequireAuth";
import { ROUTER } from "@/constants/routet";
import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader/Loader";

// ======================= LAYOUT
const AuthLayout = Loader(lazy(() => import("@/layouts/Auth/index")));
const BaseLayout = Loader(lazy(() => import("@/layouts/Base/index")));
const SettingsLayout = lazy(() => import("@/layouts/Settings/index"));

// ======================= AUTH
const Auth = lazy(() => import("@/pages/auth/pages/Main/index"));
const ForgotPassword = lazy(
  () => import("@/pages/auth/pages/ForgotPassword/index")
);
const VerifySignup = lazy(() => import("@/pages/auth/pages/Verify/index"));
const ResetPassword = lazy(
  () => import("@/pages/auth/pages/ResesPassword/index")
);

// ======================= TERMS AND CONDITIONS
const TermsAndConditions = lazy(
  () => import("@/pages/termsAndConditions/index")
);

// ======================= MESSENGER
const Messenger = lazy(() => import("@/pages/messenger/index"));

// ======================= SETTINGS
const Settings = lazy(() => import("@/pages/settings/Main/index"));
const GeneralSettings = lazy(() => import("@/pages/settings/General/index"));
const PrivacySettings = lazy(() => import("@/pages/settings/Privacy/index"));
const AccountSettings = lazy(() => import("@/pages/settings/Account/index"));
const NotificationSettings = lazy(
  () => import("@/pages/settings/Notification/index")
);
const BackgroundSettings = lazy(
  () => import("@/pages/settings/Background/index")
);

const routes = [
  // ======================= ROOT REDIRECT
  {
    path: "/",
    element: <RedirectMain />,
  },
  // ======================= AUTH
  {
    path: "/auth",
    element: (
      <InsideProfile>
        <AuthLayout />
      </InsideProfile>
    ),
    children: [
      {
        index: true,
        element: <Auth />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-account",
        element: <VerifySignup />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      { path: "*", element: <Navigate to={ROUTER.AUTH.MAIN} replace /> },
    ],
  },
  // ======================= TERMS AND CONDITIONS
  {
    path: ROUTER.TERMS_AND_CONDITIONS,
    element: <TermsAndConditions />,
  },
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
      {
        path: ROUTER.GROUPS.MAIN,
        element: <Messenger />,
      },
      {
        path: ROUTER.CHANNELS.MAIN,
        element: <Messenger />,
      },
      {
        path: ROUTER.USERS.MAIN,
        element: <Messenger />,
      },
      {
        path: ROUTER.NOTIFICATIONS.MAIN,
        element: <Messenger />,
      },
      {
        path: ROUTER.PROFILE.MAIN,
        element: <Messenger />,
      },
      // ======================= SETTINGS
      {
        path: ROUTER.SETTINGS.MAIN,
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Settings />,
          },
          {
            path: ROUTER.SETTINGS.GENERAL,
            element: <GeneralSettings />,
          },
          {
            path: ROUTER.SETTINGS.PRIVACY,
            element: <PrivacySettings />,
          },
          {
            path: ROUTER.SETTINGS.ACCOUNT,
            element: <AccountSettings />,
          },
          {
            path: ROUTER.SETTINGS.NOTİFİCATİON,
            element: <NotificationSettings />,
          },
          {
            path: ROUTER.SETTINGS.BACKGROUND,
            element: <BackgroundSettings />,
          },
        ],
      },
      { path: "*", element: <Navigate to={ROUTER.MESSENGER.MAIN} replace /> },
    ],
  },
];

export default routes;
