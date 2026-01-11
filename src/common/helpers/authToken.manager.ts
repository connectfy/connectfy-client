import { LOCAL_STORAGE_KEYS } from "@/common/enums/enums";

class AuthTokenManager {
  private accessToken: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN
    );
  }

  getToken() {
    return this.accessToken;
  }

  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
      token
    );
  }

  clear() {
    this.accessToken = null;
    localStorage.removeItem(
      LOCAL_STORAGE_KEYS.ACCESS_TOKEN
    );
  }
}

export const authTokenManager = new AuthTokenManager();
