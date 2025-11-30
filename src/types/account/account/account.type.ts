import { GENDER } from "@/types/enum.types";

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
}