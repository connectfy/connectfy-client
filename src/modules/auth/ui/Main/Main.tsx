import { Fragment, useCallback, useEffect, type FC } from "react";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { AuthFormType } from "../../types/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { snack } from "@/common/utils/snackManager";
import { useTranslation } from "react-i18next";
import MainSpinner from "@/components/Loading/Loading";
import MainFooter from "./components/MainFooter/MainFooter";
import { useRestoreAccountMutation } from "../../api/api";
import { useErrors } from "@/hooks/useErrors";

const MainPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [restoreAccount, { isLoading: LOADING_RESTORE_ACCOUNT }] =
    useRestoreAccountMutation();

  const { showResponseErrors } = useErrors();

  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const authPage = searchParams.get("authPage");

  const renderAuthForm = useCallback(() => {
    switch (authPage) {
      case "login":
        return <Login />;

      case "signup":
        return <Signup />;

      default:
        break;
    }
  }, [authPage]);

  useEffect(() => {
    const validAuthForms: AuthFormType[] = ["login", "signup"];

    if (!validAuthForms.includes(authPage as AuthFormType) || !authPage) {
      setSearchParams({ authPage: "login" }, { replace: true });
    }
  }, [authPage, setSearchParams]);

  useEffect(() => {
    if (!token || !type) return;

    if (type !== "restore") {
      navigate(ROUTER.AUTH.MAIN);
      return;
    }

    (async () => {
      try {
        const res = await restoreAccount({ token }).unwrap();

        if (res) {
          navigate(ROUTER.MAIN);
          snack.success(t("user_messages.restore_account_successful"));
          return;
        }
        navigate(ROUTER.AUTH.MAIN);
      } catch (error) {
        showResponseErrors(error);
        navigate(ROUTER.AUTH.MAIN);
      }
    })();
  }, [navigate, t, token, type]);

  return (
    <section>
      {LOADING_RESTORE_ACCOUNT ? (
        <MainSpinner description={{ title: t("common.restoring_account") }} />
      ) : (
        <Fragment>
          {renderAuthForm()}
          <MainFooter />
        </Fragment>
      )}
    </section>
  );
};

export default MainPage;
