import Modal from "@/components/Modal";
import { FC } from "react";
import { ImagePlus, UserCircle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { IAvatar } from "@/modules/profile/types/types";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import { ProfilePhotoUpdateAction } from "@/common/enums/enums";
import { useUpdateAvatar } from "@/modules/profile/hooks/useUpdateAvatar";
import { useAvatarModalStore } from "@/store/zustand/useAvatarModalStore";

interface IProps {
  open: boolean;
  onClose: () => void;
  avatar?: IAvatar | null;
  profileId: string;
}

const ChangeAvatarModal: FC<IProps> = ({
  open,
  onClose,
  avatar,
  profileId,
}) => {
  const { t } = useTranslation();
  const onOpenUploadModal = useAvatarModalStore(
    (state) => state.onOpenUploadModal,
  );
  const isSetDefaultEnabled = avatar?.isCustom === true || !avatar;
  const isRemoveEnabled = !!avatar;

  const { handleAvatarUpload, isLoading } = useUpdateAvatar();

  const handleSetDefault = () => {
    handleAvatarUpload({
      _id: profileId,
      action: ProfilePhotoUpdateAction.SetDefault,
    });
    onClose();
  };

  const handleRemove = () => {
    handleAvatarUpload({
      _id: profileId,
      action: ProfilePhotoUpdateAction.Remove,
    });
    onClose();
  };

  const handleUpdateClick = () => {
    onClose();
    setTimeout(() => {
      onOpenUploadModal();
    }, 150);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col w-full max-w-sm gap-2 p-6 bg-(--auth-main-bg) rounded-2xl border border-(--auth-glass-border) shadow-xl"
      >
        <h2 className="mb-2 text-xl font-bold text-(--text-color)">
          {t("common.profile_photo")}
        </h2>

        <div className="flex flex-col w-full gap-1">
          {/* 1. Update Profile Photo */}
          <Button
            onClick={handleUpdateClick}
            disabled={isLoading}
            className="flex items-center w-full gap-3 p-3 font-medium transition-colors rounded-xl text-(--text-color) hover:bg-(--active-bg-2)"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--icon-green-bg) text-(--icon-green-text)">
              <ImagePlus size={20} />
            </div>
            {t("common.update_profile_photo")}
          </Button>

          {/* 2. Set Default Avatar */}
          <Button
            onClick={handleSetDefault}
            disabled={!isSetDefaultEnabled || isLoading}
            className="flex items-center w-full gap-3 p-3 font-medium transition-colors rounded-xl text-(--text-color) hover:bg-(--active-bg-2)"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-(--icon-blue-bg) text-(--icon-blue-text)">
              <UserCircle size={20} />
            </div>
            {t("common.set_default_avatar")}
          </Button>

          {/* 3. Remove Profile Photo */}
          <Button
            onClick={handleRemove}
            disabled={!isRemoveEnabled || isLoading}
            className="flex items-center w-full gap-3 p-3 font-medium transition-colors rounded-xl text-(--error-color) hover:bg-red-500/10 dark:hover:bg-red-500/20"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 text-(--error-color)">
              <Trash2 size={20} />
            </div>
            {t("common.remove_profile_photo")}
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ChangeAvatarModal;
