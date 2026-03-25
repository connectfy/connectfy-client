import {
  IDefaultAvatar,
  IEditDefaultAvatar,
} from "@/modules/profile/types/types";
import Modal from "../.."; // Yolunu layihənə uyğun yoxla
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import NativeSelect from "@/components/ui/Select/NativeSelect/NativeSelect";
import { AvatarFormats } from "@/common/enums/enums";
import { useFormik } from "formik";
import { useUpdateDefaultAvatarMutation } from "@/modules/profile/api/api";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import ToggleSlider from "@/components/ui/CustomCheckbox/ToggleSlider/ToggleSlider";
import { X } from "lucide-react";
import useFormDisabled from "@/hooks/useFormDisabled";
import { snack } from "@/common/utils/snackManager";

interface IProps {
  open: boolean;
  onClose: () => void;
  defaultAvatar?: IDefaultAvatar;
  profileId: string;
}

const ChangeDefaultAvatarModal = ({
  open,
  onClose,
  defaultAvatar,
  profileId,
}: IProps) => {
  const { t } = useTranslation();
  const { showResponseErrors } = useErrors();

  const [updateDefaultAvatar, { isLoading }] = useUpdateDefaultAvatarMutation();

  const formatOptions = Object.values(AvatarFormats).map((format) => ({
    label: format.charAt(0).toUpperCase() + format.slice(1),
    value: format,
  }));

  const initialState: IEditDefaultAvatar = {
    _id: profileId,
    useDefaultAvatar: false,
    format: defaultAvatar?.format || AvatarFormats.Adventurer,
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateDefaultAvatar(values).unwrap();
        snack.success(t("user_messages.information_updated"));
        onClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isFormDisabled = useFormDisabled({
    formik,
    loading: isLoading,
    validationRules: [(values) => values.format !== defaultAvatar?.format],
  });

  if (!open || !defaultAvatar) return null;

  const { values, setFieldValue, handleSubmit } = formik;

  return (
    <Modal open={open} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col w-full max-w-md p-6 bg-(--auth-main-bg) rounded-2xl border border-(--auth-glass-border) shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--text-color)">
            {t("common.change_default_avatar")}
          </h2>
          <Button
            type="button"
            onClick={onClose}
            className="p-2 transition-colors rounded-full text-(--muted-color) hover:bg-(--active-bg-2) hover:text-(--text-color)"
          >
            <X size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
          {/* Live Preview Container */}
          <div className="flex justify-center w-full">
            <div className="relative flex items-center justify-center overflow-hidden border-4 rounded-full size-32 bg-(--active-bg-2) border-(--primary-color) shadow-[0_8px_24px_var(--shadow-color)]">
              <img
                src={`https://api.dicebear.com/9.x/${values.format}/svg?seed=${encodeURIComponent(defaultAvatar.seed)}`}
                alt="Avatar Preview"
                className="block object-cover w-full h-full"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          {/* Controls Container */}
          <div className="flex flex-col gap-4">
            {/* Format Selector */}
            <NativeSelect
              title={t("common.format")}
              inputSize="large"
              options={formatOptions}
              value={values.format} // FIX: Canlı baxış üçün formik state-ə bağlandı
              disabled={isLoading}
              onChange={(value) => setFieldValue("format", value)}
            />

            {/* Toggle Action */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-(--active-bg-2) border border-(--auth-glass-border)">
              <span className="text-sm font-medium select-none text-(--text-color)">
                {t("common.use_as_default_avatar")}
              </span>
              <ToggleSlider
                checked={values.useDefaultAvatar}
                onClick={() =>
                  setFieldValue("useDefaultAvatar", !values.useDefaultAvatar)
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 font-medium transition-colors bg-transparent border rounded-lg text-(--text-color) border-(--input-border) w-full"
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              disabled={isFormDisabled}
              isLoading={isLoading}
              className="px-6 py-2.5 font-medium text-white transition-colors rounded-lg bg-(--primary-color) shadow-md w-full"
              title={t("common.save")}
            />
          </div>
        </form>
      </motion.div>
    </Modal>
  );
};

export default ChangeDefaultAvatarModal;
