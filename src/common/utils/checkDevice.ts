import { v4 as uuid } from "uuid";

export function checkDeviceId(): string {
  const deviceId = localStorage.getItem("deviceId");

  if (deviceId) return deviceId;

  const newDeviceId = uuid();
  localStorage.setItem("deviceId", newDeviceId);
  return newDeviceId;
}
