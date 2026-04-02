import { FC, Fragment, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link2 } from "lucide-react";
import { Reorder } from "framer-motion";

import { useAuthStore } from "@/store/zustand/useAuthStore";
import { ISocialLink } from "@/modules/profile/types/types";
import { snack } from "@/common/utils/snackManager";

import { useGetSocialLinksQuery } from "@/modules/profile/api/api";

import SocialLinkSkeleton from "@/components/Skeleton/profile/SocialLinkSkeleton";

import SocialLinkItem from "./components/SocialLinkItem";
import SocialLinkHeader from "./components/SocialLinkHeader";
import { useContextMenu } from "@/hooks/useContextMenu";
import SocialContextMenu from "./components/SocialContextMenu";

interface IProps {
  userId: string | undefined;
}

const SocialLinks: FC<IProps> = ({ userId }) => {
  const { t } = useTranslation();
  const { access_token } = useAuthStore();

  // States
  const [activeFilter, setActiveFilter] = useState<
    "rank" | "newest" | "oldest"
  >("rank");
  const [_, setReorderLinks] = useState<ISocialLink[]>([]);

  const { handleContextMenu } = useContextMenu();

  // API Hooks
  const { data: socialLinks, isLoading } = useGetSocialLinksQuery(
    { userId: userId || "" },
    { skip: !access_token || !userId },
  );

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

  const orderedLinks = sortedData;

  const handleSocialAction = useCallback(
    (action: string, link: ISocialLink) => {
      switch (action) {
        case "openLink":
          window.open(link.url, "_blank");
          break;
        case "copy":
          navigator.clipboard.writeText(link.url);
          snack.success(t("common.link_copied"));
          break;
      }
    },
    [t],
  );

  const hasLinks = orderedLinks && orderedLinks.length > 0;

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
            hasLinks={hasLinks}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Siyahı hissəsi */}
          {hasLinks ? (
            <Reorder.Group
              axis="y"
              values={orderedLinks}
              onReorder={setReorderLinks}
              className="flex flex-col gap-4"
            >
              {orderedLinks.map((link, index) => {
                return (
                  <Reorder.Item
                    key={link._id}
                    value={link}
                    className={"flex items-center w-full"}
                    onContextMenu={(e) => {
                      handleContextMenu(
                        e,
                        <SocialContextMenu
                          onCopy={() => handleSocialAction("copy", link)}
                          onOpenLink={() =>
                            handleSocialAction("openLink", link)
                          }
                        />,
                      );
                    }}
                  >
                    <div className="flex-1 min-w-0 transition-all duration-300">
                      <div>
                        <SocialLinkItem
                          link={link}
                          onAction={handleSocialAction}
                          index={index}
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
    </Fragment>
  );
};

export default SocialLinks;
