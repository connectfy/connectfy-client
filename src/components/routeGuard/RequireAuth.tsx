import { ReactNode, useEffect } from "react";
import { Resource } from "@/types/enum.types";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/constants/routet";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { me } from "@/features/auth/user/userSlice";
import { setData as setGeneralSettings } from "@/features/account/settings/general/generalSettingsSlice";
import { setData as setPrivacySettings } from "@/features/account/settings/privacy/privacySettingsSlice";
import { setData as setNotificationSettings } from "@/features/account/settings/notification/notificationSettingsSlice";
import { getHomeRouteByStartup } from "@/utils/routes";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // ✅ Əvvəlcə bütün hooks-ları çağırın
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.user]);

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
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.user]);
  const { data: generalSettings } = useAppSelector(
    (state) => state[Resource.generalSettings]
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
  const { access_token } = useAppSelector((state) => state[Resource.auth]);
  const { me: userData } = useAppSelector((state) => state[Resource.user]);
  const { data: generalSettings } = useAppSelector(
    (state) => state[Resource.generalSettings]
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
