import { FC, useState } from "react";
import { motion } from "framer-motion";
import { X, Copy, Share2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import Modal from "..";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { snack } from "@/common/utils/snackManager";

interface IProps {
  open: boolean;
  onClose: () => void;
  avatarUrl: string;
  username?: string;
}

const ShowAvatarModal: FC<IProps> = ({
  open,
  onClose,
  avatarUrl,
  username,
}) => {
  const { t } = useTranslation();
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/@${username}`,
    );
    snack.success(t("common.link_copied"));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: username,
          text: `Check out ${username}'s profile photo`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex flex-col w-full max-w-lg overflow-hidden bg-(--auth-main-bg) rounded-3xl shadow-2xl"
      >
        {/* Header - Minimalist */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-linear-to-b from-black/40 to-transparent">
          <span className="font-medium text-white drop-shadow-md">
            {username || t("common.profile_photo")}
          </span>
          <Button
            onClick={onClose}
            className="p-2 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white hover:scale-110"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Image Container with Zoom Logic */}
        <div className="relative flex items-center justify-center w-full aspect-square bg-black overflow-hidden group">
          <motion.img
            animate={{ scale }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            src={avatarUrl}
            alt="Avatar"
            className="object-contain w-full h-full"
            onDoubleClick={scale > 1 ? () => setScale(1) : handleZoomIn}
          />

          {/* Floating Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              onClick={handleZoomIn}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20"
            >
              <ZoomIn size={18} />
            </Button>
            <Button
              onClick={handleZoomOut}
              className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20"
            >
              <ZoomOut size={18} />
            </Button>
          </div>
        </div>

        {/* Instagram Style Action Bar */}
        <div className="flex items-center justify-around p-5 bg-(--auth-main-bg) border-t border-(--auth-glass-border)">
          {/* Share Action */}
          <Button
            onClick={handleShare}
            className="flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
          >
            <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
              <Share2 size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.share")}
            </span>
          </Button>

          {/* Copy Link Action */}
          <Button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
          >
            <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
              <Copy size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.copy_link")}
            </span>
          </Button>

          {/* View Full Action (Optional) */}
          <Button
            onClick={() => window.open(avatarUrl, "_blank")}
            className="flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
          >
            <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
              <Maximize2 size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.full_size")}
            </span>
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ShowAvatarModal;
