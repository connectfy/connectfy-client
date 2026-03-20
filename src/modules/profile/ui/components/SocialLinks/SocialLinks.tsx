import { FC, Fragment, useMemo, useState } from "react";
import { Link2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
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

interface IProps {
  userId: string | undefined;
}

const SocialLinks: FC<IProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { privacySettings } = usePrivacySettings();
  const { access_token } = useAuthStore();
  const { showResponseErrors } = useErrors();

  const [selectedLink, setSelectedLink] = useState<ISocialLink | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    "rank" | "newest" | "oldest"
  >("rank");

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
    {
      userId: userId || "",
      sort: sortLinks,
    },
    { skip: !access_token || !userId },
  );
  const [removeOne, { isLoading: isRemoveOneLoading }] =
    useRemoveSocialLinkMutation();

  const addModal = useBoolean();
  const editModal = useBoolean();
  const removeOneModal = useBoolean();

  const handleSocialAction = (action: string, link: ISocialLink) => {
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
    }
  };

  const handleRemoveOne = async () => {
    try {
      if (selectedLink) {
        await removeOne({
          _id: selectedLink._id,
        });
        removeOneModal.onClose();
        setSelectedLink(null);
      }
    } catch (error) {
      showResponseErrors(error);
    }
  };

  const filterOptions: FilterOption[] = [
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
  ];

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
          <div className="flex flex-row  items-center justify-between gap-3 mb-6 md:mb-8">
            {/* Sol tərəf: İkon və Başlıq */}
            <div className="flex items-center gap-2 md:gap-3">
              <Link2 className="w-6 h-6 md:w-7 md:h-7 text-(--primary-color)" />
              <h2
                id="social-links-heading"
                className="m-0 text-lg font-bold md:text-2xl text-(--text-color)"
              >
                {t("common.social_links")}
              </h2>
            </div>

            {/* Sağ tərəf: Məxfilik və Əlavə et düyməsi */}
            <div className="flex items-center gap-2 md:gap-3">
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
              />

              {socialLinks?.totalCount && socialLinks?.totalCount < 5 && (
                <Fragment>
                  <Button
                    className="hidden lg:flex bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg items-center gap-2 transition-all hover:opacity-80 border-none text-sm whitespace-nowrap"
                    title={t("common.add_link")}
                    onClick={addModal.onOpen}
                  />

                  {/* Mobil ekranlar üçün ikonlu düymə (1024px-dən aşağı görünür) */}
                  <Button
                    className="flex lg:hidden bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold p-3 rounded-lg items-center justify-center transition-all hover:opacity-80 border-none"
                    icon={<Plus size={16} />}
                    onClick={addModal.onOpen}
                  />
                </Fragment>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {socialLinks?.data && socialLinks?.data.length > 0 ? (
              socialLinks?.data?.map((link, index) => (
                <SocialLinkItem
                  key={link._id}
                  link={link}
                  onAction={handleSocialAction}
                  index={index}
                  t={t}
                />
              ))
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
          userId={userId || ""}
          socialLink={selectedLink as ISocialLink}
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
    </Fragment>
  );
};

export default SocialLinks;
