import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const PrivacySettings = lazy(() => import("../ui/PrivacySettings"));

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.PRIVACY,
    element: <PrivacySettings />,
  },
];

export default routes;
