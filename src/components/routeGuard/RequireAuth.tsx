import { ReactNode, useEffect } from "react";
import { RESOURCE } from "@/common/enums/enums";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { me } from "@/modules/profile/api/api.ts";
import { setData as setGeneralSettings } from "@/modules/settings/GeneralSettings/api/api.ts";
import { setData as setPrivacySettings } from "@/modules/settings/PrivacySettings/api/api.ts";
import { setData as setNotificationSettings } from "@/modules/settings/NotificationSettings/api/api.ts";
import { getHomeRouteByStartup } from "@/common/utils/routes";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // ✅ Əvvəlcə bütün hooks-ları çağırın
  const { access_token } = useAppSelector((state) => state[RESOURCE.AUTH]);
  const { me: userData } = useAppSelector((state) => state[RESOURCE.PROFILE]);

  useEffect(() => {
    if (access_token && !userData) {
      dispatch(me());
    }
  }, [dispatch, userData, access_token]);

  useEffect(() => {
    if (userData?.settings?.generalSettings) {
      dispatch(setGeneralSettings(userData.settings.generalSettings));
      dispatch(setPrivacySettings(userData.settings.privacySettings));
      dispatch(setNotificationSettings(userData.settings.notificationSettings));
    }
  }, [userData, dispatch]);

  // ✅ Sonra conditional logic
  if (!access_token) {
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

export function InsideProfile({ children }: AuthType) {
  const location = useLocation();

  // ✅ Bütün hooks-lar birlikdə
  const { access_token } = useAppSelector((state) => state[RESOURCE.AUTH]);
  const { me: userData } = useAppSelector((state) => state[RESOURCE.PROFILE]);
  const { data: generalSettings } = useAppSelector(
    (state) => state[RESOURCE.GENERAL_SETTINGS]
  );

  // ✅ Conditional logic sonunda
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
  const dispatch = useAppDispatch();

  // ✅ Bütün hooks-lar birlikdə
  const { access_token } = useAppSelector((state) => state[RESOURCE.AUTH]);
  const { me: userData } = useAppSelector((state) => state[RESOURCE.PROFILE]);
  const { data: generalSettings } = useAppSelector(
    (state) => state[RESOURCE.GENERAL_SETTINGS]
  );

  useEffect(() => {
    if (!access_token) {
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
