import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const Profile = lazy(() => import("../ui/Profile"));

const routes: RouteObject[] = [
  {
    path: ROUTER.PROFILE.MAIN,
    element: <Profile />,
  },
];

export default routes;
