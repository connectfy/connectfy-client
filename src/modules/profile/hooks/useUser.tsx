import { useGetMeQuery } from "@/modules/profile/api/api.ts";
import { PROVIDER } from "@/common/enums/enums.ts";
import { useAuthStore } from "@/hooks/useAuthStore";

export function useUser() {
  const { access_token } = useAuthStore();

  const result = useGetMeQuery(undefined, {
    skip: !access_token,
  });

  const user = result.data;
  const usesPasswordAuth = user?.provider === PROVIDER.PASSWORD;
  const usesOAuth = user?.provider === PROVIDER.GOOGLE;

  return {
    user,
    ...result,
    usesPasswordAuth,
    usesOAuth,
  };
}
