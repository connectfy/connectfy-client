import { type ReactNode } from "react";
import { Resource } from "@/types/enum.types";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppSelector } from "@/hooks/useStore";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const location = useLocation();

  if (!access_token)
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );

  return children;
}

export function InsideProfile({ children }: AuthType) {
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const location = useLocation();

  if (access_token)
    return <Navigate to={ROUTER.MESSENGER.MAIN} state={{ from: location }} replace />;

  return children;
}
