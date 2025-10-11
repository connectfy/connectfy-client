import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Resource } from "../../types/enum.types";
import { type RootState } from "@store/store";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTER } from "@constants/routet";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const { access_token } = useSelector(
    (state: RootState) => state[Resource.auth]
  );
  const location = useLocation();

  if (!access_token)
    <Navigate to={ROUTER.AUTH} state={{ from: location }} replace />;

  return children;
}
