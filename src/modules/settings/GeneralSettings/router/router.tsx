import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";

const GeneralSetttings = lazy(() => import("../ui/GeneralSetttings"));

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.GENERAL,
    element: <GeneralSetttings />,
  },
];

export default routes;
