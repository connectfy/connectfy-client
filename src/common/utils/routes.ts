import { ROUTER } from "@/common/constants/routet";
import { STARTUP_PAGE } from "@/common/enums/enums";

export function getHomeRouteByStartup(startupPage?: STARTUP_PAGE) {
  switch (startupPage) {
    case STARTUP_PAGE.MESSENGER:
      return ROUTER.MESSENGER.MAIN;
    case STARTUP_PAGE.GROUPS:
      return ROUTER.GROUPS.MAIN;
    case STARTUP_PAGE.CHANNELS:
      return ROUTER.CHANNELS.MAIN;
    case STARTUP_PAGE.USERS:
      return ROUTER.USERS.MAIN;
    case STARTUP_PAGE.NOTIFICATION:
      return ROUTER.NOTIFICATIONS.MAIN;
    case STARTUP_PAGE.PROFILE:
      return ROUTER.PROFILE.MAIN;
    default:
      return ROUTER.MESSENGER.MAIN;
  }
}
