import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetNotificationSettingsQuery } from "@/modules/settings/NotificationSettings/api/api.ts";
import { useGetMeQuery } from "@/modules/profile/api/api";

export function useNotificationSettings() {
  const { access_token } = useAuthStore();
  const { isMeLoaded } = useGetMeQuery(undefined, {
    skip: !access_token,
    selectFromResult: (result) => ({ isMeLoaded: result.isSuccess }),
  });

  const result = useGetNotificationSettingsQuery(undefined, {
    skip: !access_token || !isMeLoaded,
  });

  return {
    notificationSettings: result.data,
    ...result,
  };
}
