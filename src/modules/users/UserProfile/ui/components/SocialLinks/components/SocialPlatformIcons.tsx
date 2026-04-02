import { Mail, Globe, Link } from "lucide-react";
import InstagramIcon from "@/assets/icons/InstagramIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import XIcon from "@/assets/icons/XIcon";
import LinkedInIcon from "@/assets/icons/LinkedInIcon";
import YoutubeIcon from "@/assets/icons/YoutubeIcon";
import GithubIcon from "@/assets/icons/GithubIcon";
import RedditIcon from "@/assets/icons/RedditIcon";
import PinterestIcon from "@/assets/icons/PinterestIcon";
import TiktokIcon from "@/assets/icons/TiktokIcon";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import DiscordIcon from "@/assets/icons/DiscordIcon";
import SnapchatIcon from "@/assets/icons/SnapchatIcon";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import MediumIcon from "@/assets/icons/MediumIcon";
import BehanceIcon from "@/assets/icons/BehanceIcon";
import { SOCIAL_LINK_PLATFORM } from "@/common/enums/enums";

export const PLATFORM_ICONS: Record<SOCIAL_LINK_PLATFORM, React.ReactNode> = {
  [SOCIAL_LINK_PLATFORM.INSTAGRAM]: <InstagramIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.FACEBOOK]: <FacebookIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.X]: <XIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.LINKEDIN]: <LinkedInIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.YOUTUBE]: <YoutubeIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.GITHUB]: <GithubIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.REDDIT]: <RedditIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.PINTEREST]: <PinterestIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.TIKTOK]: <TiktokIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.TELEGRAM]: <TelegramIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.DISCORD]: <DiscordIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.SNAPCHAT]: <SnapchatIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.WHATSAPP]: <WhatsappIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.MEDIUM]: <MediumIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.BEHANCE]: <BehanceIcon className="w-4.5 h-4.5" />,
  [SOCIAL_LINK_PLATFORM.EMAIL]: (
    <Mail size={18} className="text-(--text-color)!" />
  ),
  [SOCIAL_LINK_PLATFORM.WEBSITE]: (
    <Globe size={18} className="text-(--text-color)!" />
  ),
  [SOCIAL_LINK_PLATFORM.OTHER]: (
    <Link size={18} className="text-(--text-color)!" />
  ),
};
