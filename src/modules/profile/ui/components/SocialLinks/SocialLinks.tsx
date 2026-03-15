import { memo, useState } from "react";
import {
  Link2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { ISocialLink } from "@/modules/profile/types/types";
import { Link } from "react-router-dom";

// Social Link Item Component
const SocialLinkItem = memo(
  ({
    link,
    onAction,
    t,
  }: {
    link: ISocialLink;
    onAction: (action: string, link: ISocialLink) => void;
    index: number;
    t: TFunction;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation(); // Accordion-un bağlanmaması üçün
      navigator.clipboard.writeText(link.url);
      onAction("copy", link);
    };

    return (
      <div className="relative overflow-hidden transition-all duration-300 border bg-(--info-card-bg) border-(--info-card-border) rounded-xl hover:border-(--primary-color) group">
        {/* Accent Bar (Hover zamanı solda görünən rəngli xətt) */}
        <div className="absolute top-0 left-0 w-1 h-full transition-opacity opacity-0 bg-(--primary-color) group-hover:opacity-100" />

        {/* Header Button */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full px-5 py-4 text-left transition-colors hover:bg-(--active-bg-2)"
          aria-expanded={isExpanded}
        >
          <div className="flex flex-col gap-1">
            <span className="text-[15px] font-bold text-(--text-color) tracking-wide">
              {link.platform}
            </span>
            <span className="text-sm font-medium text-(--muted-color)">
              {link.name}
            </span>
          </div>
          <div className="text-(--muted-color) group-hover:text-(--text-color) transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </Button>

        {/* Details (Expanded Content) */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
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
                onClick={() => window.open(link.url, "_blank")}
                icon={<ExternalLink size={16} />}
                label={t("common.open")}
              />
              <ActionButton
                onClick={handleCopy}
                icon={<Copy size={16} />}
                label={t("common.copy")}
              />
              <ActionButton
                onClick={() => onAction("edit", link)}
                icon={<Pencil size={16} />}
                label={t("common.edit")}
              />
              <ActionButton
                onClick={() => onAction("delete", link)}
                icon={<Trash2 size={16} />}
                label={t("common.remove")}
                isDelete
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

const SocialLinks = () => {
  const { t } = useTranslation();
  const { privacySettings } = usePrivacySettings();

  const screenWidth = window.innerWidth;

  // Nümunə məlumatlar (Proyektində hook-dan gələcək)
  const socialLinks: ISocialLink[] = [];

  const handleSocialAction = (action: string, link: ISocialLink) => {
    switch (action) {
      case "copy":
        // Toast mesajı əlavə etmək olar
        break;
      case "edit":
        console.log("Edit:", link);
        break;
      case "delete":
        console.log("Delete:", link);
        break;
    }
  };

  return (
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
              privacySettings?.socialLinks || PRIVACY_SETTINGS_CHOICE.EVERYONE
            }
            fieldName="socialLinks"
          />

          {screenWidth > 1024 ? (
            <Button
              className="bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:opacity-80 border-none text-sm whitespace-nowrap"
              title={t("common.add_link")}
            />
          ) : (
            <Button
              className="bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold px-3 py-1 rounded-lg flex items-center gap-2 transition-all hover:opacity-80 border-none"
              icon={
                <span className="text-[20px]! material-symbols-outlined">
                  add
                </span>
              }
            />
          )}
        </div>
      </div>

      {/* Social List */}
      <div className="flex flex-col gap-4">
        {socialLinks.length > 0 ? (
          socialLinks.map((link, index) => (
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
            <Link2 className="mb-3 opacity-20 text-(--text-color)" size={48} />
            <span className="text-(--muted-color) italic font-medium">
              {t("common.no_social_links")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default SocialLinks;
