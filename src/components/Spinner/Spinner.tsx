import { CircularProgress, CircularProgressProps } from "@mui/material";
import { FC } from "react";

interface Props extends CircularProgressProps {}

const Spinner: FC<Props> = ({
  size = 15,
  style = { color: "#fff" },
  ...props
}) => {
  return <CircularProgress {...props} size={size} style={style} />;
};

export default Spinner;
