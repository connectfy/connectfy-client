import { type ReactNode, useEffect } from "react";
import { Resource } from "@/types/enum.types";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { me } from "@/features/account/account/accountSlice";
import { setData as setGeneralSettings } from "@/features/account/settings/general/generalSettingsSlice";
import { setData as setPrivacySettings } from "@/features/account/settings/privacy/privacySettingsSlice";
import { setData as setNotificationSettings } from "@/features/account/settings/notification/notificationSettingsSlice";
import { jwtDecode } from "jwt-decode";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const dispatch = useAppDispatch();
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.account]);
  const location = useLocation();

  if (!access_token) {
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  try {
    const decodedToken: any = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;

    if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
      localStorage.removeItem("access_token");
      return (
        <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
      );
    }
  } catch (error) {
    localStorage.removeItem("access_token");
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  useEffect(() => {
    if (!userData) {
      dispatch(me());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData?.settings?.generalSettings) {
      dispatch(setGeneralSettings(userData.settings.generalSettings));
      dispatch(setPrivacySettings(userData.settings.privacySettings));
      dispatch(setNotificationSettings(userData.settings.notificationSettings));
    }
  }, [userData, dispatch]);

  return <>{children}</>;
}

export function InsideProfile({ children }: AuthType) {
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.account]);
  const location = useLocation();

  if (access_token && userData) {
    return (
      <Navigate to={ROUTER.MESSENGER.MAIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

export function RedirectMain() {
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const location = useLocation();

  if (!access_token) {
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  try {
    const decodedToken: any = jwtDecode(access_token);
    const currentTime = Date.now() / 1000;

    if (!decodedToken || (decodedToken.exp && decodedToken.exp < currentTime)) {
      localStorage.removeItem("access_token");
      return (
        <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
      );
    }
  } catch (error) {
    localStorage.removeItem("access_token");
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  return <Navigate to={ROUTER.MESSENGER.MAIN} replace />;
}
