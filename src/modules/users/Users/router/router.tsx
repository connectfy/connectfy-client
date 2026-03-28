import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import ComponentLoader from "@/components/Loader/Components/ComponentLoader";

const Users = ComponentLoader(lazy(() => import("../ui/Users")));

const routes: RouteObject[] = [
  {
    path: ROUTER.USERS.MAIN,
    element: <Users />,
  },
];

export default routes;
