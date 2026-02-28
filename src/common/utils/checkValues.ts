import { v4 as uuid } from "uuid";
import { LOCAL_STORAGE_KEYS } from "../enums/enums";

export function checkEmptyString(value: string): boolean {
  return value.trim() !== "";
}

export function checkDeviceId(): string {
  const deviceId = localStorage.getItem(LOCAL_STORAGE_KEYS.DEVICE_ID);

  if (deviceId) return deviceId;

  const newDeviceId = uuid();
  localStorage.setItem(LOCAL_STORAGE_KEYS.DEVICE_ID, newDeviceId);
  return newDeviceId;
}
