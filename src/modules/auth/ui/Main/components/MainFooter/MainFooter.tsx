import { Fragment, useCallback, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/hooks/useStore";
import useBoolean from "@/hooks/useBoolean";
import { snack } from "@/common/utils/snackManager";
import { checkDeviceId } from "@/common/utils/checkDevice";
import { googleLogin } from "@/modules/auth/api/api";
import { unwrapResult } from "@reduxjs/toolkit";
import { ROUTER } from "@/common/constants/routet";
import { GoogleLogin } from "@react-oauth/google";
import SignupModal from "../SignupModal/SignupModal";

const MainFooter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const isModalOpen = useBoolean();

  const [idToken, setIdToken] = useState<string | null>(null);

  const googleButtonRef = useRef<HTMLDivElement>(null);

  const authPage = searchParams.get("authPage");

  const isLoginPage = authPage === "login";

  const handleNavigate = useCallback(() => {
    if (isLoginPage) {
      setSearchParams({ authPage: "signup" });
    } else {
      setSearchParams({ authPage: "login", loginMode: "username" });
    }
  }, [isLoginPage, setSearchParams]);

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const idToken = tokenResponse.credential;

      if (!idToken) {
        snack.error(t("error_messages.google_login_failed"));
        return;
      }

      if (authPage === "login") {
        const deviceId = checkDeviceId();
        const actionResult = await dispatch(googleLogin({ idToken, deviceId }));
        const res = unwrapResult(actionResult);
        if (res) {
          snack.success(t("user_messages.login_successful"));
          navigate(ROUTER.MAIN);
          localStorage.removeItem("authPage");
          localStorage.removeItem("loginMode");
          localStorage.removeItem("forgotPasswordMode");
        }
      } else {
        setIdToken(idToken);
        isModalOpen.onOpen();
      }
    } catch (error: any) {
      snack.error(error);
    }
  };

  const handleCustomGoogleClick = () => {
    const googleButton = googleButtonRef.current?.querySelector(
      "div[role='button']",
    ) as HTMLElement;
    if (googleButton) {
      googleButton.click();
    }
  };

  return (
    <Fragment>
      {/* Social Login Separator */}
      <div className="relative py-2 my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-(--input-border)"></div>
        </div>
        <div className="relative flex justify-center text-xs font-bold tracking-widest uppercase">
          <span className="bg-(--auth-main-bg) px-4 text-(--text-secondary)">
            {t("common.or_continue_with")}
          </span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-1 gap-4">
        {/* ✅ Custom Google Button */}
        <button
          onClick={handleCustomGoogleClick}
          className="cursor-pointer flex items-center justify-center gap-3 py-3 rounded-xl border border-(--input-border) bg-(--input-bg) text-(--text-(--primary-color)) opacity-70 hover:opacity-100 duration-400 active:scale-[0.98] transition-all font-medium text-sm"
        >
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

        {/* ✅ Real Google button (gizli) */}
        <div ref={googleButtonRef} className="hidden">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => snack.error(t("error_messages.google_login_failed"))}
            useOneTap={false}
          />
        </div>
      </div>

      <p className="text-center text-sm text-(--text-secondary) mb-5 mt-8">
        {isLoginPage
          ? t("common.do_not_have_account")
          : t("common.already_have_account")}{" "}
        <span
          className="font-bold text-(--primary-color) hover:underline cursor-pointer"
          onClick={handleNavigate}
        >
          {isLoginPage ? t("common.create_an_account") : t("common.login")}
        </span>
      </p>

      <SignupModal
        isOpen={isModalOpen.open}
        onClose={isModalOpen.onClose}
        idToken={idToken}
      />
    </Fragment>
  );
};

export default MainFooter;
