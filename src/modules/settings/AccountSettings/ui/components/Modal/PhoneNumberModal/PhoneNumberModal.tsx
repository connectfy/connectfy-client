import "./phoneNumberModal.style.css";
import "../UsernameModal/usernameModal.style.css";
import { FC, useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { IUpdatePhoneNumber } from "../../../../types/types";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import { useToastError } from "@/hooks/useToastError";
import { PHONE_NUMBER_ACTION, RESOURCE } from "@/common/enums/enums";
import PhoneNumberForm from "@/components/Form/PhoneNumberForm";
import { checkEmptyString } from "@/common/utils/checkValues";
import { snack } from "@/common/utils/snackManager";
import { COUNTRIES } from "@/common/constants/constants";
import { ChevronRight, Pencil, Trash } from "lucide-react";
import { clearError, updatePhoneNumber } from "@/modules/settings/AccountSettings/api/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

enum ModalView {
  SELECTION = "selection",
  FORM = "form",
}

const PhoneNumberModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { LOADING_UPDATE_PHONE_NUMBER, ERROR_UPDATE_PHONE_NUMBER } =
    useAppSelector((state) => state[RESOURCE.ACCOUNT_SETTINGS]);
  const { authToken } = useAppSelector((state) => state[RESOURCE.AUTH]);
  const { me } = useAppSelector((state) => state[RESOURCE.PROFILE]);

  const hasPhoneNumber = !!me?.user.phoneNumber;
  const [view, setView] = useState<ModalView>(
    hasPhoneNumber ? ModalView.SELECTION : ModalView.FORM
  );
  const [_, setAction] = useState<PHONE_NUMBER_ACTION | null>(
    me?.user.phoneNumber ? null : PHONE_NUMBER_ACTION.UPDATE
  );

  const initialState: IUpdatePhoneNumber = {
    action: me?.user.phoneNumber ? null : PHONE_NUMBER_ACTION.UPDATE,
    phoneNumber: me?.user.phoneNumber || null,
    token: authToken,
  };

  const validate = ({
    action,
    phoneNumber,
  }: IUpdatePhoneNumber): Record<string, any> => {
    const errors: Record<string, any> = {};

    if (action === PHONE_NUMBER_ACTION.UPDATE) {
      if (
        !phoneNumber ||
        !phoneNumber.fullPhoneNumber ||
        !checkEmptyString(phoneNumber.fullPhoneNumber) ||
        !phoneNumber.countryCode ||
        !checkEmptyString(phoneNumber.countryCode) ||
        !phoneNumber.number ||
        !checkEmptyString(phoneNumber.number)
      ) {
        errors.phoneNumber = t("error_messages.this_field_required");
      }
    }

    const country = COUNTRIES.find((c) => c.code === phoneNumber?.countryCode);

    const numberMaxLength = country?.numberLength;

    if (phoneNumber?.number?.length !== numberMaxLength) {
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
      if (values.action === PHONE_NUMBER_ACTION.REMOVE)
        values.phoneNumber = null;

      const actionResult = await dispatch(updatePhoneNumber(values));
      const res = unwrapResult(actionResult);
      if (res) {
        resetForm();
        const message =
          values.action === PHONE_NUMBER_ACTION.REMOVE
            ? t("user_messages.phone_number_removed_successfully")
            : t("user_messages.phone_number_changed_successfully");
        snack.success(message);
        handleModalClose();
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    setView(hasPhoneNumber ? ModalView.SELECTION : ModalView.FORM);
    setAction(null);
    onClose();
  };

  const handleOverlayPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !LOADING_UPDATE_PHONE_NUMBER) {
      handleModalClose();
    }
  };

  const handleSelectAction = (selectedAction: PHONE_NUMBER_ACTION) => {
    setAction(selectedAction);
    formik.setFieldValue("action", selectedAction);

    if (selectedAction === PHONE_NUMBER_ACTION.UPDATE) {
      setView(ModalView.FORM);
    } else if (selectedAction === PHONE_NUMBER_ACTION.REMOVE) {
      formik.submitForm();
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    formik.handleSubmit();
  };

  const handleBackToSelection = () => {
    setView(ModalView.SELECTION);
    setAction(null);
    formik.setFieldValue("action", null);
    formik.setFieldValue("phoneNumber", me?.user.phoneNumber || null);
    formik.setTouched({});
  };

  const isFormValid = () => {
    const { phoneNumber } = formik.values;
    return (
      phoneNumber &&
      phoneNumber.fullPhoneNumber &&
      checkEmptyString(phoneNumber.fullPhoneNumber) &&
      phoneNumber.countryCode &&
      checkEmptyString(phoneNumber.countryCode) &&
      phoneNumber.number &&
      checkEmptyString(phoneNumber.number)
    );
  };

  const isPhoneNumberChanged = () => {
    const currentPhone = me?.user.phoneNumber;
    const newPhone = formik.values.phoneNumber;

    if (!currentPhone || !newPhone) return true;

    return (
      currentPhone.fullPhoneNumber !== newPhone.fullPhoneNumber ||
      currentPhone.countryCode !== newPhone.countryCode ||
      currentPhone.number !== newPhone.number
    );
  };

  const globalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (LOADING_UPDATE_PHONE_NUMBER) return;

        if (view === ModalView.FORM && hasPhoneNumber) {
          handleBackToSelection();
        } else {
          handleModalClose();
        }
      }

      if (e.key === "Enter" && view === ModalView.FORM) {
        e.preventDefault();
        if (LOADING_UPDATE_PHONE_NUMBER || !isFormValid()) return;
        formik.submitForm();
      }
    },
    [open, view, LOADING_UPDATE_PHONE_NUMBER, formik, hasPhoneNumber]
  );

  useToastError({
    error: ERROR_UPDATE_PHONE_NUMBER,
    clearErrorAction: () => clearError("updatePhoneNumber"),
  });

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", globalKeyDown);
    return () => {
      document.removeEventListener("keydown", globalKeyDown);
    };
  }, [open, globalKeyDown]);

  useEffect(() => {
    if (open) {
      setView(hasPhoneNumber ? ModalView.SELECTION : ModalView.FORM);
      setAction(null);
    }
  }, [open, hasPhoneNumber]);

  return (
    <Modal
      open={open}
      onClose={handleModalClose}
      onMouseDown={handleOverlayPointerDown}
    >
      <div className="account-settings-modal-container">
        <div className="account-settings-modal-header">
          <h2 className="account-settings-modal-title">
            {view === ModalView.SELECTION
              ? t("common.manage_phone_number")
              : t("common.update_phone_number")}
          </h2>
          <p className="account-settings-modal-subtitle">
            {view === ModalView.SELECTION
              ? t("common.manage_phone_number_description")
              : t("common.update_phone_number_description")}
          </p>
        </div>

        {view === ModalView.SELECTION ? (
          <div className="account-settings-modal-form">
            <div className="phone-modal-selection">
              <button
                type="button"
                onClick={() => handleSelectAction(PHONE_NUMBER_ACTION.UPDATE)}
                className="phone-modal-selection-btn"
                disabled={LOADING_UPDATE_PHONE_NUMBER}
              >
                <div className="phone-modal-selection-icon">
                  <Pencil />
                </div>
                <div className="phone-modal-selection-content">
                  <span className="phone-modal-selection-title">
                    {t("common.update_phone_number")}
                  </span>
                  <span className="phone-modal-selection-subtitle">
                    {t("common.change_your_phone_number")}
                  </span>
                </div>
                <div className="phone-modal-selection-arrow">
                  <ChevronRight size={20} />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectAction(PHONE_NUMBER_ACTION.REMOVE)}
                className="phone-modal-selection-btn phone-modal-selection-btn-danger"
                disabled={LOADING_UPDATE_PHONE_NUMBER}
              >
                <div className="phone-modal-selection-icon">
                  <Trash />
                </div>
                <div className="phone-modal-selection-content">
                  <span className="phone-modal-selection-title">
                    {t("common.remove_phone_number")}
                  </span>
                  <span className="phone-modal-selection-subtitle">
                    {t("common.delete_your_phone_number")}
                  </span>
                </div>
                <div className="phone-modal-selection-arrow">
                  <ChevronRight size={20} />
                </div>
              </button>
            </div>

            <div className="account-settings-modal-actions">
              <button
                type="button"
                onClick={handleModalClose}
                className="account-settings-modal-btn account-settings-modal-btn-cancel"
                disabled={LOADING_UPDATE_PHONE_NUMBER}
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="account-settings-modal-form">
            <div className="account-settings-modal-field">
              <PhoneNumberForm
                name="phoneNumber"
                // onBlur={() =>
                //   formik.setFieldTouched("phoneNumber", true, false)
                // }
                onChange={(value) => formik.setFieldValue("phoneNumber", value)}
                // blur={formik.touched.phoneNumber ?? false}
                value={formik.values.phoneNumber}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <span className="account-settings-modal-error form-error">
                  {formik.errors.phoneNumber}
                </span>
              )}
            </div>

            <div className="account-settings-modal-actions">
              {hasPhoneNumber && (
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="account-settings-modal-btn account-settings-modal-btn-cancel"
                  disabled={LOADING_UPDATE_PHONE_NUMBER}
                >
                  {t("common.back")}
                </button>
              )}
              <button
                type="button"
                onClick={handleModalClose}
                className="account-settings-modal-btn account-settings-modal-btn-cancel"
                disabled={LOADING_UPDATE_PHONE_NUMBER}
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="account-settings-modal-btn account-settings-modal-btn-save"
                disabled={
                  LOADING_UPDATE_PHONE_NUMBER ||
                  !isFormValid() ||
                  !isPhoneNumberChanged()
                }
              >
                {LOADING_UPDATE_PHONE_NUMBER ? (
                  <span className="account-settings-modal-loader" />
                ) : (
                  t("common.save")
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PhoneNumberModal;
