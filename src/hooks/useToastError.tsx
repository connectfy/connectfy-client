// import { TFunction } from "i18next";
import { ApiErrorType } from "@/types/api.types";
import { useAppDispatch } from "./useStore";
import { useEffect } from "react";
import { snack } from "@/utils/snackManager";
// import { toast } from "react-toastify";

type UseToastErrorParams = {
  error: ApiErrorType;
  open?: boolean;
  clearErrorAction: () => any;
  //   t: TFunction;
  //   additionalData?:Record<string,any> | undefined
};

export const useToastError = ({
  error,
  open = true,
  clearErrorAction,
  // t,
}: UseToastErrorParams) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (open && error) {
      if (Array.isArray(error)) {
        error.forEach((err) => {
          snack.error(err);
        });
      } else {
        snack.error(error);
      }
      dispatch(clearErrorAction());
    }
  }, [error, open, dispatch, clearErrorAction]);
};
