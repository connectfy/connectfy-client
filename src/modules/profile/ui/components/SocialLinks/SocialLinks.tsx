import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { Link2, Plus, ListChecks, X, Trash2, ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { ISocialLink } from "@/modules/profile/types/types";
import useBoolean from "@/hooks/useBoolean";
import AddSocialLinkModal from "./components/Modal/AddSocialLink";
import SocialLinkItem from "./components/SocialLinkItem";
import {
  useGetSocialLinksQuery,
  useRemoveSocialLinkMutation,
  useRemoveSocialLinksMutation,
} from "@/modules/profile/api/api";
import { useAuthStore } from "@/hooks/useAuthStore";
import SocialLinkSkeleton from "@/components/Skeleton/profile/SocialLinkSkeleton";
import { snack } from "@/common/utils/snackManager";
import EditSocialLinkModal from "./components/Modal/EditSocialLink";
import ActionConfirmModal from "@/components/Modal/ActionConfirmModal/ActionConfirmModal";
import { useErrors } from "@/hooks/useErrors";
import FilterDropdown, {
  FilterOption,
} from "@/components/ui/Select/FilterDropdown/FilterDropdown";
import Checkbox from "@/components/ui/CustomCheckbox/Checkbox/Checkbox";

interface IProps {
  userId: string | undefined;
}

const SocialLinks: FC<IProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { privacySettings } = usePrivacySettings();
  const { access_token } = useAuthStore();
  const { showResponseErrors } = useErrors();

  // States
  const [selectedLink, setSelectedLink] = useState<ISocialLink | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "rank" | "newest" | "oldest"
  >("rank");

  // Selection Mode States
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const addModal = useBoolean();
  const editModal = useBoolean();
  const removeOneModal = useBoolean();
  const removeMultipleModal = useBoolean();

  const sortLinks = useMemo(() => {
    const sort: Record<string, 1 | -1> = {};
    switch (activeFilter) {
      case "newest":
        sort.createdAt = -1;
        break;
      case "oldest":
        sort.createdAt = 1;
        break;
      case "rank":
      default:
        sort.rank = 1;
        break;
    }
    return sort;
  }, [activeFilter]);

  const {
    data: socialLinks,
    isLoading,
    isFetching,
  } = useGetSocialLinksQuery(
    { userId: userId || "", sort: sortLinks },
    { skip: !access_token || !userId },
  );

  const [removeOne, { isLoading: isRemoveOneLoading }] =
    useRemoveSocialLinkMutation();
  const [removeMany, { isLoading: isRemoveManyLoading }] =
    useRemoveSocialLinksMutation();

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
    setSelectedIds([]);
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const handleSocialAction = useCallback(
    (action: string, link: ISocialLink) => {
      if (isSelectionMode) return;
      switch (action) {
        case "copy":
          navigator.clipboard.writeText(link.url);
          snack.success(t("common.link_copied_to_clipboard"));
          break;
        case "edit":
          setSelectedLink(link);
          editModal.onOpen();
          break;
        case "delete":
          setSelectedLink(link);
          removeOneModal.onOpen();
          break;
        case "handleSelect":
          toggleSelectionMode();
          toggleSelect(link._id);
          break;
      }
    },
    [
      isSelectionMode,
      editModal,
      removeOneModal,
      toggleSelect,
      toggleSelectionMode,
    ],
  );

  const handleRemoveOne = async () => {
    try {
      if (selectedLink) {
        await removeOne({ _id: selectedLink._id }).unwrap();
        removeOneModal.onClose();
        setSelectedLink(null);
        snack.success(t("common.removed_successfully"));
      }
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const handleRemoveMultiple = async () => {
    try {
      if (selectedIds.length > 0) {
        await removeMany({ _ids: selectedIds, userId: userId || "" }).unwrap();
        removeMultipleModal.onClose();
        setIsSelectionMode(false);
        setSelectedIds([]);
        snack.success(t("common.removed_successfully"));
      }
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const filterOptions: FilterOption[] = useMemo(
    () => [
      {
        label: t("common.by_rank"),
        value: "rank",
        onClick: () => setActiveFilter("rank"),
      },
      {
        label: t("common.by_newest"),
        value: "newest",
        onClick: () => setActiveFilter("newest"),
      },
      {
        label: t("common.by_oldest"),
        value: "oldest",
        onClick: () => setActiveFilter("oldest"),
      },
    ],
    [t],
  );

  const hasLinks = socialLinks?.data && socialLinks.data.length > 0;

  return (
    <Fragment>
      {isLoading || isFetching ? (
        <SocialLinkSkeleton />
      ) : (
        <section
          className="p-8 mb-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
          aria-labelledby="social-links-heading"
        >
          {/* Header */}
          <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8 min-h-[40px]">
            <div className="flex items-center gap-2 md:gap-3">
              <Link2 className="w-6 h-6 md:w-7 md:h-7 text-(--primary-color)" />
              <h2
                id="social-links-heading"
                className="m-0 text-lg font-bold md:text-2xl text-(--text-color)"
              >
                {t("common.social_links")}
              </h2>
            </div>

            {/* Dynamic Header Actions with Framer Motion */}
            <div className="flex items-center gap-2 md:gap-3 relative">
              <AnimatePresence mode="wait">
                {isSelectionMode ? (
                  <motion.div
                    key="selection-actions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <Button
                      className="bg-transparent text-(--text-color) border border-(--auth-glass-border) hover:bg-white/5 font-semibold px-4 py-2 rounded-lg text-sm transition-all"
                      title={t("common.cancel")}
                      icon={<X size={16} />}
                      onClick={toggleSelectionMode}
                    />
                    <Button
                      className="bg-(--error-color) text-white font-semibold px-4 py-2 rounded-lg items-center gap-2 transition-all hover:opacity-80 border-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={`${t("common.remove")} ${selectedIds.length > 0 ? `(${selectedIds.length})` : ""}`}
                      icon={<Trash2 size={16} />}
                      onClick={removeMultipleModal.onOpen}
                      disabled={selectedIds.length === 0}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="default-actions"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <PrivacyIcon
                      privacy={
                        privacySettings?.socialLinks ||
                        PRIVACY_SETTINGS_CHOICE.EVERYONE
                      }
                      fieldName="socialLinks"
                    />

                    <FilterDropdown
                      options={filterOptions}
                      selected={activeFilter}
                      tooltip={t("common.filter")}
                      icon={
                        <ListFilter size={16} className="text-(--text-color)" />
                      }
                    />

                    {hasLinks && (
                      <Button
                        className="group flex items-center justify-center p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer border-none bg-transparent"
                        icon={<ListChecks size={18} />}
                        onClick={toggleSelectionMode}
                      />
                    )}

                    {socialLinks?.totalCount !== undefined &&
                      socialLinks.totalCount < 5 && (
                        <Fragment>
                          <Button
                            className="hidden lg:flex bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg items-center gap-2 transition-all hover:opacity-80 border-none text-sm whitespace-nowrap"
                            title={t("common.add_link")}
                            onClick={addModal.onOpen}
                          />
                          <Button
                            className="flex lg:hidden bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold p-2 rounded-lg items-center justify-center transition-all hover:opacity-80 border-none"
                            icon={<Plus size={18} />}
                            onClick={addModal.onOpen}
                          />
                        </Fragment>
                      )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* List Items */}
          <div className="flex flex-col gap-4">
            {hasLinks ? (
              socialLinks.data.map((link, index) => {
                const isSelected = selectedIds.includes(link._id);

                return (
                  <motion.div
                    key={link._id}
                    layout
                    className="flex items-center w-full"
                  >
                    <AnimatePresence>
                      {isSelectionMode && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, marginRight: 0 }}
                          animate={{
                            opacity: 1,
                            width: "auto",
                            marginRight: 16,
                          }}
                          exit={{ opacity: 0, width: 0, marginRight: 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0 cursor-pointer text-(--primary-color)"
                          onClick={() => toggleSelect(link._id)}
                        >
                          <Checkbox
                            id={link._id}
                            checked={isSelected}
                            onChange={() => toggleSelect(link._id)}
                            className={`w-6! h-6! text-(--primary-color)! transition-transform! scale-110! ${isSelected ? "bg-(--primary-color)!" : "bg-(--auth-glass-bg)!"}`}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <div
                        className={`${isSelectionMode ? "pointer-events-none opacity-80" : ""}`}
                      >
                        <SocialLinkItem
                          link={link}
                          onAction={handleSocialAction}
                          index={index}
                          closeExpanded={isSelectionMode}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center p-10 border border-dashed rounded-xl border-white/10 bg-black/5">
                <Link2
                  className="mb-3 opacity-20 text-(--text-color)"
                  size={48}
                />
                <span className="text-(--muted-color) italic font-medium">
                  {t("common.no_social_links")}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {addModal.open && (
        <AddSocialLinkModal
          open={addModal.open}
          onClose={addModal.onClose}
          userId={userId || ""}
        />
      )}

      {editModal.open && (
        <EditSocialLinkModal
          open={editModal.open}
          onClose={() => {
            editModal.onClose();
            setSelectedLink(null);
          }}
          socialLink={selectedLink as ISocialLink}
        />
      )}

      {/* Single Remove Modal */}
      {removeOneModal.open && (
        <ActionConfirmModal
          open={removeOneModal.open}
          onClose={removeOneModal.onClose}
          onCancel={removeOneModal.onClose}
          onConfirm={handleRemoveOne}
          header={{ title: t("common.remove_social_link_title") }}
          cancelBtn={{ title: t("common.cancel") }}
          confirmBtn={{
            title: t("common.remove"),
            color: "var(--error-color)",
          }}
          isLoading={isRemoveOneLoading}
        >
          <p className="text-center text-[15px] text-(--muted-color)">
            {t("common.remove_social_link_desc")}
          </p>
        </ActionConfirmModal>
      )}

      {/* Bulk Remove Modal */}
      {removeMultipleModal.open && (
        <ActionConfirmModal
          open={removeMultipleModal.open}
          onClose={removeMultipleModal.onClose}
          onCancel={removeMultipleModal.onClose}
          onConfirm={handleRemoveMultiple}
          header={{
            title: t("common.remove_selected_links_title", {
              count: selectedIds.length,
            }),
          }}
          cancelBtn={{ title: t("common.cancel") }}
          confirmBtn={{
            title: t("common.remove"),
            color: "var(--error-color)",
          }}
          isLoading={isRemoveManyLoading}
        >
          <p className="text-center text-[15px] text-(--muted-color)">
            {t("common.remove_multiple_social_links_desc", {
              count: selectedIds.length,
            })}
          </p>
        </ActionConfirmModal>
      )}
    </Fragment>
  );
};

export default SocialLinks;
