import { FC, Fragment, memo, ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

const AuthLayout: FC<Props> = ({ children }) => {
  return <Fragment>{children || <Outlet />}</Fragment>;
};

export default memo(AuthLayout);
