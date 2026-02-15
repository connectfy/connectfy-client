import { useState, useEffect, useCallback } from "react";
import { LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import { AuthTokenManagerType } from "../types/types";

const AUTH_EVENT_NAME = "auth-token-changed";

export const useAuthTokenManager = () => {
  const getStoredAccessToken = () =>
    localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);

  const [tokens, setTokens] = useState({
    accessToken: getStoredAccessToken(),
    authenticateToken: null as string | null,
  });

  // 1. Sinxronizasiya məntiqi: Digər hook instansiyalarını xəbərdar edirik
  useEffect(() => {
    const handleUpdate = () => {
      setTokens((prev) => ({
        ...prev,
        accessToken: getStoredAccessToken(),
      }));
    };

    // Həm digər tabları (storage), həm də eyni tabı (custom event) dinləyirik
    window.addEventListener("storage", handleUpdate);
    window.addEventListener(AUTH_EVENT_NAME, handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener(AUTH_EVENT_NAME, handleUpdate);
    };
  }, []);

  // 2. Token təyin etmə
  const setToken = useCallback(
    ({
      token,
      type,
    }: {
      token: string;
      type: Omit<AuthTokenManagerType, "all">;
    }) => {
      if (type === "accessToken") {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
        setTokens((prev) => ({ ...prev, accessToken: token }));
        window.dispatchEvent(new Event(AUTH_EVENT_NAME));
      } else if (type === "authenticateToken") {
        setTokens((prev) => ({ ...prev, authenticateToken: token }));
      }
    },
    [],
  );

  // 3. Token oxuma (Həmişə state-dən oxuyur ki, React render-i tetikləsin)
  const getToken = useCallback(
    (type: AuthTokenManagerType) => {
      if (type === "accessToken") return tokens.accessToken;
      if (type === "authenticateToken") return tokens.authenticateToken;
      return tokens;
    },
    [tokens],
  );

  // 4. Təmizləmə
  const clear = useCallback((type: AuthTokenManagerType) => {
    if (type === "accessToken" || type === "all") {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      setTokens((prev) => ({ ...prev, accessToken: null }));
    }

    if (type === "authenticateToken" || type === "all") {
      setTokens((prev) => ({ ...prev, authenticateToken: null }));
    }

    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }, []);

  return { setToken, getToken, clear, accessToken: tokens.accessToken };
};
