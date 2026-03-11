import { FC, memo, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthSidebar from "@/components/Sidebar/Auth/AuthSidebar";
import MainIcon from "@/assets/icons/MainIcon";
import AuthFooter from "@/modules/auth/ui/components/Footer/AuthFooter/AuthFooter";
import { ROUTER } from "@/common/constants/routet";

const AuthLayout: FC = () => {
  const location = useLocation();

  const [isSignupPage, setIsSignupPage] = useState<boolean>(false);
  const isMobile = window.innerWidth < 1024;

  useEffect(() => {
    if (location.pathname === ROUTER.AUTH.SIGNUP) {
      setIsSignupPage(true);
    } else {
      setIsSignupPage(false);
    }
  }, [location]);

  return (
    <div
      className="min-h-screen w-full font-sans antialiased text-(--text-(--primary-color)) bg-(--auth-main-bg)"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="flex min-h-screen lg:h-screen w-full flex-col lg:flex-row">
        <AuthSidebar />

        <div
          className={`flex flex-1 flex-col items-center justify-center px-6 ${isSignupPage && !isMobile ? "py-5" : "py-12"} lg:px-16 relative overflow-y-auto`}
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <MainIcon
              className="size-10 rounded-xl flex items-center justify-center"
              styles={{
                backgroundColor: "var(--auth-sidebar-glow)",
                color: "#fff",
                width: 45,
                height: 45,
                padding: 8,
              }}
            />
            <h2 className="text-3xl font-extrabold tracking-tighter">
              Connectfy
            </h2>
          </div>

          <div className="w-full max-w-[500px] space-y-10 min-h-0 contain-layout">
            <Outlet />

            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AuthLayout);
