import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api.ts";

export function usePrivacySettings() {
  const result = useGetPrivacySettingsQuery();

  return {
    privacySettings: result.data,
    ...result,
  };
}
