import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const NotificationSettings = ComponentLoader(
  lazy(() => import("../ui/NotificationSettings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.NOTIFICATION,
    element: <NotificationSettings />,
  },
];

export default routes;
