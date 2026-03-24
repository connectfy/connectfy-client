import { createContext, useContext, ReactNode } from "react";
import { useGetMeQuery } from "@/modules/profile/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { IMe } from "@/modules/profile/types/types";
import { PROVIDER } from "@/common/enums/enums";

interface IUserContext {
  user: IMe | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  usesPasswordAuth: boolean;
  usesOAuth: boolean;
  hasPhoneNumber: boolean;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { access_token } = useAuthStore();

  // ✅ Bütün app üçün YALNIZ BİR dəfə subscribe olur
  const result = useGetMeQuery(undefined, { skip: !access_token });

  const user = result.data;

  const value: IUserContext = {
    user,
    isLoading: result.isLoading,
    isSuccess: result.isSuccess,
    isError: result.isError,
    usesPasswordAuth: user?.provider === PROVIDER.PASSWORD,
    usesOAuth: user?.provider === PROVIDER.GOOGLE,
    hasPhoneNumber: !!user?.phoneNumber?.fullPhoneNumber,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Hook — artıq API çağırmır, sadəcə context-dən oxuyur
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
