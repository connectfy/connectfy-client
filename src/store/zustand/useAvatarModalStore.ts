import { create } from "zustand";
import { IAvatar, IDefaultAvatar } from "@/modules/profile/types/types";

interface AvatarModalStore {
  // Shared Data
  avatarUrl: string;
  avatarObj: IAvatar | null | undefined;
  username?: string;
  userId?: string;
  profileId: string;
  defaultAvatarObj: IDefaultAvatar | null;

  // Show Avatar Modal
  isShowModalOpen: boolean;
  onOpenShowModal: (
    url: string,
    name?: string,
    userId?: string,
    profileId?: string,
  ) => void;
  onCloseShowModal: () => void;

  // Change Avatar Modal
  isChangeModalOpen: boolean;
  onOpenChangeModal: (avatar?: IAvatar | null, profileId?: string) => void;
  onCloseChangeModal: () => void;

  // Upload Avatar Modal
  isUploadModalOpen: boolean;
  onOpenUploadModal: () => void;
  onCloseUploadModal: () => void;

  // Set Default Avatar Modal
  isSetDefaultModalOpen: boolean;
  onOpenSetDefaultModal: (
    profileId: string,
    defaultAvatar?: IDefaultAvatar,
  ) => void;
  onCloseSetDefaultModal: () => void;
}

export const useAvatarModalStore = create<AvatarModalStore>((set) => ({
  // Shared Data
  avatarUrl: "",
  avatarObj: null,
  username: "",
  userId: "",
  profileId: "",
  defaultAvatarObj: null,

  // Show Avatar Modal
  isShowModalOpen: false,
  onOpenShowModal: (url, name, userId, profileId) =>
    set({
      isShowModalOpen: true,
      avatarUrl: url,
      username: name,
      userId,
      profileId: profileId || "",
    }),
  onCloseShowModal: () => set({ isShowModalOpen: false }),

  // Change Avatar Modal
  isChangeModalOpen: false,
  onOpenChangeModal: (avatar, profileId) =>
    set({
      isShowModalOpen: false, // Digərini bağlayıb bunu açırıq
      isChangeModalOpen: true,
      avatarObj: avatar,
      profileId: profileId || "",
    }),
  onCloseChangeModal: () => set({ isChangeModalOpen: false }),

  // Upload Avatar Modal
  isUploadModalOpen: false,
  onOpenUploadModal: () =>
    set({
      isChangeModalOpen: false, // Digərini bağlayıb bunu açırıq
      isUploadModalOpen: true,
    }),
  onCloseUploadModal: () => set({ isUploadModalOpen: false }),

  // Set Default Avatar Modal
  isSetDefaultModalOpen: false,
  onOpenSetDefaultModal: (profileId, defaultAvatar) =>
    set({
      isChangeModalOpen: false,
      isSetDefaultModalOpen: true,
      defaultAvatarObj: defaultAvatar,
      profileId: profileId || "",
    }),
  onCloseSetDefaultModal: () => set({ isSetDefaultModalOpen: false }),
}));
