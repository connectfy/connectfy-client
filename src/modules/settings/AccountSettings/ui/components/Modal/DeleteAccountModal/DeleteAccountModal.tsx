import { FC } from "react";
import Modal from "@/components/Modal";
import { useTranslation } from "react-i18next";
import { DELETE_REASON_CODE } from "@/common/enums/enums";
import { useFormik } from "formik";
import { checkEmptyString } from "@/common/utils/checkValues";
import { TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { IDeleteAccount } from "../../../../types/types";
import { useDeleteAccountMutation } from "@/modules/settings/AccountSettings/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import Button from "@/components/ui/CustomButton/Button/Button";
import Textarea from "@/components/ui/TextArea/Textarea";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MAX_REASON_LENGTH = 200;

const DeleteAccountModal: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { authenticateToken, clear } = useAuthStore();
  const { showResponseErrors } = useErrors();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const initialState: IDeleteAccount = {
    token: authenticateToken as string,
    reasonCode: null,
    reasonDescription: null,
  };

  const validate = (values: IDeleteAccount) => {
    const errors: Record<string, string> = {};
    if (!values.reasonCode || !checkEmptyString(values.reasonCode)) {
      errors.reasonCode = t("error_messages.this_field_required");
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: initialState,
    validate,
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await deleteAccount(values).unwrap();
        resetForm();
        onClose();
        clear("all");
        navigate(ROUTER.AUTH.MAIN);
        snack.success(t("user_messages.account_deleted"));
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const reasons = [
    { value: null, label: t("common.selectReason") },
    { value: DELETE_REASON_CODE.NOT_USEFUL, label: t("common.notUseful") },
    {
      value: DELETE_REASON_CODE.PRIVACY_CONCERNS,
      label: t("common.privacyConcerns"),
    },
    {
      value: DELETE_REASON_CODE.FOUND_ALTERNATIVE,
      label: t("common.foundAlternative"),
    },
    {
      value: DELETE_REASON_CODE.TECHNICAL_ISSUES,
      label: t("common.technicalIssues"),
    },
    { value: DELETE_REASON_CODE.OTHER, label: t("common.other") },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full max-w-[440px] overflow-hidden rounded-2xl bg-(--card-bg) p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/10 text-red-600">
            <TriangleAlert size={30} strokeWidth={2.5} />
          </div>

          <h2 className="mb-2 text-2xl font-bold tracking-tight text-(--text-color)">
            {t("common.delete_account_title")}
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-(--muted-color)">
            {t("common.delete_account_description")}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="reasonCode"
              className="mb-2 block text-sm font-semibold text-(--text-color)"
            >
              {t("common.delete_account_reason_label")}
            </label>

            <div className="relative group">
              <select
                id="reasonCode"
                name="reasonCode"
                value={formik.values.reasonCode || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full appearance-none rounded-xl border bg-(--secondary-color) px-4 py-3 text-sm text-(--text-color) outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-red-500/20 border-(--border-color) hover:border-(--muted-color"
              >
                {reasons.map((reason) => (
                  <option
                    key={reason.value}
                    value={reason.value || ""}
                    className="bg-(--card-bg)"
                  >
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            {formik.values.reasonCode &&
              formik.values.reasonCode !==
                DELETE_REASON_CODE.FOUND_ALTERNATIVE && (
                <div className="relative mt-4">
                  <Textarea
                    id="reasonDescription"
                    name="reasonDescription"
                    value={formik.values.reasonDescription || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    maxLength={MAX_REASON_LENGTH}
                    isFloating={false}
                    placeholder={t("common.reason_description")}
                    className="w-full! rounded-xl! border-(--border-color)! bg-(--secondary-color)! text-sm! focus:border-red-500/50! focus:ring-red-500/20! max-h-[130px] resize-none!"
                  />

                  {/* Character Limit Counter */}
                  <div className="mt-1 flex justify-end">
                    <span
                      className={`text-[11px] font-medium ${(formik.values.reasonDescription?.length || 0) >= MAX_REASON_LENGTH ? "text-red-500" : "text-(--muted-color)"}`}
                    >
                      {formik.values.reasonDescription?.length || 0} /{" "}
                      {MAX_REASON_LENGTH}
                    </span>
                  </div>
                </div>
              )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:pt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-(--border-color) bg-transparent py-3 text-sm font-semibold text-(--text-color) transition-all hover:bg-(--disabled-bg)"
              title={t("common.cancel")}
            />
            <Button
              type="submit"
              disabled={
                formik.isSubmitting ||
                isLoading ||
                !formik.values.reasonCode ||
                !checkEmptyString(formik.values.reasonCode)
              }
              isLoading={formik.isSubmitting || isLoading}
              className="flex-1 rounded-xl bg-(--error-color) py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300"
              title={
                formik.isSubmitting || isLoading
                  ? t("common.deleting")
                  : t("common.delete_account_confirm")
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
