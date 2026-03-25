import { Fragment } from "react";
import { useAvatarModalStore } from "@/store/zustand/useAvatarModalStore";
import ShowAvatarModal from "../AvatarModal/ShowAvatarModal/ShowAvatarModal";
import ChangeAvatarModal from "@/components/Modal/AvatarModal/ChangeAvatarModal/ChangeAvatartModal";
import UploadAvatarModal from "@/components/Modal/AvatarModal/UploadAvatarModal/UploadAvatarModal"; // Yolunu düzəlt
import { useGetAccountQuery } from "@/modules/profile/api/api";
import { useUser } from "@/context/UserContext";
import ChangeDefaultAvatarModal from "../AvatarModal/ChangeDefaultAvatarModal/ChangeDefaultAvatarModal";

const GlobalModals = () => {
  const store = useAvatarModalStore();
  const { user } = useUser();

  const { isProfileLoading } = useGetAccountQuery(undefined, {
    skip: !user?._id || (!store.isChangeModalOpen && !store.isUploadModalOpen),
    selectFromResult: (result) => ({ isProfileLoading: result.isLoading }),
  });

  return (
    <Fragment>
      {/* 1. Show Avatar Modal */}
      <ShowAvatarModal
        open={store.isShowModalOpen}
        onClose={store.onCloseShowModal}
        avatarUrl={store.avatarUrl}
        username={store.username}
        userId={store.userId}
      />

      {/* 2. Change Avatar Modal */}
      <ChangeAvatarModal
        open={store.isChangeModalOpen}
        onClose={store.onCloseChangeModal}
        profileId={store.profileId}
        avatar={store.avatarObj}
        isProfileLoading={isProfileLoading}
      />

      {/* 3. Upload Avatar Modal */}
      <UploadAvatarModal
        open={store.isUploadModalOpen}
        onClose={store.onCloseUploadModal}
        profileId={store.profileId}
        isProfileLoading={isProfileLoading}
      />

      {/* 4. Change Default Avatar Modal */}
      <ChangeDefaultAvatarModal
        open={store.isSetDefaultModalOpen}
        onClose={store.onCloseSetDefaultModal}
        profileId={store.profileId}
        defaultAvatar={store.defaultAvatarObj!}
      />
    </Fragment>
  );
};

export default GlobalModals;
