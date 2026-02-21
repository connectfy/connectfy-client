import {
  GENDER,
  LANGUAGE,
  PROVIDER,
  ROLE,
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
  avatar: string | null;
  lastSeen: Date;
  birthdayDate: Date;
}

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: ROLE;
  provider: PROVIDER;
  phoneNumber: IPhoneNumber | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMe extends IUser {
  avatar: string | null;
  language: LANGUAGE;
}

export interface ISocialLink {
  _id: string;
  userId: string;
  name: string;
  url: string;
  platform: SOCIAL_LINK_PLATFORM;
}
