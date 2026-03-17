import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const AccountSettings = ComponentLoader(
  lazy(() => import("../ui/AccountSettings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.ACCOUNT,
    element: <AccountSettings />,
  },
];

export default routes;
