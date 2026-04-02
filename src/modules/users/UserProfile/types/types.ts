import {
  FriendshipStatus,
  GENDER,
  SOCIAL_LINK_PLATFORM,
} from "@/common/enums/enums";
import { IPhoneNumber } from "@/modules/auth/types/types";
import { IAvatar } from "@/modules/profile/types/types";

export interface IFindOneUserResponse {
  user: IFindOneUser;
  profile: IFindOneProfile;
  relationship: IFindOneRelationship;
  actions: {
    canSendFriendRequest: boolean;
    canSendMessage: boolean;
  };
}

export interface IFindOneUser {
  _id: string;
  username: string;
  email: string | null;
  phoneNumber: IPhoneNumber | null;
  createdAt: Date;
}

export interface IFindOneProfile {
  _id: string;
  firstName: string;
  lastName: string;
  gender: GENDER | null;
  bio: string | null;
  location: string | null;
  avatar: IAvatar | null;
  birthdayDate: Date | null;
  lastSeen: Date;
}

export interface IFindOneRelationship {
  friendship: {
    _id: string;
    status: FriendshipStatus;
    isFavorite: boolean;
    isMuted: boolean;
  } | null;
  count: number;
}

export interface IFindOneActions {
  canSendFriendRequest: boolean;
  canSendMessage: boolean;
}

export interface IFindSocialLinkResponse {
  _id: string;
  userId: string;
  name: string;
  rank: number;
  url: string;
  platform: SOCIAL_LINK_PLATFORM;
  createdAt: Date;
  updatedAt: Date;
}
