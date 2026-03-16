import { useAuthStore } from "@/hooks/useAuthStore";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api.ts";

export function usePrivacySettings() {
  const { access_token } = useAuthStore();
  const { isSuccess, isError } = useUser();

  const result = useGetPrivacySettingsQuery(undefined, {
    skip: !access_token || !isSuccess || isError,
  });

  return {
    privacySettings: result.data,
    ...result,
  };
}
