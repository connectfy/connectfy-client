import { useAuthStore } from "@/hooks/useAuthStore";
import { useUser } from "@/modules/profile/hooks/useUser";
import { useGetNotificationSettingsQuery } from "@/modules/settings/NotificationSettings/api/api.ts";

export function useNotificationSettings() {
  const { access_token } = useAuthStore();
  const { isSuccess, isError } = useUser();

  const result = useGetNotificationSettingsQuery(undefined, {
    skip: !access_token || !isSuccess || isError,
  });

  return {
    notificationSettings: result.data,
    ...result,
  };
}
