import { useAuthStore } from "@/hooks/useAuthStore";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useGetGeneralSettingsQuery } from "@/modules/settings/GeneralSettings/api/api.ts";

export function useGeneralSettings() {
  const { access_token } = useAuthStore();
  const { isSuccess, isError } = useUser();

  const result = useGetGeneralSettingsQuery(undefined, {
    skip: !access_token || !isSuccess || isError,
  });

  return {
    generalSettings: result.data,
    ...result,
  };
}
