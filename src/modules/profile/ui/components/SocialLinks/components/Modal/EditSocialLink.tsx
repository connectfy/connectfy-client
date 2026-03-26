import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { Link2, X, Link, Type } from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/ui/CustomButton/Button/Button";
import Input from "@/components/ui/CustomInput/Input/Input";
import NativeSelect, {
  ISelectOption,
} from "@/components/ui/Select/NativeSelect/NativeSelect";
import { SOCIAL_LINK_PLATFORM } from "@/common/enums/enums";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useErrors } from "@/hooks/useErrors";
import useFormDisabled from "@/hooks/useFormDisabled";
import { useUpdateSocialLinkMutation } from "@/modules/profile/api/api";
import { IEditSocialLink, ISocialLink } from "@/modules/profile/types/types";
import { snack } from "@/common/utils/snackManager";
import { getChangedData } from "@/common/utils/getDirtyValues";
import { validateSocialLink } from "@/modules/profile/constants/validation";
import { PLATFORM_ICONS } from "../SocialPlatformIcons";

interface IProps {
  open: boolean;
  onClose: () => void;
  socialLink: ISocialLink;
}

const EditSocialLinkModal: FC<IProps> = ({ open, onClose, socialLink }) => {
  const { t } = useTranslation();
  const { showResponseErrors, showFormikErrors } = useErrors();
  const [update, { isLoading }] = useUpdateSocialLinkMutation();

  const platformOptions: ISelectOption[] = Object.values(
    SOCIAL_LINK_PLATFORM,
  ).map((platform) => ({
    label: (
      <div className="flex items-center gap-3">
        <span>{PLATFORM_ICONS[platform]}</span>
        <span>{platform}</span>
      </div>
    ),
    value: platform,
  }));

  const initialState: IEditSocialLink = {
    _id: socialLink._id,
    name: socialLink.name,
    url: socialLink.url,
    platform: socialLink.platform,
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateSocialLink(values, t),
    onSubmit: async (values) => {
      try {
        const changedData = getChangedData<IEditSocialLink>(socialLink, values);
        await update({ ...changedData, _id: socialLink._id }).unwrap();
        snack.success(t("user_messages.information_updated"));
        handleClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const isDisabled = useFormDisabled<IEditSocialLink>({
    formik,
    loading: isLoading,
    validationRules: [
      (values) => {
        const requiredStringFields = [values.name, values.url, values.platform];
        return requiredStringFields.every((f) => f && checkEmptyString(f));
      },
      formik.dirty,
    ],
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
      <div className="w-full max-w-[550px] bg-(--auth-main-bg)! rounded-2xl shadow-(--card-shadow) overflow-hidden animate-slide-up duration-600">
        {/* Modal Header - PersonalInfoModal ilə eyni */}
        <div className="p-6 border-b border-(--auth-glass-border) relative">
          <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2">
            <Link2 size={22} className="text-(--primary-color)" />
            {t("common.edit_social_link")}
          </h2>
          <p className="text-sm text-(--muted-color) mt-1">
            {t("common.edit_social_link_subtitle")}
          </p>

          {/* Bağla düyməsi */}
          <Button
            onClick={handleClose}
            className="absolute top-6 right-6 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-(--muted-color) transition-colors"
            icon={<X size={20} />}
          />
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-6">
            {/* Platform Seçimi */}
            <NativeSelect
              title={t("common.platform")}
              inputSize="large"
              // icon={
              //   PLATFORM_ICONS[formik.values.platform as SOCIAL_LINK_PLATFORM]
              // }
              options={platformOptions}
              value={formik.values.platform ?? SOCIAL_LINK_PLATFORM.INSTAGRAM}
              onChange={(val) => formik.setFieldValue("platform", val)}
              disabled={isLoading}
            />

            {/* Link Adı */}
            <Input
              name="name"
              title={t("common.name")}
              isFloating
              icon={<Type size={18} />}
              value={formik.values.name || ""}
              onChange={formik.handleChange}
              maxLength={50}
              isError={!!formik.errors.name}
            />

            {/* URL/Link */}
            <Input
              name="url"
              title={t("common.link")}
              isFloating
              icon={<Link size={18} />}
              value={formik.values.url || ""}
              onChange={formik.handleChange}
              maxLength={200}
              isError={!!formik.errors.url}
            />
          </div>

          {/* Action Buttons - PersonalInfoModal ilə eyni */}
          <div className="flex items-center gap-3 mt-8">
            <Button
              type="button"
              className="flex-1 h-12 rounded-xl text-sm font-bold bg-black/5 dark:bg-white/5 text-(--text-primary) hover:bg-black/10 dark:hover:bg-white/10 transition-all border-none"
              onClick={handleClose}
              disabled={isLoading}
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl text-sm font-bold bg-linear-to-r from-(--primary-color) to-(--third-color) text-white shadow-lg shadow-(--primary-color)/20 transition-all duration-600 border-none"
              disabled={isDisabled}
              isLoading={isLoading}
              title={t("common.save")}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditSocialLinkModal;
