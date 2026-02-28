import {
  ChevronDown,
  ChevronUp,
  Copy,
  Edit,
  ExternalLink,
  Trash2,
  Plus,
} from "lucide-react";
import "./socialLinks.style.css";
import { memo, useState } from "react";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { ISocialLink } from "@/modules/profile/types/types";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useGetPrivacySettingsQuery } from "@/modules/settings/PrivacySettings/api/api";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";

// Social Link Item Component
const SocialLinkItem = memo(
  ({
    link,
    onAction,
    index,
    t,
  }: {
    link: ISocialLink;
    onAction: (action: string, link: ISocialLink) => void;
    index: number;
    t: TFunction;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(link.url);
      onAction("copy", link);
    };

    return (
      <div
        className="profile-social-item"
        style={{ "--item-index": index } as React.CSSProperties}
      >
        <button
          className="profile-social-header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={`${link.platform} - ${link.name}`}
        >
          <div className="profile-social-info">
            <span className="profile-social-platform">{link.platform}</span>
            <span className="profile-social-name">{link.name}</span>
          </div>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isExpanded && (
          <div className="profile-social-details">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-social-url"
              aria-label={`Open ${link.platform} profile`}
            >
              {link.url}
            </a>

            <div className="profile-social-actions">
              <button
                className="profile-action-btn"
                onClick={() => window.open(link.url, "_blank")}
                title="Open"
                aria-label="Open in new tab"
              >
                <ExternalLink size={16} />
                <span>{t("common.open")}</span>
              </button>
              <button
                className="profile-action-btn"
                onClick={handleCopy}
                title="Copy"
                aria-label="Copy URL"
              >
                <Copy size={16} />
                <span>{t("common.copy")}</span>
              </button>
              <button
                className="profile-action-btn"
                onClick={() => onAction("edit", link)}
                title="Edit"
                aria-label="Edit link"
              >
                <Edit size={16} />
                <span>{t("common.edit")}</span>
              </button>
              <button
                className="profile-action-btn profile-action-delete"
                onClick={() => onAction("delete", link)}
                title="Delete"
                aria-label="Delete link"
              >
                <Trash2 size={16} />
                <span>{t("common.remove")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  },
);

const SocialLinks = () => {
  const { t } = useTranslation();

  const { access_token } = useAuthStore();

  const socialLinks: ISocialLink[] = [];
  const { data: privacySettings } = useGetPrivacySettingsQuery(undefined, {
    skip: !access_token,
  });

  const handleSocialAction = (action: string, link: ISocialLink) => {
    switch (action) {
      case "copy":
        alert("Link copied to clipboard!");
        break;
      case "edit":
        // Open edit modal
        console.log("Edit link:", link);
        break;
      case "delete":
        if (confirm(`Are you sure you want to delete ${link.platform} link?`)) {
          console.log("Delete link:", link);
        }
        break;
    }
  };

  return (
    <section
      className="profile-page-section"
      aria-labelledby="social-links-heading"
    >
      <div className="profile-page-section-header">
        <h2 id="social-links-heading" className="profile-page-section-title">
          {t("common.social_links")}
        </h2>
        <div className="profile-page-section-actions">
          <PrivacyIcon
            privacy={
              privacySettings?.socialLinks || PRIVACY_SETTINGS_CHOICE.EVERYONE
            }
            fieldName="socialLinks"
          />
          <button
            className="profile-edit-button"
            aria-label="Edit personal information"
          >
            <Plus size={16} />
            <span>{t("common.add_link")}</span>
          </button>
        </div>
      </div>

      <div className="profile-social-list">
        {!socialLinks || !socialLinks.length
          ? t("common.no_social_links")
          : socialLinks.map((link, index) => (
              <SocialLinkItem
                key={link._id}
                link={link}
                onAction={handleSocialAction}
                index={index}
                t={t}
              />
            ))}
      </div>
    </section>
  );
};

export default SocialLinks;
