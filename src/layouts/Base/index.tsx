import "./index.style.css";
import DesktopSidebar from "@/components/Sidebar/Desktop";
import MobileSidebar from "@/components/Sidebar/Mobile";
import { FC, memo, ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

const BaseLayout: FC<Props> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 886);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section
      id="layout"
      className={isMobile ? "mobile-layout" : "desktop-layout"}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="layout-sidebar-box">
          <DesktopSidebar />
        </div>
      )}

      {/* Content */}
      <div className="layout-content-box">{children || <Outlet />}</div>

      {/* Mobile Sidebar */}
      {isMobile && <MobileSidebar />}
    </section>
  );
};

export default memo(BaseLayout);
