import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { getHomeRouteByStartup } from "@/common/utils/routes";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUser } from "@/context/UserContext";
import { useGeneralSettings } from "@/modules/settings/GeneralSettings/hooks/useGeneralSettings";
import { useAppNavigation } from "@/hooks/useAppNavigation";

type AuthType = {
  children: ReactNode;
};

export function RequireAuth({ children }: AuthType) {
  const location = useLocation();

  //  Əvvəlcə bütün hooks-ları çağırın
  const { access_token } = useAuthStore();
  useUser();

  // Sonra conditional logic
  if (!access_token) {
    return (
      <Navigate to={ROUTER.AUTH.LOGIN} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
}

export function InsideProfile({ children }: AuthType) {
  const { access_token } = useAuthStore();

  // Yalnız həqiqətən token varsa request at
  const { isSuccess: isUserSuccess } = useUser();

  const { generalSettings, isSuccess: isSettingsSuccess } =
    useGeneralSettings();

  // Hər iki data uğurla gəlibsə yönləndir
  if (access_token && isUserSuccess && isSettingsSuccess) {
    const startup = generalSettings?.startupPage;
    return <Navigate to={getHomeRouteByStartup(startup)} replace />;
  }

  return <>{children}</>;
}

export function RedirectMain() {
  const { navigate } = useAppNavigation();
  const { access_token } = useAuthStore();

  // Send request if there is a token
  const { isError: isUserError } = useUser();

  const { generalSettings, isSuccess: settingsLoaded } = useGeneralSettings();

  useEffect(() => {
    // If no token, or the user request failed (invalid token), go to login
    if (!access_token || isUserError) {
      navigate(ROUTER.AUTH.LOGIN, { replace: true });
      return;
    }

    // Only navigate once the settings (which contain the startupPage) are ready
    if (settingsLoaded) {
      const path = getHomeRouteByStartup(generalSettings?.startupPage);
      navigate(path, { replace: true });
    }
  }, [access_token, isUserError, settingsLoaded, generalSettings, navigate]);

  return null;
}
