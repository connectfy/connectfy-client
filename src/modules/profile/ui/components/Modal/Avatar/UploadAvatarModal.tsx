import Modal from "@/components/Modal";
import { FC, useCallback, useState } from "react";
import { UploadCloud, X, ZoomIn, ZoomOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import { useUpdateAvatar } from "@/modules/profile/hooks/useUpdateAvatar";
import { ProfilePhotoUpdateAction } from "@/common/enums/enums";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/common/utils/cropImage";
import { snack } from "@/common/utils/snackManager";

interface IProps {
  open: boolean;
  onClose: () => void;
  profileId: string;
}

const UploadAvatarModal: FC<IProps> = ({ open, onClose, profileId }) => {
  const { t } = useTranslation();
  const { handleAvatarUpload, validateFile } = useUpdateAvatar();

  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      const error = validateFile(file);

      if (error) {
        snack.warning(error);
        return;
      }

      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const onSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        setIsProcessing(true);
        // Kəsilmiş şəkli File formatında alırıq
        const croppedFile = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          selectedFileName || "avatar.jpeg",
        );

        if (croppedFile) {
          handleAvatarUpload({
            _id: profileId,
            file: croppedFile,
            action: ProfilePhotoUpdateAction.Update,
          });

          handleClose();
        }
      } catch (e) {
        snack.error(t("error_messages.process_failed"));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      snack.warning(error);
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setImageSrc(reader.result as string);
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClose = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setSelectedFileName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-lg p-6 bg-(--auth-main-bg) border border-(--auth-glass-border) rounded-2xl shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--text-color)">
            {imageSrc
              ? t("common.crop_photo") || "Şəkli Kəs"
              : t("common.upload_new_photo")}
          </h2>
          <Button
            onClick={handleClose}
            className="p-2 transition-colors rounded-full text-(--muted-color) hover:bg-(--active-bg-2) hover:text-(--text-color)"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content Area */}
        <div className="w-full mb-6">
          <AnimatePresence mode="wait">
            {!imageSrc ? (
              <motion.label
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 transition-all duration-200 border-2 border-dashed rounded-xl cursor-pointer bg-(--input-bg) border-(--input-border) hover:bg-(--active-bg-2) hover:border-(--primary-color) group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <UploadCloud
                    className="w-10 h-10 mb-4 transition-colors text-(--muted-color) group-hover:text-(--primary-color)"
                    strokeWidth={1.5}
                  />
                  <p className="mb-2 text-sm text-(--text-color)">
                    <span className="font-semibold text-(--primary-color)">
                      {t("common.click_to_upload")}
                    </span>{" "}
                    {t("common.or_drag")}
                  </p>
                  <p className="text-xs text-(--muted-color)">
                    {t("common.file_format")}
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={onFileChange}
                />
              </motion.label>
            ) : (
              <motion.div
                key="cropper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center w-full gap-4"
              >
                {/* Cropper Container */}
                <div className="relative w-full h-64 overflow-hidden rounded-xl bg-(--active-bg-2)">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center w-full gap-3 px-2 mt-2">
                  <ZoomOut size={18} className="text-(--muted-color)" />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-label="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="
    w-full h-1.5 cursor-pointer rounded-lg
    appearance-none bg-(--input-border) 
    outline-none focus:outline-none focus:ring-0

    [&::-webkit-slider-thumb]:appearance-none 
    [&::-webkit-slider-thumb]:size-4 
    [&::-webkit-slider-thumb]:rounded-full 
    [&::-webkit-slider-thumb]:bg-(--primary-color)
    [&::-webkit-slider-thumb]:border-none
    [&::-webkit-slider-thumb]:transition-none
    
    hover:bg-(--input-border)
    active:bg-(--input-border)
    [&::-webkit-slider-thumb]:hover:bg-(--primary-color)
    [&::-webkit-slider-thumb]:active:bg-(--primary-color)
  "
                  />
                  <ZoomIn size={18} className="text-(--muted-color)" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {imageSrc && (
            <Button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setSelectedFileName("");
              }}
              className="px-6 py-2.5 font-medium transition-colors bg-transparent border rounded-lg text-(--text-color) border-(--input-border) hover:bg-(--input-bg) w-full"
              title={t("common.back")}
            />
          )}

          {!imageSrc ? (
            <Button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="px-6 py-2.5 font-medium transition-colors bg-transparent border rounded-lg text-(--text-color) border-(--input-border) hover:bg-(--input-bg) w-full"
              title={t("common.cancel")}
            />
          ) : (
            <Button
              disabled={isProcessing}
              type="button"
              onClick={onSave}
              className="px-6 py-2.5 font-medium text-white transition-colors rounded-lg bg-(--primary-color) shadow-md w-full disabled:opacity-50"
              title={t("common.save")}
              isLoading={isProcessing}
            />
          )}
        </div>
      </motion.div>
    </Modal>
  );
};

export default UploadAvatarModal;
