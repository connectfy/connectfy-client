import { FC } from "react";
import "./deleteAccountModal.style.css";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { DELETE_REASON, RESOURCE } from "@/common/enums/enums";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { useFormik } from "formik";
import { checkEmptyString } from "@/common/utils/checkValues";
import { TriangleAlert } from "lucide-react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { useToastError } from "@/hooks/useToastError";
import { snack } from "@/common/utils/snackManager";
import { IDeleteAccount } from "../../../../types/types";
import { clearError, deleteAccount } from "@/modules/settings/AccountSettings/api/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeleteAccountModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { LOADING_DELETE_ACCOUNT, ERROR_DELETE_ACCOUNT } = useAppSelector(
    (state) => state[RESOURCE.ACCOUNT_SETTINGS]
  );
  const { authToken } = useAppSelector((state) => state[RESOURCE.AUTH]);

  const initialState: IDeleteAccount = {
    token: authToken,
    reason: DELETE_REASON.USER_REQUEST,
    otherReason: null,
  };

  const validate = (values: IDeleteAccount) => {
    const errors: Record<string, any> = {};
    if (!values.otherReason || !checkEmptyString(values.otherReason))
      errors.otherReason = t("error_messages.this_field_required");
    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validate: (values) => validate(values),
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const actionResult = await dispatch(deleteAccount(values));
      const res = unwrapResult(actionResult);
      if (res) {
        resetForm();
        onClose();
        navigate(ROUTER.AUTH.MAIN);
        localStorage.removeItem("access_token");
        snack.success(t("user_messages.account_deleted"));
      }
    },
  });

  const reasons = [
    { value: "", label: t("common.selectReason") },
    {
      value: "NOT_USEFUL",
      label: t("common.notUseful"),
    },
    {
      value: "PRIVACY_CONCERNS",
      label: t("common.privacyConcerns"),
    },
    {
      value: "FOUND_ALTERNATIVE",
      label: t("common.foundAlternative"),
    },
    {
      value: "TECHNICAL_ISSUES",
      label: t("common.technicalIssues"),
    },
    { value: "OTHER", label: t("common.other") },
  ];

  useToastError({
    error: ERROR_DELETE_ACCOUNT,
    clearErrorAction: () => clearError("deleteAccount"),
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className="delete-account-modal">
        <div className="delete-account-modal-header">
          <div className="delete-account-warning-icon">
            <TriangleAlert />
          </div>
          <h2 className="delete-account-modal-title">
            {t("common.delete_account_title")}
          </h2>
          <p className="delete-account-modal-description">
            {t("common.delete_account_description")}
          </p>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="delete-account-modal-form"
        >
          <div className="delete-account-form-group">
            <label htmlFor="otherReason" className="delete-account-form-label">
              {t("common.delete_account_reason_label") || "Silmə səbəbi"}
              <span className="delete-account-required">*</span>
            </label>
            <div className="delete-account-select-wrapper">
              <select
                id="otherReason"
                name="otherReason"
                value={formik.values.otherReason || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`delete-account-form-select ${
                  formik.errors.otherReason && formik.touched.otherReason
                    ? "error"
                    : ""
                }`}
              >
                {reasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              <svg
                className="delete-account-select-arrow"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {formik.errors.otherReason && formik.touched.otherReason && (
              <h6 className="form-error">{formik.errors.otherReason}</h6>
            )}
          </div>

          <div className="delete-account-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="delete-account-btn delete-account-btn-secondary"
              disabled={LOADING_DELETE_ACCOUNT}
            >
              {t("common.cancel") || "Ləğv et"}
            </button>
            <button
              type="submit"
              className="delete-account-btn delete-account-btn-danger"
              disabled={formik.isSubmitting || LOADING_DELETE_ACCOUNT}
            >
              {formik.isSubmitting || LOADING_DELETE_ACCOUNT
                ? t("common.deleting")
                : t("common.delete_account_confirm")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
