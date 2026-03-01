import React from "react";
import clsx from "clsx";
import "./typography.css";

type Variant =
  | "display-lg"
  | "display-md"
  | "h1"
  | "h2"
  | "h3"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "caption";

type TypographyProps<T extends React.ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function Typography<T extends React.ElementType = "p">({
  as,
  variant = "body-md",
  className,
  children,
  ...rest
}: TypographyProps<T>) {
  const Component = as || "p";

  return (
    <Component
      className={clsx("typography", `typography--${variant}`, className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
