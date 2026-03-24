import "./baseLayout.style.css";
import DesktopSidebar from "@/components/Sidebar/Desktop/DesktopSidebar";
import MobileSidebar from "@/components/Sidebar/Mobile/MobileSidebar";
import { useIsMobile } from "@/hooks/useIsMobile";
import { FC, memo, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

const BaseLayout: FC<Props> = ({ children }) => {
  const isMobile = useIsMobile();

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
