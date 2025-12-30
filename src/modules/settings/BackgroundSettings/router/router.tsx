import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const BackgroundSettings = lazy(() => import("../ui/BackgroundSettings"));

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.BACKGROUND,
    element: <BackgroundSettings />,
  },
];

export default routes;
