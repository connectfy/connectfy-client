import { lazy } from "react";
import Loader from "@/components/Loader/Loader";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const Auth = Loader(lazy(() => import("@/pages/auth/index")));

const routes = [
  {
    path: "/auth",
    element: <Auth />,
  },
];

export default routes;
