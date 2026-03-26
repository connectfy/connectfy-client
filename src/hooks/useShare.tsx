import { useState } from "react";
import WhatsappIcon from "@/assets/icons/WhatsappIcon";
import TelegramIcon from "@/assets/icons/TelegramIcon";
import FacebookIcon from "@/assets/icons/FacebookIcon";
import XIcon from "@/assets/icons/XIcon";

interface ShareOptions {
  url: string;
  text?: string;
  title?: string;
}

export const useShare = ({ url, text }: ShareOptions) => {
  const [isOpen, setIsOpen] = useState(false);

  const shareLinks = [
    {
      label: "Telegram",
      icon: <TelegramIcon className="w-5 h-5" />,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || "")}`,
    },
    {
      label: "WhatsApp",
      icon: <WhatsappIcon className="w-5 h-5" />,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    },
    {
      label: "X (Twitter)",
      icon: <XIcon className="w-5 h-5" />,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || "")}`,
    },
    {
      label: "Facebook",
      icon: <FacebookIcon className="w-5 h-5" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      action: "open",
    },
  ];

  const handleOpen = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, shareLinks, handleOpen };
};
