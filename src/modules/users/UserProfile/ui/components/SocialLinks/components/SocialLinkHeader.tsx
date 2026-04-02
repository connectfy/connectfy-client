import { FC, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, ListFilter, MoreVertical } from "lucide-react";

import Dropdown, {
  DropdownOption,
} from "@/components/ui/Select/Dropdown/Dropdown";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ISocialLinkHeaderProps {
  hasLinks: boolean;
  activeFilter: "rank" | "newest" | "oldest";
  onFilterChange: (filter: "rank" | "newest" | "oldest") => void;
}

export const SocialLinkHeader: FC<ISocialLinkHeaderProps> = ({
  hasLinks,
  activeFilter,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const filterOptions: DropdownOption[] = useMemo(
    () => [
      {
        label: t("common.by_rank"),
        value: "rank",
        isActive: activeFilter === "rank",
        onClick: () => onFilterChange("rank"),
      },
      {
        label: t("common.by_newest"),
        value: "newest",
        isActive: activeFilter === "newest",
        onClick: () => onFilterChange("newest"),
      },
      {
        label: t("common.by_oldest"),
        value: "oldest",
        isActive: activeFilter === "oldest",
        onClick: () => onFilterChange("oldest"),
      },
    ],
    [t, onFilterChange, activeFilter],
  );

  const mobileMoreOptions: DropdownOption[] = useMemo(() => {
    const options: DropdownOption[] = [];
    if (hasLinks) {
      options.push({
        label: t("common.filter"),
        value: "filter",
        icon: <ListFilter size={16} />,
        subMenu: filterOptions,
      });
    }
    return options;
  }, [hasLinks, filterOptions, t]);

  return (
    <div className="flex flex-row items-center justify-between gap-3 mb-6 md:mb-8 min-h-[40px]">
      <div className="flex items-center gap-2 md:gap-3">
        <Link2 className="w-6 h-6 md:w-7 md:h-7 text-(--primary-color)" />
        <h2 className="m-0 text-lg font-bold md:text-2xl text-(--text-color)">
          {t("common.social_links")}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key="default"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-2 md:gap-3"
          >
            {isMobile ? (
              <Dropdown
                options={mobileMoreOptions}
                icon={<MoreVertical size={20} />}
                tooltip={t("common.more")}
              />
            ) : (
              <Fragment>
                <Dropdown
                  options={filterOptions}
                  selected={activeFilter}
                  icon={<ListFilter size={18} />}
                  tooltip={t("common.filter")}
                />
              </Fragment>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialLinkHeader;
