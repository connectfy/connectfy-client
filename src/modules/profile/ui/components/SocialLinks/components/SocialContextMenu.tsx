import { FC } from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  ListChecks,
  ArrowUpDown,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ContextMenuItem from "@/components/ContextMenu/ContextMenuItem";

interface ContextMenuProps {
  onEdit: () => void;
  onRemove: () => void;
  onSelect: () => void;
  onReorder: () => void;
  onCopy: () => void;
  onOpenLink: () => void;
}

const SocialContextMenu: FC<ContextMenuProps> = ({
  onEdit,
  onRemove,
  onSelect,
  onReorder,
  onCopy,
  onOpenLink,
}) => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col min-w-[220px] bg-(--bg-color) rounded-2xl shadow-2xl overflow-hidden"
    >
      <ContextMenuItem
        icon={ExternalLink}
        label={t("common.open")}
        onClick={onOpenLink}
      />
      <ContextMenuItem icon={Copy} label={t("common.copy")} onClick={onCopy} />
      <ContextMenuItem
        icon={Pencil}
        label={t("common.edit")}
        onClick={onEdit}
      />

      <div className="h-px bg-white/5 mx-2" />

      <ContextMenuItem
        icon={ListChecks}
        label={t("common.select")}
        onClick={onSelect}
      />
      <ContextMenuItem
        icon={ArrowUpDown}
        label={t("common.reorder")}
        onClick={onReorder}
      />

      <div className="h-px bg-white/5 mx-2" />

      <ContextMenuItem
        icon={Trash2}
        label={t("common.remove")}
        onClick={onRemove}
        isWarning
      />
    </motion.div>
  );
};

export default SocialContextMenu;
