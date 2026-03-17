import { useTransition } from "react";
import { useNavigate, NavigateOptions, To } from "react-router-dom";

export const useAppNavigation = () => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const smartNavigate = (to: To | number, options?: NavigateOptions) => {
    startTransition(() => {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, options);
      }
    });
  };

  return {
    navigate: smartNavigate,
    isPending,
  };
};
