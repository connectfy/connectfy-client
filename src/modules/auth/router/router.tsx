import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const Main = lazy(() => import("../ui/Main/Main"));
const Verify = lazy(() => import("../ui/Verify/Verify"));
const ForgotPassword = lazy(
  () => import("../ui/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("../ui/ResesPassword/ResetPassword"));

const routes: RouteObject[] = [
  {
    path: ROUTER.AUTH.MAIN,
    element: <Main />,
  },
  {
    path: ROUTER.AUTH.VERIFY_ACCOUNT,
    element: <Verify />,
  },
  {
    path: ROUTER.AUTH.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: ROUTER.AUTH.RESET_PASSWORD,
    element: <ResetPassword />,
  },
];

export default routes;
