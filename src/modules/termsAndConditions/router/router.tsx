import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ROUTER } from "@/common/constants/routet";
import Loader from "@/components/Loader/Loader";

const TermsAndConditions = Loader(lazy(() => import("../ui/TermsAndConditions")));

const routes: RouteObject[] = [
  {
    path: ROUTER.TERMS_AND_CONDITIONS,
    element: <TermsAndConditions />,
  },
];

export default routes;
