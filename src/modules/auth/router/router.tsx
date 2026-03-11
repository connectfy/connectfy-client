import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const Main = lazy(() => import("../ui/Main/Main"));
const Login = lazy(() => import("../ui/Login/Login"));
const Signup = lazy(() => import("../ui/Signup/Signup"));
const VerifyLogin = lazy(() => import("../ui/VerifyLogin/VerifyLogin"));
const VerifySignup = lazy(() => import("../ui/VerifySignup/VerifySignup"));
const ForgotPassword = lazy(
  () => import("../ui/ForgotPassword/ForgotPassword"),
);
const ResetPassword = lazy(() => import("../ui/ResesPassword/ResetPassword"));

const routes: RouteObject[] = [
  {
    path: ROUTER.AUTH.MAIN,
    element: <Main />,
  },
  {
    path: ROUTER.AUTH.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTER.AUTH.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTER.AUTH.VERIFY_LOGIN,
    element: <VerifyLogin />,
  },
  {
    path: ROUTER.AUTH.VERIFY_SIGNUP,
    element: <VerifySignup />,
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
