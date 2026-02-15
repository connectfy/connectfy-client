import { ReactNode, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { getHomeRouteByStartup } from "@/common/utils/routes";
import { useAuthTokenManager } from "@/common/helpers/authToken.manager";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { useGetGeneralSettingsQuery } from "@/modules/settings/GeneralSettings/api/api";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const location = useLocation();

  // ✅ Əvvəlcə bütün hooks-ları çağırın
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");
  useGetMeQuery(undefined, {
    skip: !access_token,
  });

  // ✅ Sonra conditional logic
  if (!access_token) {
    return (
      <Navigate to={ROUTER.AUTH.MAIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

export function InsideProfile({ children }: AuthType) {
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  // Yalnız həqiqətən token varsa request at
  const { data: userData, isSuccess: isMeSuccess } = useGetMeQuery(undefined, {
    skip: !access_token,
  });

  const { data: generalSettings, isSuccess: isSettingsSuccess } =
    useGetGeneralSettingsQuery(undefined, {
      skip: !access_token,
    });

  // Hər iki data uğurla gəlibsə yönləndir
  if (access_token && isMeSuccess && isSettingsSuccess) {
    const startup =
      userData?.settings?.generalSettings?.startupPage ??
      generalSettings?.startupPage;
    return <Navigate to={getHomeRouteByStartup(startup)} replace />;
  }

  return <>{children}</>;
}

export function RedirectMain() {
  const navigate = useNavigate();
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  // Yalnız token varsa request atırıq
  const { data: userData, isSuccess: userLoaded } = useGetMeQuery(undefined, {
    skip: !access_token,
  });

  const { data: generalSettings, isSuccess: settingsLoaded } =
    useGetGeneralSettingsQuery(undefined, {
      skip: !access_token,
    });

  useEffect(() => {
    // 1. Token yoxdursa, birbaşa auth-a göndər və dayandır
    if (!access_token) {
      navigate(ROUTER.AUTH.MAIN, { replace: true });
      return;
    }

    // 2. Token varsa, datanın gəlməsini gözlə, sonra yönləndir
    if (userLoaded || settingsLoaded) {
      const startup =
        userData?.settings?.generalSettings?.startupPage ??
        generalSettings?.startupPage;
      navigate(getHomeRouteByStartup(startup), { replace: true });
    }
  }, [
    access_token,
    userLoaded,
    settingsLoaded,
    userData,
    generalSettings,
    navigate,
  ]);

  return null;
}
