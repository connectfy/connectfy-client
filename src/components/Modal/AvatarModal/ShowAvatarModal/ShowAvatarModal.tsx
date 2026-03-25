import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  ZoomIn,
  ZoomOut,
  QrCode,
  ArrowLeft,
  UserCircle,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Modal from "../../index";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";
import { snack } from "@/common/utils/snackManager";
import SharePopover from "../SharePopover/SharePopover";
import { useAvatarModalStore } from "@/store/zustand/useAvatarModalStore";

interface IProps {
  open: boolean;
  onClose: () => void;
  avatarUrl: string;
  username?: string;
  userId?: string;
}

const ShowAvatarModal: FC<IProps> = ({
  open,
  onClose,
  avatarUrl,
  username,
  userId,
}) => {
  const { t } = useTranslation();

  const onOpenChangeModal = useAvatarModalStore(
    (state) => state.onOpenChangeModal,
  );
  const profileId = useAvatarModalStore((state) => state.profileId);
  const avatarObj = useAvatarModalStore((state) => state.avatarObj);

  const [scale, setScale] = useState(1);
  const [showQr, setShowQr] = useState(false);

  const profileUrl = `${window.location.origin}/user/${userId}`;

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 1));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    snack.success(t("common.link_copied"));
  };

  const handleToggleQr = () => {
    setShowQr((prev) => !prev);
    setScale(1);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative flex flex-col w-full max-w-lg overflow-hidden bg-(--auth-main-bg) rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-linear-to-b from-black/40 to-transparent">
          <div className="flex items-center gap-2">
            {showQr && (
              <Button
                onClick={handleToggleQr}
                className="p-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
              >
                <ArrowLeft size={18} />
              </Button>
            )}
            <span className="font-medium text-white drop-shadow-md">
              {showQr
                ? t("common.qr_code")
                : username || t("common.profile_photo")}
            </span>
          </div>
          <Button
            onClick={onClose}
            className="p-2 transition-transform bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white hover:scale-110"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Image / QR Toggle Area */}
        <div className="relative flex items-center justify-center w-full aspect-square overflow-hidden group">
          <AnimatePresence mode="wait">
            {showQr ? (
              // ── QR Görünüşü ──
              <motion.div
                key="qr"
                initial={{ opacity: 0, scale: 0.85, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateY: -90 }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                className="flex flex-col items-center justify-center gap-5 w-full h-full bg-(--auth-main-bg)"
              >
                {/* QR Wrapper - Instagram kimi ağ fon + avatar */}
                <div className="relative p-5 bg-white rounded-3xl shadow-xl">
                  <QRCodeCanvas
                    id="avatar-qr-code"
                    value={profileUrl}
                    size={200}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                    imageSettings={{
                      src: avatarUrl,
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </div>

                {/* @username */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-bold text-(--text-primary)">
                    @{username}
                  </span>
                  <span className="text-xs text-(--text-secondary) opacity-60">
                    {t("common.scan_to_view_profile")}
                  </span>
                </div>
              </motion.div>
            ) : (
              // ── Şəkil Görünüşü ──
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-full h-full"
              >
                <motion.img
                  animate={{ scale }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  src={avatarUrl}
                  alt="Avatar"
                  className="object-contain w-full h-full"
                  onDoubleClick={scale > 1 ? () => setScale(1) : handleZoomIn}
                />
                {/* Zoom Controls */}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-around p-5 bg-(--auth-main-bg) border-t border-(--auth-glass-border)">
          <SharePopover profileUrl={profileUrl} username={username} />

          <Button
            onClick={handleCopyLink}
            className="w-[90px] flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
          >
            <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
              <Copy size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.copy_link")}
            </span>
          </Button>

          {/* QR Düyməsi - aktiv olduqda highlight */}
          <Button
            onClick={handleToggleQr}
            className={`w-[90px] flex flex-col items-center gap-1.5 transition-colors group ${
              showQr
                ? "text-(--third-color)"
                : "text-(--text-secondary) hover:text-(--third-color)"
            }`}
          >
            <div
              className={`p-3 rounded-2xl transition-colors ${
                showQr
                  ? "bg-(--active-bg)"
                  : "bg-(--active-bg-2) group-hover:bg-(--active-bg)"
              }`}
            >
              <QrCode size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.qr_code")}
            </span>
          </Button>

          <Button
            onClick={() => onOpenChangeModal(avatarObj, profileId)}
            className="w-[90px] flex flex-col items-center gap-1.5 transition-colors text-(--text-secondary) hover:text-(--third-color) group"
          >
            <div className="p-3 rounded-2xl bg-(--active-bg-2) group-hover:bg-(--active-bg) transition-colors">
              <UserCircle size={22} />
            </div>
            <span className="text-[11px] font-semibold tracking-wider">
              {t("common.change_avatar")}
            </span>
          </Button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ShowAvatarModal;
