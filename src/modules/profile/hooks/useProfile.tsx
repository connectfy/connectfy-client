import { useGetAccountQuery } from "@/modules/profile/api/api.ts";
import { useAuthStore } from "@/store/zustand/useAuthStore";

export function useProfile() {
  const { access_token } = useAuthStore();

  const result = useGetAccountQuery(undefined, {
    skip: !access_token,
  });

  return {
    profile: result.data,
    ...result,
  };
}
