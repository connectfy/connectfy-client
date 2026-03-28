import { FriendshipStatus } from "@/common/enums/enums";
import { IAvatar } from "@/modules/profile/types/types";

export interface ISearchUserResult {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: IAvatar | null;
  relationship: {
    _id: string;
    status: FriendshipStatus;
  } | null;
  friendshipRequest: boolean;
}

export interface ISearchUsers {
  search: string;
  limit: number;
  skip: number;
}
