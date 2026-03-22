import { FC, Fragment, memo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronRight, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { motion } from "framer-motion";

interface Subject {
  name: string;
  path: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  key: string;
  badge: number | null;
  onClick: () => void;
}

interface Props {
  title?: {
    name: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
  };
  subjects: Subject[];
  mobile?: boolean;
}

const UniqueSidebar: FC<Props> = ({ title, subjects }) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname || "/";
    const matched = subjects.find((s) =>
      currentPath === s.path ? true : currentPath.startsWith(s.path),
    );
    if (matched) setActiveKey(matched.key);
    else setActiveKey(null);
  }, [location.pathname, subjects]);

  const handleClick = (s: Subject) => {
    setActiveKey(s.key);
    s.onClick();
  };

  return (
    <Fragment>
      <aside className="w-full mx-auto">
        <div
          className="w-full rounded-xl md:rounded-[16px] p-4 md:p-[18px] lg:p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] 
             dark:shadow-[0_20px_50px_rgba(0,0,0,1)] 
             border border-black/3 dark:border-white/5"
        >
          <div className="flex items-center gap-3 pb-3 mb-3 border-b border-black/5 dark:border-white/5 select-none">
            {title && (
              <div
                className="relative overflow-hidden inline-flex items-center justify-center 
                    w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] 
                    rounded-[12px] lg:rounded-[14px] 
                    bg-linear-to-br from-(--third-color) to-(--hover-bg)
                    shadow-[0_8px_20px_rgba(46,204,113,0.3)]"
              >
                <motion.div
                  initial={{ x: "-150%", skewX: -20 }}
                  animate={{ x: "150%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 2,
                  }}
                  className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent z-1"
                />

                {/* ICON */}
                <title.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white relative z-10" />
              </div>
            )}

            <h3 className="font-extrabold text-[18px] lg:text-[22px] text-(--text-primary)">
              {title?.name}
            </h3>
          </div>

          <ul className="list-none p-0 m-0 mt-3 flex flex-col gap-2.5">
            {subjects.map((s) => {
              const isActive = activeKey === s.key;

              return (
                <li
                  key={s.key}
                  onClick={() => handleClick(s)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-180 ease-out overflow-visible
                    ${
                      isActive
                        ? "bg-linear-to-br from-[rgba(46,204,113,0.12)] to-[rgba(46,204,113,0.04)] text-(--primary-color) shadow-[0_6px_18px_rgba(46,204,113,0.12)] translate-x-[6px]"
                        : "bg-transparent text-slate-500 hover:bg-[rgba(46,204,113,0.04)] hover:text-(--primary-color) hover:translate-x-[6px]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center w-[38px] h-[38px] lg:w-[44px] lg:h-[44px] rounded-[10px] bg-[#64748b]/6 overflow-visible">
                      <s.icon className="w-[18px] h-[18px] lg:w-5 lg:h-5" />

                      {s.badge !== null && s.badge > 0 && (
                        <span className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 bg-linear-to-br from-red-500 to-red-600 text-white text-[10px] font-bold px-[5px] py-px lg:px-1.5 lg:py-[2px] rounded-[10px] min-w-[20px] text-center">
                          {s.badge > 99 ? "99+" : s.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[14px] lg:text-[15px] font-semibold">
                      {s.name}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </Fragment>
  );
};

export default memo(UniqueSidebar);
