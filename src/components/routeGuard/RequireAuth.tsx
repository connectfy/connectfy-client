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

  //  Əvvəlcə bütün hooks-ları çağırın
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");
  useGetMeQuery(undefined, {
    skip: !access_token,
  });

  // Sonra conditional logic
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
  const { isSuccess: isMeSuccess, isError: isMeError } = useGetMeQuery(
    undefined,
    {
      skip: !access_token,
    },
  );

  const { data: generalSettings, isSuccess: isSettingsSuccess } =
    useGetGeneralSettingsQuery(undefined, {
      skip: !access_token || !isMeSuccess || isMeError,
    });

  // Hər iki data uğurla gəlibsə yönləndir
  if (access_token && isMeSuccess && isSettingsSuccess) {
    const startup = generalSettings?.startupPage;
    return <Navigate to={getHomeRouteByStartup(startup)} replace />;
  }

  return <>{children}</>;
}

export function RedirectMain() {
  const navigate = useNavigate();
  const { getToken } = useAuthTokenManager();
  const access_token = getToken("accessToken");

  // Send request if there is a token
  const { isSuccess: userLoaded, isError: userError } = useGetMeQuery(
    undefined,
    {
      skip: !access_token,
    },
  );

  const { data: generalSettings, isSuccess: settingsLoaded } =
    useGetGeneralSettingsQuery(undefined, {
      skip: !userLoaded || userError,
    });

  useEffect(() => {
    // If no token, or the user request failed (invalid token), go to login
    if (!access_token || userError) {
      navigate(ROUTER.AUTH.MAIN, { replace: true });
      return;
    }

    // Only navigate once the settings (which contain the startupPage) are ready
    if (settingsLoaded) {
      const path = getHomeRouteByStartup(generalSettings?.startupPage);
      navigate(path, { replace: true });
    }
  }, [access_token, userError, settingsLoaded, generalSettings, navigate]);

  return null;
}
