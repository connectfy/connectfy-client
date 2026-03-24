import { FC, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { IUpdatePhoneNumber } from "../../../../types/types";
import { useFormik } from "formik";
import { ModalView, PHONE_NUMBER_ACTION } from "@/common/enums/enums";
import PhoneNumberForm from "@/components/Form/PhoneNumberForm/PhoneNumberForm";
import { checkEmptyString } from "@/common/utils/checkValues";
import { snack } from "@/common/utils/snackManager";
import { COUNTRIES } from "@/common/constants/constants";
import { ChevronRight, Pencil, Trash } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useUpdatePhoneNumberMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PhoneNumberModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { authenticateToken } = useAuthStore();
  const { showResponseErrors } = useErrors();

  const { user } = useUser();
  const [updatePhoneNumber, { isLoading }] = useUpdatePhoneNumberMutation();

  const hasPhoneNumber = !!user?.phoneNumber;
  const [view, setView] = useState<ModalView>(
    hasPhoneNumber ? ModalView.SELECTION : ModalView.FORM,
  );

  const initialState: IUpdatePhoneNumber = {
    action: user?.phoneNumber ? null : PHONE_NUMBER_ACTION.UPDATE,
    phoneNumber: user?.phoneNumber || null,
    token: authenticateToken as string,
  };

  const validate = ({
    action,
    phoneNumber,
  }: IUpdatePhoneNumber): Record<string, any> => {
    const errors: Record<string, any> = {};
    if (action === PHONE_NUMBER_ACTION.UPDATE) {
      if (
        !phoneNumber?.fullPhoneNumber ||
        !checkEmptyString(phoneNumber.fullPhoneNumber)
      ) {
        errors.phoneNumber = t("error_messages.this_field_required");
      }
    }
    const country = COUNTRIES.find((c) => c.code === phoneNumber?.countryCode);
    if (phoneNumber?.number?.length !== country?.numberLength) {
      errors.phoneNumber = t("error_messages.invalid_phone_number_length");
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validate(values),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values.action === PHONE_NUMBER_ACTION.REMOVE)
          values.phoneNumber = null;
        values.token = authenticateToken as string;
        await updatePhoneNumber(values).unwrap();
        resetForm();
        snack.success(
          values.action === PHONE_NUMBER_ACTION.REMOVE
            ? t("user_messages.phone_number_removed_successfully")
            : t("user_messages.phone_number_changed_successfully"),
        );
        handleModalClose();
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    setView(hasPhoneNumber ? ModalView.SELECTION : ModalView.FORM);
    onClose();
  };

  const handleEscape = () => {
    if (isLoading) return;
    if (view === ModalView.FORM && hasPhoneNumber) {
      handleBackToSelection();
    } else {
      handleModalClose();
    }
  };

  const handleSelectAction = (selectedAction: PHONE_NUMBER_ACTION) => {
    formik.setFieldValue("action", selectedAction);
    if (selectedAction === PHONE_NUMBER_ACTION.UPDATE) setView(ModalView.FORM);
    else if (selectedAction === PHONE_NUMBER_ACTION.REMOVE) formik.submitForm();
  };

  const handleBackToSelection = () => {
    setView(ModalView.SELECTION);
    formik.setFieldValue("action", null);
    formik.setFieldValue("phoneNumber", user?.phoneNumber || null);
    formik.setTouched({});
  };

  const isFormValid = () => {
    const { phoneNumber } = formik.values;
    return (
      phoneNumber?.fullPhoneNumber &&
      phoneNumber?.countryCode &&
      phoneNumber?.number
    );
  };

  const isPhoneNumberChanged = () => {
    const current = user?.phoneNumber;
    const next = formik.values.phoneNumber;
    if (!current || !next) return true;
    return (
      current.fullPhoneNumber !== next.fullPhoneNumber ||
      current.countryCode !== next.countryCode
    );
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && view === ModalView.FORM) {
        if (!isLoading && isFormValid() && isPhoneNumberChanged())
          formik.submitForm();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, formik, view]);

  return (
    <Modal
      open={open}
      onClose={handleEscape}
      onMouseDown={(e) =>
        e.target === e.currentTarget && !isLoading && handleModalClose()
      }
    >
      <div className="bg-(--auth-main-bg) rounded-2xl p-6 sm:p-8 max-w-[480px] w-full shadow-(--card-shadow) animate-fade-in mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h2 className="text-2xl font-bold text-(--text-primary) mb-2">
            {view === ModalView.SELECTION
              ? t("common.manage_phone_number")
              : t("common.update_phone_number")}
          </h2>
          <p className="text-sm text-(--muted-color) leading-relaxed">
            {view === ModalView.SELECTION
              ? t("common.manage_phone_number_description")
              : t("common.update_phone_number_description")}
          </p>
        </div>

        {view === ModalView.SELECTION ? (
          /* Selection View */
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => handleSelectAction(PHONE_NUMBER_ACTION.UPDATE)}
              disabled={isLoading}
              className="group flex items-center gap-4 p-4 rounded-xl border border-(--input-border) bg-(--input-bg) hover:bg-(--active-bg-2) hover:border-(--primary-color) transition-all duration-200 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-(--active-bg-2) flex items-center justify-center text-(--primary-color)">
                <Pencil size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-(--text-primary) leading-none mb-1">
                  {t("common.update_phone_number")}
                </p>
                <p className="text-xs text-(--muted-color)">
                  {t("common.change_your_phone_number")}
                </p>
              </div>
              <ChevronRight size={18} className="text-(--muted-color)" />
            </Button>

            <Button
              onClick={() => handleSelectAction(PHONE_NUMBER_ACTION.REMOVE)}
              disabled={isLoading}
              className="group flex items-center gap-4 p-4 rounded-xl border border-(--input-border) bg-(--input-bg) hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-(--error-color) transition-all duration-200 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-(--error-color)">
                <Trash size={20} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-(--text-primary) leading-none mb-1">
                  {t("common.remove_phone_number")}
                </p>
                <p className="text-xs text-(--muted-color)">
                  {t("common.delete_your_phone_number")}
                </p>
              </div>
              <ChevronRight size={18} className="text-(--muted-color) " />
            </Button>

            <Button
              onClick={handleModalClose}
              className="flex-1 px-6 py-3 rounded-xl text-[15px] font-medium bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border) transition-all"
              title={t("common.cancel")}
            />
          </div>
        ) : (
          /* Form View */
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <PhoneNumberForm
                name="phoneNumber"
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                value={formik.values.phoneNumber}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <span className="text-(--error-color) text-[13px] mt-1 animate-fade-in pl-1">
                  {formik.errors.phoneNumber as string}
                </span>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                onClick={
                  hasPhoneNumber ? handleBackToSelection : handleModalClose
                }
                className="flex-1 px-6 py-3 rounded-xl text-[15px] font-medium bg-(--input-bg) text-(--text-primary) border border-(--input-border) hover:bg-(--input-border) transition-all"
                disabled={isLoading}
                title={hasPhoneNumber ? t("common.back") : t("common.cancel")}
              />
              <Button
                type="button"
                onClick={() => formik.handleSubmit()}
                className="flex-1 px-6 py-3 rounded-xl text-[15px] font-semibold bg-(--primary-color) text-white shadow-(--shadow-color) hover:shadow-(--active-shadow) flex items-center justify-center"
                disabled={
                  isLoading || !isFormValid() || !isPhoneNumberChanged()
                }
                isLoading={isLoading}
                title={t("common.save")}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PhoneNumberModal;
