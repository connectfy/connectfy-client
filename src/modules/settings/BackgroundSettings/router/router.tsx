import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import SettingsLoader from "@/components/Loader/Settings/SettingsLoader.tsx";

const BackgroundSettings = SettingsLoader(
  lazy(() => import("../ui/BackgroundSettings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.BACKGROUND,
    element: <BackgroundSettings />,
  },
];

export default routes;
