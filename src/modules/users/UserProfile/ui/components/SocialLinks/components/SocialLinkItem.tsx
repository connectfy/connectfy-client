import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, ExternalLink, Copy } from "lucide-react";
import { memo, useState } from "react";
import { ISocialLink } from "@/modules/profile/types/types";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useTranslation } from "react-i18next";
import { PLATFORM_ICONS } from "./SocialPlatformIcons";
import { SOCIAL_LINK_PLATFORM } from "@/common/enums/enums";

// Social Link Item Component
const SocialLinkItem = memo(
  ({
    link,
    onAction,
    index,
  }: {
    link: ISocialLink;
    onAction: (action: string, link: ISocialLink) => void;
    index: number;
  }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(link.url);
      onAction("copy", link);
    };

    return (
      <div
        className={
          "relative overflow-hidden transition-all duration-300 border rounded-xl group bg-(--info-card-bg) border-(--info-card-border) hover:border-(--primary-color)"
        }
        data-testid={`social-link-item-${index}`}
      >
        {/* Accent Bar (Hover zamanı solda görünən rəngli xətt) */}
        <div
          className={
            "absolute top-0 left-0 w-1 h-full transition-opacity bg-(--primary-color) opacity-0 group-hover:opacity-100"
          }
        />

        {/* Header Button */}
        <Button
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
          className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-(--active-bg-2)"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center gap-3">
            <div
              className={
                "transition-colors shrink-0 text-(--muted-color) group-hover:text-(--primary-color)"
              }
            >
              {PLATFORM_ICONS[link.platform as SOCIAL_LINK_PLATFORM]}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold text-(--text-color) tracking-wide">
                {link.platform}
              </span>
              <span className="text-sm font-medium text-(--muted-color)">
                {link.name}
              </span>
            </div>
          </div>
          {/* DƏYİŞİKLİK: Selection mode-da chevron-u gizlədə və ya checkbox göstərə bilərsən. 
              Amma sadəlik üçün chevron-u seçim zamanı gizlətmək daha yaxşıdır. */}

          <div className="text-(--muted-color) group-hover:text-(--text-color) transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </Button>

        {/* Details (Expanded Content) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="p-5 pt-0 border-t border-(--info-card-border)/50">
            {/* URL Display */}
            <Link
              to={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 mt-4 text-sm font-medium transition-all border border-dashed rounded-lg border-white/10 text-(--primary-color) bg-white/70 dark:bg-black/30 truncate"
            >
              {link.url}
            </Link>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <ActionButton
                onClick={() => onAction("openLink", link)}
                icon={<ExternalLink size={16} />}
                label={t("common.open")}
              />
              <ActionButton
                onClick={handleCopy}
                icon={<Copy size={16} />}
                label={t("common.copy")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
);

// Köməkçi Düymə Komponenti (Daxili düymələr üçün)
const ActionButton = ({ onClick, icon, label, isDelete }: any) => (
  <Button
    onClick={onClick}
    className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all border
      ${
        isDelete
          ? "border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white"
          : "border-white/5 bg-white/5 text-(--text-color) hover:bg-(--primary-color) hover:text-white hover:scale-[1.02]"
      }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </Button>
);

export default SocialLinkItem;
