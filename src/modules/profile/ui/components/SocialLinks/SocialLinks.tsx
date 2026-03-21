import { FC, Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link2, GripVertical } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useErrors } from "@/hooks/useErrors";
import useBoolean from "@/hooks/useBoolean";
import { ISocialLink } from "@/modules/profile/types/types";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import { snack } from "@/common/utils/snackManager";

import {
  useGetSocialLinksQuery,
  useRemoveSocialLinkMutation,
  useRemoveSocialLinksMutation,
  useUpdateSocialLinkRankMutation,
} from "@/modules/profile/api/api";

import SocialLinkSkeleton from "@/components/Skeleton/profile/SocialLinkSkeleton";
import ActionConfirmModal from "@/components/Modal/ActionConfirmModal/ActionConfirmModal";
import Checkbox from "@/components/ui/CustomCheckbox/Checkbox/Checkbox";

import SocialLinkItem from "./components/SocialLinkItem";
import AddSocialLinkModal from "./components/Modal/AddSocialLink";
import EditSocialLinkModal from "./components/Modal/EditSocialLink";
import SocialLinkHeader from "./components/SocialLinkHeader";
import { useContextMenu } from "@/hooks/useContextMenu";
import SocialContextMenu from "./components/SocialContextMenu";

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

  // Modes
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [orderedLinks, setOrderedLinks] = useState<ISocialLink[]>([]);

  // Modals
  const addModal = useBoolean();
  const editModal = useBoolean();
  const removeOneModal = useBoolean();
  const removeMultipleModal = useBoolean();

  const { handleContextMenu, closeMenu } = useContextMenu();

  // API Hooks
  const { data: socialLinks, isLoading } = useGetSocialLinksQuery(
    { userId: userId || "" },
    { skip: !access_token || !userId },
  );

  const [removeOne, { isLoading: isRemoveOneLoading }] =
    useRemoveSocialLinkMutation();
  const [removeMany, { isLoading: isRemoveManyLoading }] =
    useRemoveSocialLinksMutation();
  const [updateRank, { isLoading: isUpdateRankLoading }] =
    useUpdateSocialLinkRankMutation();

  const sortedData = useMemo(() => {
    if (!socialLinks?.data) return [];

    const links = [...socialLinks.data];

    switch (activeFilter) {
      case "newest":
        return links.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      case "oldest":
        return links.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
      case "rank":
      default:
        return links.sort((a, b) => (a.rank || 0) - (b.rank || 0));
    }
  }, [socialLinks?.data, activeFilter]);

  // Actions
  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
    setIsReorderMode(false);
    setSelectedIds([]);
  }, []);

  const toggleReorderMode = useCallback(() => {
    setIsReorderMode((prev) => !prev);
    setIsSelectionMode(false);
    if (isReorderMode && socialLinks?.data) {
      setOrderedLinks(socialLinks.data);
    }
  }, [isReorderMode, socialLinks?.data]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }, []);

  const handleSocialAction = useCallback(
    (action: string, link: ISocialLink) => {
      if (isSelectionMode || isReorderMode) return;
      switch (action) {
        case "openLink":
          window.open(link.url, "_blank");
          break;
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
      isReorderMode,
      editModal,
      removeOneModal,
      toggleSelect,
      toggleSelectionMode,
      t,
    ],
  );

  const handleSaveOrder = async () => {
    try {
      const payload = orderedLinks.map((link, index) => ({
        _id: link._id,
        rank: index + 1,
      }));

      await updateRank({
        links: payload,
        userId: userId || "",
      }).unwrap();

      setIsReorderMode(false);
      snack.success(t("common.order_saved_successfully"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const handleRemoveOne = async () => {
    if (!selectedLink) return;
    try {
      await removeOne({ _id: selectedLink._id }).unwrap();
      removeOneModal.onClose();
      setSelectedLink(null);
      snack.success(t("common.removed_successfully"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const handleRemoveMultiple = async () => {
    if (selectedIds.length === 0) return;
    try {
      await removeMany({ _ids: selectedIds, userId: userId || "" }).unwrap();
      removeMultipleModal.onClose();
      setIsSelectionMode(false);
      setSelectedIds([]);
      snack.success(t("common.removed_successfully"));
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const hasLinks = orderedLinks && orderedLinks.length > 0;
  const currentPrivacy =
    privacySettings?.socialLinks || PRIVACY_SETTINGS_CHOICE.EVERYONE;

  // Drag & drop üçün datanın sinxronlaşdırılması
  useEffect(() => {
    if (sortedData && !isReorderMode) {
      setOrderedLinks(sortedData);
    }
  }, [sortedData, isReorderMode]);

  return (
    <Fragment>
      {isLoading ? (
        <SocialLinkSkeleton />
      ) : (
        <section
          className="p-8 mb-8 transition-all duration-300 bg-(--auth-main-bg) rounded-[20px] border border-(--auth-glass-border) shadow-(--card-shadow)"
          aria-labelledby="social-links-heading"
        >
          {/* Ekstrakt edilmiş Header Komponenti */}
          <SocialLinkHeader
            isSelectionMode={isSelectionMode}
            isReorderMode={isReorderMode}
            hasLinks={hasLinks}
            selectedCount={selectedIds.length}
            totalCount={socialLinks?.totalCount}
            activeFilter={activeFilter}
            privacy={currentPrivacy}
            isUpdateRankLoading={isUpdateRankLoading}
            onToggleSelectionMode={toggleSelectionMode}
            onToggleReorderMode={toggleReorderMode}
            onRemoveMultiple={removeMultipleModal.onOpen}
            onSaveOrder={handleSaveOrder}
            onAddClick={addModal.onOpen}
            onFilterChange={setActiveFilter}
          />

          {/* Siyahı hissəsi */}
          {hasLinks ? (
            <Reorder.Group
              axis="y"
              values={orderedLinks}
              onReorder={setOrderedLinks}
              className="flex flex-col gap-4"
            >
              {orderedLinks.map((link, index) => {
                const isSelected = selectedIds.includes(link._id);

                return (
                  <Reorder.Item
                    key={link._id}
                    value={link}
                    dragListener={isReorderMode}
                    className={`flex items-center w-full ${isReorderMode ? "cursor-grab active:cursor-grabbing" : ""}`}
                    onContextMenu={(e) => {
                      if (isSelectionMode || isReorderMode) return;

                      handleContextMenu(
                        e,
                        <SocialContextMenu
                          onClose={closeMenu}
                          onCopy={() => handleSocialAction("copy", link)}
                          onEdit={() => handleSocialAction("edit", link)}
                          onOpenLink={() =>
                            handleSocialAction("openLink", link)
                          }
                          onRemove={() => {
                            setSelectedLink(link);
                            removeOneModal.onOpen();
                          }}
                          onSelect={() => {
                            setIsSelectionMode(true);
                            toggleSelect(link._id);
                          }}
                          onReorder={() => setIsReorderMode(true)}
                        />,
                      );
                    }}
                  >
                    <AnimatePresence mode="popLayout">
                      {isReorderMode && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, marginRight: 0 }}
                          animate={{
                            opacity: 1,
                            width: "auto",
                            marginRight: 16,
                          }}
                          exit={{ opacity: 0, width: 0, marginRight: 0 }}
                          transition={{ duration: 0.2 }}
                          className="shrink-0 flex items-center justify-center text-(--muted-color)"
                        >
                          <GripVertical size={20} />
                        </motion.div>
                      )}

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
                        className={`${isSelectionMode || isReorderMode ? "pointer-events-none opacity-80" : ""}`}
                      >
                        <SocialLinkItem
                          link={link}
                          onAction={handleSocialAction}
                          index={index}
                          closeExpanded={isSelectionMode || isReorderMode}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
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
        </section>
      )}

      {/* Modallar */}
      {addModal.open && (
        <AddSocialLinkModal
          open={addModal.open}
          onClose={addModal.onClose}
          userId={userId || ""}
        />
      )}

      {editModal.open && selectedLink && (
        <EditSocialLinkModal
          open={editModal.open}
          onClose={() => {
            editModal.onClose();
            setSelectedLink(null);
          }}
          socialLink={selectedLink}
        />
      )}

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

      {removeMultipleModal.open && (
        <ActionConfirmModal
          open={removeMultipleModal.open}
          onClose={removeMultipleModal.onClose}
          onCancel={removeMultipleModal.onClose}
          onConfirm={handleRemoveMultiple}
          header={{ title: t("common.remove_social_link_title") }}
          cancelBtn={{ title: t("common.cancel") }}
          confirmBtn={{
            title: t("common.remove"),
            color: "var(--error-color)",
          }}
          isLoading={isRemoveManyLoading}
        >
          <p className="text-center text-[15px] text-(--muted-color)">
            {t("common.remove_social_links_desc", {
              count: selectedIds.length,
            })}
          </p>
        </ActionConfirmModal>
      )}
    </Fragment>
  );
};

export default SocialLinks;
