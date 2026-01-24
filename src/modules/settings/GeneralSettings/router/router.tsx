import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import SettingsLoader from "@/components/Loader/Settings/SettingsLoader.tsx";

const GeneralSettings = SettingsLoader(
  lazy(() => import("../ui/GeneralSetttings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.GENERAL,
    element: <GeneralSettings />,
  },
];

export default routes;
