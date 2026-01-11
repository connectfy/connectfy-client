import { SecurityEvent } from "../types/types";

const listeners: Record<SecurityEvent, Function[]> = {
  FORCE_LOGOUT: [],
  SESSION_EXPIRED: [],
};

export const securityEvents = {
  on(event: SecurityEvent, cb: Function) {
    listeners[event].push(cb);
  },
  emit(event: SecurityEvent) {
    listeners[event].forEach((cb) => cb());
  },
};
