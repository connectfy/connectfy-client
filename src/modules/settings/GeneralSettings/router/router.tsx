import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const GeneralSettings = ComponentLoader(
  lazy(() => import("../ui/GeneralSetttings")),
);

const routes: RouteObject[] = [
  {
    path: ROUTER.SETTINGS.GENERAL,
    element: <GeneralSettings />,
  },
];

export default routes;
