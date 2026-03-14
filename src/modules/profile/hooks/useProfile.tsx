import { useGetAccountQuery } from "@/modules/profile/api/api.ts";
import { useUser } from "./useUser";
import { useAuthStore } from "@/hooks/useAuthStore";

export function useProfile() {
  const { access_token } = useAuthStore();
  const { isSuccess, isError } = useUser();

  const result = useGetAccountQuery(undefined, {
    skip: !access_token || !isSuccess || isError,
  });

  return {
    profile: result.data,
    ...result,
  };
}
