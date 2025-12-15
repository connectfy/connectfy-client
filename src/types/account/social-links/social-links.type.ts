import { SOCIAL_LINK_PLATFORM } from "@/types/enum.types";

export interface ISocialLink {
  _id: string;
  userId: string;
  name: string;
  url: string;
  platform: SOCIAL_LINK_PLATFORM;
}
