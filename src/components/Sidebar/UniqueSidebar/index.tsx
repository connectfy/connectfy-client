import { FC, Fragment, memo, useEffect, useState } from "react";
import "./index.style.css";
import { useLocation } from "react-router-dom";
import { ChevronRight, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

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
      currentPath === s.path ? true : currentPath.startsWith(s.path)
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
      <aside className="unique-sidebar-wrapper">
        <div className="unique-sidebar-card">
          <div className="unique-sidebar-header">
            {title && (
              <div className="unique-sidebar-header__icon" aria-hidden>
                <title.icon />
              </div>
            )}
            <h3 className="unique-sidebar-title">{title?.name}</h3>
          </div>
          <ul className="unique-sidebar-list">
            {subjects.map((s) => (
              <li
                key={s.key}
                onClick={() => handleClick(s)}
                className={`unique-sidebar-item ${activeKey === s.key ? "active" : ""}`}
              >
                <div className="item-left">
                  <div className="item-icon">
                    <s.icon />
                    {s.badge !== null && s.badge > 0 && (
                      <span className="item-badge">
                        {s.badge > 99 ? "99+" : s.badge}
                      </span>
                    )}
                  </div>
                  <span className="item-title">{s.name}</span>
                </div>
                <ChevronRight />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </Fragment>
  );
};

export default memo(UniqueSidebar);
