import { Fragment, useCallback, useEffect, type FC } from "react";
import { RESOURCE } from "@/common/enums/enums";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { AuthFormType } from "../../types/types";
import { restoreAccount } from "../../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTER } from "@/common/constants/routet";
import { unwrapResult } from "@reduxjs/toolkit";
import { snack } from "@/common/utils/snackManager";
import { useTranslation } from "react-i18next";
import MainSpinner from "@/components/Loading/Loading";
import MainFooter from "./components/MainFooter/MainFooter";

const MainPage: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { LOADING_RESTORE_ACCOUNT } = useAppSelector(
    (state) => state[RESOURCE.AUTH],
  );

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
      const actionResult = await dispatch(restoreAccount({ token }));
      const res = unwrapResult(actionResult);

      if (res) {
        navigate(ROUTER.MAIN);
        snack.success(t("user_messages.restore_account_successful"));
        return;
      }

      navigate(ROUTER.AUTH.MAIN);
    })();
  }, [dispatch, navigate, t, token, type]);

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
