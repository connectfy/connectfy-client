import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const BackgroundSettings = ComponentLoader(
  lazy(() => import("../ui/BackgroundSettings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.BACKGROUND,
    element: <BackgroundSettings />,
  },
];

export default routes;
