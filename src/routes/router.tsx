import { lazy } from "react";
import Loader from "@/components/Loader/Loader";
import { ROUTER } from "@/constants/routet";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Auth = Loader(lazy(() => import("@/pages/auth/pages/main/index")));
const ForgotPassword = Loader(
  lazy(() => import("@/pages/auth/pages/ForgotPassword/index"))
);
const VerifySignup = Loader(
  lazy(() => import("@/pages/auth/pages/Verify/index"))
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
];

export default routes;
