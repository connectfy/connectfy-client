import { lazy } from "react";
import Loader from "@/components/Loader/Loader";
import { ROUTER } from "@/constants/routet";
import {
  InsideProfile,
  RequireAuth,
} from "@/components/routeGuard/RequireAuth";
import AuthLayout from "@/layouts/AuthLayout";
import { Navigate } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ====================== AUTH
const Auth = Loader(lazy(() => import("@/pages/auth/pages/main/index")));
const ForgotPassword = Loader(
  lazy(() => import("@/pages/auth/pages/ForgotPassword/index"))
);
const VerifySignup = Loader(
  lazy(() => import("@/pages/auth/pages/Verify/index"))
);
const ResetPassword = Loader(
  lazy(() => import("@/pages/auth/pages/ResesPassword/index"))
);

// ====================== TERMS AND CONDITIONS
const TermsAndConditions = Loader(
  lazy(() => import("@/pages/termsAndConditions/index"))
);

// ====================== MESSENGER
const Messenger = Loader(lazy(() => import("@/pages/messenger/index")));

const routes = [
  {
    path: "/",
    element: (
      <InsideProfile>
        <AuthLayout />
      </InsideProfile>
    ),
    children: [
      // ====================== AUTH
      {
        path: ROUTER.AUTH.MAIN,
        element: <Auth />,
      },
      {
        path: ROUTER.AUTH.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: ROUTER.AUTH.VERIFY_ACCOUNT,
        element: <VerifySignup />,
      },
      {
        path: ROUTER.AUTH.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: "*",
        element: <Navigate to={ROUTER.AUTH.MAIN} replace />,
      },
    ],
  },

  // ====================== TERMS AND CONDITIONS
  {
    path: ROUTER.TERMS_AND_CONDITIONS,
    element: <TermsAndConditions />,
  },

  // ====================== MESSENGER
  {
    path: "/",
    element: (
      <RequireAuth>
        <BaseLayout />
      </RequireAuth>
    ),
    children: [
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
      {
        path: ROUTER.SETTINGS.MAIN,
        element: <Messenger />,
      },
      {
        path: "*",
        element: <Navigate to={ROUTER.MESSENGER.MAIN} replace />,
      },
    ],
  },
];

export default routes;
