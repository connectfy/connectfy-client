import { type ReactNode, useEffect } from "react";
import { Resource } from "@/types/enum.types";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { me } from "@/features/account/account/accountSlice";
import { setData as setGeneralSettings } from "@/features/account/settings/general/generalSettingsSlice";
import { setData as setPrivacySettings } from "@/features/account/settings/privacy/privacySettingsSlice";
import { setData as setNotificationSettings } from "@/features/account/settings/notification/notificationSettingsSlice";
import { jwtDecode } from "jwt-decode";
import { getHomeRouteByStartup } from "@/utils/routes";

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
  const { data: generalSettings } = useAppSelector(
    (state) => state[Resource.generalSettings]
  );
  const location = useLocation();

  if (access_token && userData) {
    const startup =
      userData?.settings?.generalSettings?.startupPage ??
      generalSettings?.startupPage;
    return (
      <Navigate
        to={getHomeRouteByStartup(startup)}
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
}

export function RedirectMain() {
  const navigate = useNavigate();
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.account]);
  const { data: generalSettings } = useAppSelector(
    (state) => state[Resource.generalSettings]
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!access_token) {
      navigate(ROUTER.AUTH.MAIN, { replace: true });
      return;
    }

    try {
      const decodedToken: any = jwtDecode(access_token);
      const currentTime = Date.now() / 1000;
      if (
        !decodedToken ||
        (decodedToken.exp && decodedToken.exp < currentTime)
      ) {
        localStorage.removeItem("access_token");
        navigate(ROUTER.AUTH.MAIN, { replace: true });
        return;
      }
    } catch (err) {
      localStorage.removeItem("access_token");
      navigate(ROUTER.AUTH.MAIN, { replace: true });
      return;
    }

    if (!userData) {
      dispatch(me());
      return;
    }

    const startup =
      userData?.settings?.generalSettings?.startupPage ??
      generalSettings?.startupPage;
    navigate(getHomeRouteByStartup(startup), { replace: true });
  }, [access_token, userData, generalSettings, dispatch, navigate]);

  return null;
}
