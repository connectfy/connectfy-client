import { useTransition, useCallback } from "react";
import { useNavigate, NavigateOptions, To } from "react-router-dom";

export const useAppNavigation = () => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const smartNavigate = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      startTransition(() => {
        if (typeof to === "number") {
          navigate(to);
        } else {
          navigate(to, options);
        }
      });
    },
    [navigate],
  );

  return {
    navigate: smartNavigate,
    isPending,
  };
};
