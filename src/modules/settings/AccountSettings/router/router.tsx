import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import SettingsLoader from "@/components/Loader/Settings/SettingsLoader.tsx";

const AccountSettings = SettingsLoader(
  lazy(() => import("../ui/AccountSettings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.ACCOUNT,
    element: <AccountSettings />,
  },
];

export default routes;
