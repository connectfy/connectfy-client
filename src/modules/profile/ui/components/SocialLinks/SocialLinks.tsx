import "./socialLinks.style.css";
import { memo, useState } from "react";
import { PrivacyIcon } from "../PrivacyIcon/PrivacyIcon";
import { ISocialLink } from "@/modules/profile/types/types";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { PRIVACY_SETTINGS_CHOICE } from "@/common/enums/enums";
import Button from "@/components/ui/CustomButton/Button/Button";
import { usePrivacySettings } from "@/modules/settings/PrivacySettings/hooks/usePrivacySettings";

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
        <Button
          className="profile-social-header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={`${link.platform} - ${link.name}`}
        >
          <div className="profile-social-info">
            <span className="profile-social-platform">{link.platform}</span>
            <span className="profile-social-name">{link.name}</span>
          </div>
          {isExpanded ? (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              expand_less
            </span>
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "18px" }}
            >
              expand_more
            </span>
          )}
        </Button>

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
              <Button
                className="profile-action-btn"
                onClick={() => window.open(link.url, "_blank")}
                title={t("common.open")}
                aria-label={t("common.open")}
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    open_in_new
                  </span>
                }
              />
              <Button
                className="profile-action-btn"
                onClick={handleCopy}
                title={t("common.copy")}
                aria-label={t("common.copy")}
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    copy
                  </span>
                }
              />
              <Button
                className="profile-action-btn"
                onClick={() => onAction("edit", link)}
                title={t("common.edit")}
                aria-label={t("common.edit")}
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    edit
                  </span>
                }
              />
              <Button
                className="profile-action-btn profile-action-delete"
                onClick={() => onAction("delete", link)}
                title={t("common.remove")}
                aria-label={t("common.remove")}
                icon={
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    delete
                  </span>
                }
              />
            </div>
          </div>
        )}
      </div>
    );
  },
);

const SocialLinks = () => {
  const { t } = useTranslation();

  const socialLinks: ISocialLink[] = [];
  const { privacySettings } = usePrivacySettings();

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
          <Button
            className="profile-edit-button"
            aria-label={t("common.add_link")}
            title={t("common.add_link")}
            icon={
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "16px" }}
              >
                add
              </span>
            }
          />
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
