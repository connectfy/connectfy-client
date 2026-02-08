import "./privacySettings.style.css";
import { CheckCircle, Shield, UserCheck } from "lucide-react";
import { Fragment } from "react";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useTranslation } from "react-i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import UniqueHeader from "@/components/Header/UnqiueHeader/UniqueHeader";
import SettingCard from "@/components/Card/SettingsCard/SettingCard";
import ToggleCard from "@/components/Card/ToggleCard/ToggleCard";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import {
  initialState,
  PRIVACY_FIELDS,
  privacyOptions,
  validatePrivacySettings,
} from "../constants/constant";
import { useFormik } from "formik";
import { snack } from "@/common/utils/snackManager";
import { useBlocker } from "@/hooks/useBlocker";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";
import SaveChangesModal from "@/components/Modal/SaveChangesModal/SaveChangesModal";
import {
  useGetPrivacySettingsQuery,
  useEditPrivacySettingsMutation,
} from "../api/api";
import { useErrors } from "@/hooks/useErrors";
import { SettingsSpinner } from "@/components/Spinner/Settings/SettingsSpinner";

const PrivacySettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading: LOADING_GET } = useGetPrivacySettingsQuery();

  const [editPrivacySettings, { isLoading: LOADING_UPDATE }] =
    useEditPrivacySettingsMutation();

  const { showResponseErrors } = useErrors();

  const formik = useFormik({
    initialValues: initialState(data!),
    validateOnBlur: false,
    validateOnChange: false,
    enableReinitialize: true,
    validate: (values) => validatePrivacySettings(values, t),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await editPrivacySettings(values).unwrap();
        if (res) {
          snack.success(t("user_messages.information_updated"));
          resetForm();
        }
      } catch (error) {
        showResponseErrors(error);
      }
    },
  });

  const { pending, confirm, cancel } = useBlocker(!!formik.dirty);
  useBeforeUnload(!!formik.dirty, t("common.unsaved_changes_message"));

  const PRIVACY_OPTIONS = privacyOptions(t);

  const getLabel = (key?: string | null) =>
    PRIVACY_OPTIONS.find((opt) => opt.key === key)?.name || t("common.select");

  const createOptions = (
    activeKey: string,
    onSelect: (value: PRIVACY_SETTINGS_CHOICE) => void,
  ) => ({
    title: t("common.privacy_level"),
    activeKey,
    selections: PRIVACY_OPTIONS.map((opt) => ({
      key: opt.key,
      name: opt.name,
      title: opt.name,
      icon: opt.icon,
      onClick: () => onSelect(opt.key as PRIVACY_SETTINGS_CHOICE),
    })),
  });

  const onClickBack = () => navigate(ROUTER.SETTINGS.MAIN);

  const privacyFields = PRIVACY_FIELDS(t);

  const handleSaveAndLeave = async () => {
    await formik.submitForm();
    confirm();
  };

  const handleDiscardChanges = () => {
    formik.resetForm();
    confirm();
  };

  const handleCancelModal = () => {
    cancel();
  };

  return (
    <Fragment>
      <section className="privacy-settings">
        <div className="privacy-settings-container">
          <UniqueHeader
            headerTitle={t("common.privacy_header")}
            headerSubtitle={t("common.privacy_description")}
            onClickBack={onClickBack}
            onClickSave={formik.handleSubmit}
            showChangesButton
            isChangesDisasbled={!formik.dirty || LOADING_UPDATE}
            isLoading={LOADING_UPDATE}
          />

          {LOADING_GET ? (
            <SettingsSpinner />
          ) : (
            <Fragment>
              <div className="privacy-settings-content">
                {/* ACTION PRIVACY */}
                <div className="privacy-section">
                  <h2 className="privacy-section-title">
                    {t("common.activity_privacy")}
                  </h2>

                  <ToggleCard
                    header={{
                      icon: CheckCircle,
                      title: t("common.read_receipts"),
                      subtitle: t("common.read_receipts_desc"),
                    }}
                    slider={{
                      checked: !!formik.values.readReceipts,
                      onClick: () =>
                        formik.setFieldValue(
                          "readReceipts",
                          !formik.values.readReceipts,
                        ),
                    }}
                  />

                  <ToggleCard
                    header={{
                      icon: UserCheck,
                      title: t("common.friend_requests"),
                      subtitle: t("common.friend_requests_desc"),
                    }}
                    slider={{
                      checked: !!formik.values.friendshipRequest,
                      onClick: () =>
                        formik.setFieldValue(
                          "friendshipRequest",
                          !formik.values.friendshipRequest,
                        ),
                    }}
                  />

                  <SettingCard
                    header={{
                      icon: Shield,
                      title: t("common.message_privacy"),
                      subtitle: t("common.message_privacy_desc"),
                    }}
                  >
                    <CustomSelect
                      buttonTitle={getLabel(
                        formik.values.messageRequest as PRIVACY_SETTINGS_CHOICE,
                      )}
                      options={createOptions(
                        formik.values.messageRequest as PRIVACY_SETTINGS_CHOICE,
                        (val) => formik.setFieldValue("messageRequest", val),
                      )}
                    />
                  </SettingCard>
                </div>

                {/* DATA PRIVACY */}
                <div className="privacy-section">
                  <h2 className="privacy-section-title">
                    {t("common.data_privacy")}
                  </h2>

                  <SettingCard
                    cardStyle={{
                      padding: "5px 16px 20px 16px",
                    }}
                  >
                    <Fragment>
                      {privacyFields.map((item, idx) => {
                        const activeValue = formik.values[
                          item.field as keyof typeof formik.values
                        ] as string | undefined;
                        return (
                          <div
                            className="privacy-row"
                            key={item.field}
                            style={idx > 0 ? { marginTop: "12px" } : {}}
                          >
                            <span className="privacy-row-label">
                              {item.label}
                            </span>
                            <div className="privacy-row-select">
                              <CustomSelect
                                buttonTitle={getLabel(activeValue)}
                                options={createOptions(
                                  activeValue as string,
                                  (val) =>
                                    formik.setFieldValue(item.field, val),
                                )}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </Fragment>
                  </SettingCard>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </section>

      <SaveChangesModal
        open={!!pending}
        handleSave={handleSaveAndLeave}
        handleCancel={handleCancelModal}
        handleDiscardChanges={handleDiscardChanges}
        isLoading={LOADING_UPDATE}
      />
    </Fragment>
  );
};

export default PrivacySettings;
