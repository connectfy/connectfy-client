import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { UserPen } from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useErrors } from "@/hooks/useErrors";
import useFormDisabled from "@/hooks/useFormDisabled";
import { useUpdateProfileMutation } from "@/modules/profile/api/api";
import { useProfile } from "@/modules/profile/hooks/useProfile";
import { IEditProfile } from "@/modules/profile/types/types";
import { getChangedData } from "@/common/utils/getDirtyValues";
import { snack } from "@/common/utils/snackManager";
import Textarea from "@/components/ui/CustomTextArea/TextArea/Textarea";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const BioModal: FC<IProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { showResponseErrors, showFormikErrors } = useErrors();
  const [update, { isLoading }] = useUpdateProfileMutation();

  const initialState: IEditProfile = {
    _id: profile?._id ?? "",
    bio: profile?.bio,
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        values.bio = values.bio?.trim() || null;
        const changedData = getChangedData<IEditProfile>(profile!, values);

        const finalData = {
          _id: profile?._id as string,
          ...changedData,
        };

        await update(finalData).unwrap();
        snack.success(t("user_messages.information_updated"));
        handleClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IEditProfile>({
    formik,
    loading: isLoading,
    validationRules: [formik.dirty],
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      showFormikErrors(errors);
      return;
    }
    formik.handleSubmit(e as any);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="w-full max-w-[550px] bg-(--auth-main-bg) rounded-2xl shadow-(--card-shadow) overflow-hidden animate-slide-up duration-600">
        {/* Modal Header */}
        <div className="p-6 border-b border-(--auth-glass-border)">
          <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2">
            <UserPen size={22} className="text-(--primary-color)" />
            {t("common.bio")}
          </h2>
          <p className="text-sm text-(--muted-color) mt-1">
            {t("common.edit_bio_description")}
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-6">
            <Textarea
              title={t("common.bio")}
              maxLength={500}
              showCharCount
              value={formik.values.bio ?? ""}
              onChange={(e) => formik.setFieldValue("bio", e.target.value)}
              style={{ resize: "none" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-8">
            <Button
              type="button"
              className="flex-1 h-12 rounded-xl text-sm font-bold bg-black/5 dark:bg-white/5 text-(--text-primary) hover:bg-black/10 dark:hover:bg-white/10 transition-all"
              onClick={handleClose}
              disabled={isLoading}
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl text-sm font-bold bg-linear-to-r from-(--primary-color) to-(--third-color) text-white shadow-lg shadow-(--primary-color)/20 transition-all duration-600"
              disabled={isDisabled}
              isLoading={isLoading}
              title={t("common.save_changes")}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BioModal;
