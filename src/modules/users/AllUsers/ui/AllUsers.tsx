import { useTranslation } from "react-i18next";
import { Fragment, useState, useCallback } from "react";
import { Search } from "lucide-react";
import UniqueHeader from "@/components/Header/UnqiueHeader/UniqueHeader";
import { LoadingSpinner } from "@/components/Spinner/Settings/LoadingSpinner";
import Input from "@/components/ui/CustomInput/Input/Input";
import Button from "@/components/ui/CustomButton/Button/Button";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { ROUTER } from "@/common/constants/routet";
import { useSearchQuery } from "../api/api";
import { useUser } from "@/context/UserContext";
import { checkEmptyString } from "@/common/utils/checkValues";
import type { ISearchUsers, ISearchUserResult } from "../types/types";
import UserCard from "@/components/Card/UserCard/UserCard";

const INITIAL_PARAMS: ISearchUsers = { search: "", skip: 1, limit: 10 };

const AllUsers = () => {
  const { t } = useTranslation();
  const { navigate } = useAppNavigation();
  const { user } = useUser();

  const [searchParams, setSearchParams] =
    useState<ISearchUsers>(INITIAL_PARAMS);

  const { data, isLoading } = useSearchQuery(searchParams, {
    skip: !user?._id || !checkEmptyString(searchParams.search),
  });

  const handleSearch = useCallback(() => {
    setSearchParams((prev) => ({ ...prev, skip: 1 }));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value || "";

      if (value.length) {
        setSearchParams((prev) => ({ ...prev, search: value, skip: 1 }));
      } else {
        setSearchParams((prev) => ({ ...prev, search: value, skip: 1 }));
      }
    },
    [],
  );

  const handleToggleFriend = useCallback((_id: string) => {
    console.log("toggle friend:", _id);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch],
  );

  const users: ISearchUserResult[] = data?.data ?? [];

  return (
    <Fragment>
      <section
        className="w-full h-full pb-5 flex flex-col box-border"
        style={{ background: "var(--bg-color)", color: "var(--text-color)" }}
      >
        <UniqueHeader
          onClickBack={() => navigate(ROUTER.USERS.MAIN)}
          headerTitle={t("common.find_user")}
          headerSubtitle={t("common.find_user_description")}
          isHeaderButtonDisabled={false}
        />

        {/* ── Search Bar ── */}
        <div className="px-4 pt-1 pb-3">
          <div className="relative flex items-center gap-2">
            <label htmlFor="user-search" className="sr-only">
              {t("common.search")}
            </label>
            <Input
              id="user-search"
              type="search"
              inputSize="large"
              icon={<Search size={16} />}
              title={t("common.search")}
              value={searchParams.search}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="block w-full ps-9 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body"
            />
            <Button
              type="button"
              onClick={handleSearch}
              title={t("common.search")}
              icon={<Search size={15} />}
              className="flex bg-(--btn-edit-bg)! text-(--btn-edit-text)! font-semibold lg:p-4 p-5 rounded-lg items-center justify-center transition-all hover:opacity-80 border-none"
              disabled={!checkEmptyString(searchParams.search)}
            />
          </div>
        </div>

        {/* ── Results ── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <ul className="space-y-0.5">
              {users.length > 0 ? (
                users.map((u) => (
                  <UserCard
                    key={u._id}
                    user={u}
                    onToggleFriend={handleToggleFriend}
                  />
                ))
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-3"
                  style={{ color: "var(--muted-color)" }}
                >
                  <Search
                    size={32}
                    strokeWidth={1.5}
                    style={{ opacity: 0.4 }}
                  />
                  <p className="text-sm font-medium">
                    {searchParams.search
                      ? t("common.no_results_found", {
                          query: searchParams.search,
                        })
                      : t("common.start_searching")}
                  </p>
                </div>
              )}
            </ul>
          )}
        </div>
      </section>
    </Fragment>
  );
};

export default AllUsers;
