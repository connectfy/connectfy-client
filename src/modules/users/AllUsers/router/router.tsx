import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const AllUsers = ComponentLoader(lazy(() => import("../ui/AllUsers")));

const routes: RouteObject[] = [
  {
    path: ROUTER.USERS.SEARCH,
    element: <AllUsers />,
  },
];

export default routes;
