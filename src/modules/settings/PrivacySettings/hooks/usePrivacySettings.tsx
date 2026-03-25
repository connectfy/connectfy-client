import { useAuthStore } from "@/store/zustand/useAuthStore";
import { useUser } from "@/context/UserContext";
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
