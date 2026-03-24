import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetGeneralSettingsQuery } from "@/modules/settings/GeneralSettings/api/api.ts";
import { useGetMeQuery } from "@/modules/profile/api/api";

export function useGeneralSettings() {
  const { access_token } = useAuthStore();
  const { isMeLoaded } = useGetMeQuery(undefined, {
    skip: !access_token,
    selectFromResult: (result) => ({ isMeLoaded: result.isSuccess }),
  });

  const result = useGetGeneralSettingsQuery(undefined, {
    skip: !access_token || !isMeLoaded,
  });

  return {
    generalSettings: result.data,
    ...result,
  };
}
