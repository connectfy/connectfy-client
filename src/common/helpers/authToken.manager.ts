import { LOCAL_STORAGE_KEYS } from "@/common/enums/enums";
import { AuthTokenManagerType } from "../types/types";

class AuthTokenManager {
  private accessToken: string | null = null;
  private authenticateToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
  }

  getToken(type: AuthTokenManagerType) {
    switch (type) {
      case "accessToken":
        return this.accessToken;
      case "authenticateToken":
        return this.authenticateToken;
      default:
        return {
          accessToken: this.accessToken,
          authenticateToken: this.authenticateToken,
        };
    }
  }

  setToken({
    token,
    type,
  }: {
    token: string;
    type: Omit<AuthTokenManagerType, "all">;
  }) {
    switch (type) {
      case "accessToken":
        this.accessToken = token;
        localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
        break;
      case "authenticateToken":
        this.authenticateToken = token;
        break;
    }
  }

  clear(type: AuthTokenManagerType) {
    switch (type) {
      case "accessToken":
        this.accessToken = null;
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        break;
      case "authenticateToken":
        this.authenticateToken = null;
        break;
      default:
        this.accessToken = null;
        this.authenticateToken = null;
        localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
        break;
    }
  }
}

export const authTokenManager = new AuthTokenManager();
