import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const Settings = lazy(() => import("../ui/Settings"));

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.MAIN,
    element: <Settings />,
  },
];

export default routes;
