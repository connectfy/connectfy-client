import { FC, memo, ReactNode } from "react";
import "./authLayout.style.css";
import AuthSidebar from "@/components/Sidebar/Auth/AuthSidebar.tsx";
import MainIcon from "@/assets/icons/MainIcon.tsx";

interface Props {
  children?: ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  const colors = {
    primary: "#34d399",
    bgDark: "#020a06",
    bgGlass: "rgba(255, 255, 255, 0.03)",
    borderGlass: "rgba(255, 255, 255, 0.08)",
    inputBg: "#0d1410",
    inputBorder: "#1a2e23",
  };

  return (
    <div
      className="min-h-screen w-full font-sans antialiased text-white selection:bg-[#34d399] selection:text-black"
      style={{
        backgroundColor: colors.bgDark,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div className="flex min-h-screen w-full flex-col lg:flex-row">
        <AuthSidebar colors={colors} />

        <div
          className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-16 relative"
          style={{ backgroundColor: "#050b08" }}
        >
          {/* Mobil üçün Logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <MainIcon
              className="size-10 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              styles={{
                backgroundColor: colors.primary,
                color: "#ffffff",
                width: 45,
                height: 45,
                padding: 8,
              }}
            />
            <h2 className="text-3xl font-extrabold tracking-tighter text-white">
              Connectfy
            </h2>
          </div>

          <div className="w-full max-w-[420px] space-y-10">
            {/* Form Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Welcome back
              </h2>
              <p className="text-[#6b8c7c] text-sm">
                Please enter your details to sign in to your account.
              </p>
            </div>

            {/* Inputs */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6b8c7c] uppercase tracking-wider ml-1">
                  Email or Username
                </label>
                <input
                  className="w-full px-5 py-4 rounded-xl text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:ring-2 focus:ring-[#34d399]/50"
                  style={{
                    backgroundColor: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                  }}
                  placeholder="name@company.com"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-[#6b8c7c] uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-bold text-[#34d399] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-5 py-4 rounded-xl text-white outline-none transition-all duration-200 placeholder:text-white/20 focus:ring-2 focus:ring-[#34d399]/50"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.inputBorder}`,
                    }}
                    placeholder="••••••••"
                    type="password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b8c7c] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      visibility
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer size-5 appearance-none rounded border border-[#1a2e23] bg-[#0d1410] checked:bg-[#34d399] checked:border-[#34d399] transition-all cursor-pointer"
                  />
                  <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] text-black opacity-0 peer-checked:opacity-100 pointer-events-none">
                    check
                  </span>
                </div>
                <label
                  htmlFor="remember"
                  className="text-sm text-[#6b8c7c] select-none cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>

              <button
                className="w-full py-4 font-bold text-lg rounded-xl transition-all transform active:scale-[0.98] hover:brightness-110 shadow-[0_4px_14px_0_rgba(52,211,153,0.39)]"
                style={{
                  backgroundColor: colors.primary,
                  color: "#020a06",
                }}
                type="submit"
              >
                Sign In
              </button>
            </form>

            {/* Social Login Separator */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#1a2e23]"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
                <span className="bg-[#050b08] px-4 text-[#4a6156]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3 rounded-xl border border-[#1a2e23] bg-[#0d1410] text-white hover:bg-[#15241b] transition-colors font-medium text-sm">
                {/* Google SVG */}
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3 rounded-xl border border-[#1a2e23] bg-[#0d1410] text-white hover:bg-[#15241b] transition-colors font-medium text-sm">
                <svg className="size-5 fill-white" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.96.95-2.15 2.1-3.66 2.1-1.47 0-1.97-.93-3.72-.93-1.76 0-2.31.91-3.72.93-1.46.03-2.79-1.29-3.75-2.25-1.98-1.98-3.48-5.59-3.48-8.72 0-3.16 1.63-4.83 3.19-4.83 1.48 0 2.37.93 3.73.93 1.25 0 2.02-.93 3.72-.93 1.34 0 2.58.62 3.36 1.65-3.23 1.34-2.71 6.03.54 7.42-.6 1.49-1.37 2.97-2.21 3.63zm-4.32-15.82c-.06-1.55 1.22-3.08 2.65-3.46.33 1.76-1.33 3.44-2.65 3.46z"></path>
                </svg>
                Apple
              </button>
            </div>

            <p className="text-center text-sm text-[#6b8c7c]">
              New to Connectfy?{" "}
              <a className="font-bold text-[#34d399] hover:underline" href="#">
                Create an account
              </a>
            </p>

            {/* Footer */}
            <div className="pt-8 flex items-center justify-between border-t border-[#1a2e23] mt-auto">
              <button className="flex items-center gap-2 text-xs font-bold text-[#6b8c7c] hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">globe</span>
                English (US)
              </button>

              <div className="flex bg-[#0d1410] p-1 rounded-lg border border-[#1a2e23]">
                <button className="p-1.5 rounded text-[#6b8c7c] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[18px]">
                    light_mode
                  </span>
                </button>
                <button className="p-1.5 rounded bg-[#34d399] text-[#020a06] shadow-sm">
                  <span className="material-symbols-outlined text-[18px] font-bold">
                    dark_mode
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AuthLayout);
