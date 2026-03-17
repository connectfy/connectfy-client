import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { User, MapPin } from "lucide-react";
import Modal from "@/components/Modal";
import Button from "@/components/ui/CustomButton/Button/Button";
import Input from "@/components/ui/CustomInput/Input/Input";
import DatePicker from "@/components/ui/DatePicker/DatePicker";
import NativeSelect, {
  ISelectOption,
} from "@/components/ui/Select/NativeSelect/NativeSelect";
import { GENDER } from "@/common/enums/enums";
import { checkEmptyString } from "@/common/utils/checkValues";
import { useErrors } from "@/hooks/useErrors";
import useFormDisabled from "@/hooks/useFormDisabled";
import { useUpdateProfileMutation } from "@/modules/profile/api/api";
import { validateEditProfile } from "@/modules/profile/constants/validation";
import { IAccount, IEditProfile } from "@/modules/profile/types/types";
import { getChangedData } from "@/common/utils/getDirtyValues";
import { snack } from "@/common/utils/snackManager";

interface IProps {
  open: boolean;
  onClose: () => void;
  profile: IAccount | undefined;
}

const PersonalInfoModal: FC<IProps> = ({ open, onClose, profile }) => {
  const { t } = useTranslation();
  const { showResponseErrors, showFormikErrors } = useErrors();
  const [update, { isLoading }] = useUpdateProfileMutation();

  const genderOptions: ISelectOption[] = [
    { label: t("enum.male"), value: GENDER.MALE },
    { label: t("enum.female"), value: GENDER.FEMALE },
    { label: t("enum.other"), value: GENDER.OTHER },
  ];

  const initialState: IEditProfile = {
    _id: profile?._id ?? "",
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    gender: profile?.gender,
    location: profile?.location,
    birthdayDate: profile?.birthdayDate,
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validateEditProfile(values, t),
    onSubmit: async (values) => {
      try {
        values.location = values.location?.trim() || null;
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
    validationRules: [
      (values) => {
        const requiredStringFields = [
          values.firstName,
          values.lastName,
          values.gender,
        ];

        const areStringsValid = requiredStringFields.every(
          (f) => f && checkEmptyString(f),
        );

        const location = values.location?.trim() || null;
        const isLocationValid = values.location === location;

        const isDateValid = !!values.birthdayDate;

        return areStringsValid && isLocationValid && isDateValid;
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
      <div className="w-full max-w-[550px] bg-(--auth-main-bg) rounded-2xl shadow-(--card-shadow) overflow-hidden animate-slide-up duration-600">
        {/* Modal Header */}
        <div className="p-6 border-b border-(--auth-glass-border)">
          <h2 className="text-xl font-bold text-(--text-primary) flex items-center gap-2">
            <User size={22} className="text-(--primary-color)" />
            {t("common.personal_information")}
          </h2>
          <p className="text-sm text-(--muted-color) mt-1">
            {t("common.edit_info_description")}
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col gap-6">
            {/* Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                name="firstName"
                title={t("common.first_name")}
                isFloating
                icon={<User size={18} />}
                value={formik.values.firstName || ""}
                onChange={formik.handleChange}
                isError={!!formik.errors.firstName}
              />
              <Input
                name="lastName"
                title={t("common.last_name")}
                isFloating
                icon={<User size={18} />}
                value={formik.values.lastName || ""}
                onChange={formik.handleChange}
                isError={!!formik.errors.lastName}
              />
            </div>

            {/* Birthday & Gender Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <DatePicker
                  value={formik.values.birthdayDate?.toString() || ""}
                  onChange={(date) =>
                    formik.setFieldValue("birthdayDate", date)
                  }
                  inputSize="large"
                  placeholder={t("common.birthday")}
                  hasError={
                    !!(
                      formik.errors.birthdayDate && formik.touched.birthdayDate
                    )
                  }
                />
              </div>
              <NativeSelect
                title={t("common.gender")}
                inputSize="large"
                icon={<User size={18} />}
                options={genderOptions}
                value={formik.values.gender || GENDER.MALE}
                onChange={(val) => formik.setFieldValue("gender", val)}
                disabled={isLoading}
              />
            </div>

            {/* Location Input */}
            <Input
              name="location"
              title={t("common.location")}
              isFloating
              icon={<MapPin size={18} />}
              value={formik.values.location || ""}
              onChange={(e) => {
                const value = e.target.value || null;
                formik.setFieldValue("location", value);
              }}
              isError={!!formik.errors.location}
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

export default PersonalInfoModal;
