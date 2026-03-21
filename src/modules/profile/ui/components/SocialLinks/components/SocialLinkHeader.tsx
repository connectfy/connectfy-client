import { FC, useMemo, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Plus,
  ListChecks,
  X,
  Trash2,
  ListFilter,
  ArrowUpDown,
  Save,
  MoreVertical,
} from "lucide-react";
import { Tooltip } from "@mui/material";

import Button from "@/components/ui/CustomButton/Button/Button";
import Dropdown, {
  DropdownOption,
} from "@/components/ui/Select/Dropdown/Dropdown";
import { PrivacyIcon } from "../../PrivacyIcon/PrivacyIcon";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ISocialLinkHeaderProps {
  isSelectionMode: boolean;
  isReorderMode: boolean;
  hasLinks: boolean;
  selectedCount: number;
  totalCount: number | undefined;
  activeFilter: "rank" | "newest" | "oldest";
  privacy: PRIVACY_SETTINGS_CHOICE;
  isUpdateRankLoading: boolean;

  onToggleSelectionMode: () => void;
  onToggleReorderMode: () => void;
  onRemoveMultiple: () => void;
  onSaveOrder: () => void;
  onAddClick: () => void;
  onFilterChange: (filter: "rank" | "newest" | "oldest") => void;
}

export const SocialLinkHeader: FC<ISocialLinkHeaderProps> = ({
  isSelectionMode,
  isReorderMode,
  hasLinks,
  selectedCount,
  totalCount,
  activeFilter,
  privacy,
  isUpdateRankLoading,
  onToggleSelectionMode,
  onToggleReorderMode,
  onRemoveMultiple,
  onSaveOrder,
  onAddClick,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const filterOptions: DropdownOption[] = useMemo(
    () => [
      {
        label: t("common.by_rank"),
        value: "rank",
        onClick: () => onFilterChange("rank"),
      },
      {
        label: t("common.by_newest"),
        value: "newest",
        onClick: () => onFilterChange("newest"),
      },
      {
        label: t("common.by_oldest"),
        value: "oldest",
        onClick: () => onFilterChange("oldest"),
      },
    ],
    [t, onFilterChange],
  );

  const mobileMoreOptions: DropdownOption[] = useMemo(() => {
    const options: DropdownOption[] = [];
    if (hasLinks) {
      options.push(
        {
          label: t("common.filter"),
          value: "filter",
          icon: <ListFilter size={16} />,
          subMenu: filterOptions,
        },
        {
          label: t("common.reorder"),
          value: "reorder",
          icon: <ArrowUpDown size={16} />,
          onClick: onToggleReorderMode,
        },
        {
          label: t("common.select"),
          value: "select",
          icon: <ListChecks size={16} />,
          onClick: onToggleSelectionMode,
        },
      );
    }
    if (totalCount !== undefined && totalCount < 5) {
      options.push({
        label: t("common.add_link"),
        value: "add",
        icon: <Plus size={16} />,
        onClick: onAddClick,
        className: "!text-(--btn-edit-text) !bg-(--btn-edit-bg)/20 mt-1",
      });
    }
    return options;
  }, [
    hasLinks,
    totalCount,
    filterOptions,
    onToggleReorderMode,
    onToggleSelectionMode,
    onAddClick,
    t,
  ]);

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
          {isSelectionMode ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Button
                className="bg-transparent text-(--text-color) border border-(--auth-glass-border) hover:bg-white/5 font-semibold px-4 py-2 rounded-lg text-sm"
                title={t("common.cancel")}
                icon={<X size={16} />}
                onClick={onToggleSelectionMode}
              />
              <Button
                className="bg-(--error-color) text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 border-none text-sm disabled:opacity-50"
                title={`${t("common.remove")} ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
                icon={<Trash2 size={16} />}
                onClick={onRemoveMultiple}
                disabled={selectedCount === 0}
              />
            </motion.div>
          ) : isReorderMode ? (
            <motion.div
              key="reorder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Button
                className="bg-transparent text-(--text-color) border border-(--auth-glass-border) hover:bg-white/5 font-semibold px-4 py-2 rounded-lg text-sm"
                title={t("common.cancel")}
                icon={<X size={16} />}
                onClick={onToggleReorderMode}
                disabled={isUpdateRankLoading}
              />
              <Button
                className="bg-(--primary-color) text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-80 border-none text-sm"
                title={t("common.save")}
                icon={<Save size={16} />}
                onClick={onSaveOrder}
                isLoading={isUpdateRankLoading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-2 md:gap-3"
            >
              <PrivacyIcon privacy={privacy} fieldName="socialLinks" />
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
                  {hasLinks && (
                    <Fragment>
                      <Tooltip title={t("common.reorder")} placement="top">
                        <Button
                          className="p-1.5 rounded-lg border-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                          icon={<ArrowUpDown size={18} />}
                          onClick={onToggleReorderMode}
                        />
                      </Tooltip>
                      <Tooltip title={t("common.select")} placement="top">
                        <Button
                          className="p-1.5 rounded-lg border-none bg-transparent hover:bg-black/5 dark:hover:bg-white/5"
                          icon={<ListChecks size={18} />}
                          onClick={onToggleSelectionMode}
                        />
                      </Tooltip>
                    </Fragment>
                  )}
                  {totalCount !== undefined && totalCount < 5 && (
                    <Button
                      className="bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg border-none text-sm"
                      title={t("common.add_link")}
                      onClick={onAddClick}
                    />
                  )}
                </Fragment>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialLinkHeader;
