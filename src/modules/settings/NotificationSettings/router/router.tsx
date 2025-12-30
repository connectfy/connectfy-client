import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const NotificationSettings = lazy(() => import("../ui/NotificationSettings"));

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.NOTIFICATION,
    element: <NotificationSettings />,
  },
];

export default routes;
