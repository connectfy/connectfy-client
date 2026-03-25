import { Fragment } from "react";
import { useAvatarModalStore } from "@/store/zustand/useAvatarModalStore";
import ShowAvatarModal from "../AvatarModal/ShowAvatarModal/ShowAvatarModal";
import ChangeAvatarModal from "@/modules/profile/ui/components/Modal/Avatar/ChangeAvatartModal";
import UploadAvatarModal from "@/modules/profile/ui/components/Modal/Avatar/UploadAvatarModal"; // Yolunu düzəlt

const GlobalModals = () => {
  const store = useAvatarModalStore();

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
      />

      {/* 3. Upload Avatar Modal */}
      <UploadAvatarModal
        open={store.isUploadModalOpen}
        onClose={store.onCloseUploadModal}
        profileId={store.profileId}
      />
    </Fragment>
  );
};

export default GlobalModals;
