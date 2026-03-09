import { Fragment, useCallback, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useBoolean from "@/hooks/useBoolean";
import { snack } from "@/common/utils/snackManager";
import { GoogleLogin } from "@react-oauth/google";
import SignupModal from "../SignupModal/SignupModal";
import { CHECK_UNIQUE_FIELD } from "@/common/enums/enums";
import { jwtDecode } from "jwt-decode";
import {
  useCheckUniqueMutation,
  useGoogleLoginMutation,
} from "@/modules/auth/api/api";
import { useErrors } from "@/hooks/useErrors";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTheme } from "@/context/ThemeContext";
import Button from "@/components/ui/CustomButton/Button/Button";
import GoogleIcon from "@/assets/icons/GoogleIcon";

const MainFooter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { setToken } = useAuthStore();

  const [checkUnique, { isLoading: LOADING_CHECK_UNIQUE }] =
    useCheckUniqueMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const { showResponseErrors } = useErrors();

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
        try {
          const res = await googleLogin({ idToken }).unwrap();

          setToken({
            type: "access_token",
            token: res.access_token,
          });
          snack.success(
            t("user_messages.login_successful", { lng: res.language }),
          );
          navigate(res.startupPage);
          toggleTheme(res.theme);
        } catch (error) {
          showResponseErrors(error);
        }
      } else {
        try {
          const decoded = jwtDecode<{ email?: string }>(idToken);
          const email = decoded.email;

          if (!email) {
            snack.error(t("error_messages.email_not_found"));
            return;
          }

          await checkUnique({
            field: CHECK_UNIQUE_FIELD.EMAIL,
            value: email,
          }).unwrap();
          setIdToken(idToken);
          isModalOpen.onOpen();
        } catch (error) {
          showResponseErrors(error);
        }
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
        <Button
          onClick={handleCustomGoogleClick}
          className="cursor-pointer flex items-center justify-center gap-3 py-3 rounded-xl border border-(--input-border) bg-(--input-bg) text-(--text-(--primary-color)) opacity-70 hover:opacity-100 duration-400 active:scale-[0.98] transition-all font-medium text-sm"
        >
          {/* Google SVG */}
          <GoogleIcon />
          Google
        </Button>

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
        isLoading={LOADING_CHECK_UNIQUE}
      />
    </Fragment>
  );
};

export default MainFooter;
