import {
  GENDER,
  LANGUAGE,
  ProfilePhotoUpdateAction,
  PROVIDER,
  SOCIAL_LINK_PLATFORM,
} from "@/common/enums/enums";
import { IPhoneNumber } from "@/modules/auth/types/types";

export interface IAccount {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender: GENDER;
  bio: string | null;
  location: string | null;
  avatar: IAvatar | null;
  lastSeen: Date;
  birthdayDate: Date;
}

export interface IAvatar {
  key: string | null;
  url: string;
  isCustom: boolean;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber: IPhoneNumber;
  isTwoFactorEnabled: boolean;
  timeZone: string | null;
  location: string | null;
  provider: PROVIDER;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMe extends IUser {
  avatar: IAvatar | null;
  language: LANGUAGE;
}

export interface IEditProfile
  extends Partial<Omit<IAccount, "_id" | "userId" | "lastSeen">> {
  _id: string;
}

export interface IEditAvatar {
  _id: string;
  action: ProfilePhotoUpdateAction;
  avatar: IAvatar | null;
}

export interface IFindSocialLinks {
  userId: string;
  sort?: Record<string, 1 | -1>;
}

export interface ISocialLink {
  _id: string;
  userId: string;
  name: string;
  rank: number;
  url: string;
  platform: SOCIAL_LINK_PLATFORM;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddSocialLink {
  name: string | null;
  url: string | null;
  platform: SOCIAL_LINK_PLATFORM;
  userId: string;
}

export interface IEditSocialLink
  extends Partial<Omit<ISocialLink, "_id" | "userId">> {
  _id: string;
}

export interface IUpdateSocialLinkRank {
  links: {
    _id: string;
    rank: number;
  }[];
  userId: string;
}

export interface IRemoveSocialLink {
  _id: string;
}

export interface IRemoveAllSocialLinks {
  _ids: string[];
  userId: string;
}
