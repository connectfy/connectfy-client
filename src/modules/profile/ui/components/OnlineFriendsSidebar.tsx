import { FC, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import Button from "@/components/ui/CustomButton/Button/Button";

// Mock Datalar
const ONLINE_FRIENDS = [
  {
    id: 1,
    name: "Samir Aliyev",
    role: "Design Lead",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Leyla M.",
    role: "Photographer",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Anar Karimov",
    role: "Developer",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 4,
    name: "Gunel S.",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
];

const SUGGESTIONS = [
  {
    id: 5,
    name: "Nigar Ahmadova",
    mutual: 4,
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 6,
    name: "Elvin G.",
    mutual: 2,
    avatar: "https://i.pravatar.cc/150?img=15",
  },
];

interface OnlineFriendsSidebarProps {
  isOpen: boolean;
}

const OnlineFriendsSidebar: FC<OnlineFriendsSidebarProps> = ({ isOpen }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className="h-full bg-(--bg-color) border-l border-(--input-border) shrink-0 overflow-hidden"
        >
          {/* Məzmunun animasiya vaxtı qırılmaması üçün daxili sabit genişlik */}
          <div className="w-[400px] h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4">
              <h2 className="text-[22px] font-bold text-(--text-color)">
                {t("common.online_friends")}
              </h2>
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-(--icon-green-bg) text-(--icon-green-text)">
                12
              </span>
            </div>

            {/* Online Friends List */}
            <div className="flex flex-col px-4 pb-6">
              {ONLINE_FRIENDS.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-(--disabled-bg) transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-[46px] h-[46px] rounded-full object-cover"
                      />
                      {/* Yaşıl status nöqtəsi */}
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-(--primary-color) border-[2.5px] border-(--bg-color) rounded-full"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-(--text-color)">
                        {friend.name}
                      </span>
                      <span className="text-[13px] font-medium text-(--muted-color)">
                        {friend.role}
                      </span>
                    </div>
                  </div>
                  <Button className="text-(--text-disabled) group-hover:text-(--primary-color) transition-colors p-1">
                    <MessageSquare size={22} strokeWidth={1.5} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="px-6 py-2">
              <div className="w-full h-px bg-(--input-border)"></div>
            </div>

            {/* Suggestions Section */}
            <div className="flex flex-col px-4 py-4">
              <h3 className="px-3 pb-4 text-[12px] font-bold tracking-widest text-(--muted-color) uppercase">
                {t("common.suggestions")}
              </h3>

              <div className="flex flex-col gap-1">
                {SUGGESTIONS.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-(--disabled-bg) transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={suggestion.avatar}
                        alt={suggestion.name}
                        className="w-[46px] h-[46px] rounded-xl object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-(--text-color)">
                          {suggestion.name}
                        </span>
                        <span className="text-[12px] font-medium text-(--muted-color)">
                          {t("common.mutual_friends")} {suggestion.mutual}
                        </span>
                      </div>
                    </div>
                    <Button className="text-(--primary-color) p-2 rounded-lg hover:bg-(--active-bg-2) transition-colors">
                      <UserPlus size={20} strokeWidth={2} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="px-6 pb-8 mt-auto pt-4">
              <Button className="w-full py-3.5 text-[15px] font-bold text-(--muted-color) border-2 border-dashed border-(--input-border) rounded-[14px] hover:bg-(--disabled-bg) hover:text-(--text-color) transition-all">
                {t("common.more")}
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default memo(OnlineFriendsSidebar);
