import { lazy } from "react";
import Loader from "@/components/Loader/Loader";
import { ROUTER } from "@/constants/routet";

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

const routes = [
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
    path: ROUTER.TERMS_AND_CONDITIONS,
    element: <TermsAndConditions />,
  },
];

export default routes;
