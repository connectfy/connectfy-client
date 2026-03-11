import { useEffect, FC } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { useTranslation } from "react-i18next";
import MainSpinner from "@/components/Loading/Loading";
import { useRestoreAccountMutation } from "../../api/api";
import { useErrors } from "@/hooks/useErrors";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useTheme } from "@/context/ThemeContext";

const MainPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [restoreAccount, { isLoading: LOADING_RESTORE_ACCOUNT }] =
    useRestoreAccountMutation();

  const { toggleTheme } = useTheme();
  const { setToken } = useAuthStore();
  const { showResponseErrors } = useErrors();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");

  useEffect(() => {
    if (!token || !type || type !== "restore") {
      navigate(ROUTER.AUTH.LOGIN);
      return;
    }

    (async () => {
      try {
        const res = await restoreAccount({ token }).unwrap();

        setToken({
          type: "access_token",
          token: res.access_token,
        });
        navigate(ROUTER.MAIN);
        snack.success(t("user_messages.restore_account_successful"));
        navigate(res.startupPage);
        toggleTheme(res.theme);
      } catch (error) {
        showResponseErrors(error);
        navigate(ROUTER.AUTH.LOGIN);
      }
    })();
  }, [navigate, t, token, type]);

  return (
    <section>
      {LOADING_RESTORE_ACCOUNT ? (
        <MainSpinner description={{ title: t("common.restoring_account") }} />
      ) : null}
    </section>
  );
};

export default MainPage;
