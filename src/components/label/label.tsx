import { upperFirst } from "es-toolkit";
import { mergeClasses } from "minimal-shared/utils";
import type { SxProps, Theme } from "@mui/material/styles";

import { labelClasses } from "./classes";
import { LabelRoot, LabelIcon } from "./styles";
import type { ReactNode } from "react";

// ----------------------------------------------------------------------

interface LabelProps {
  sx?: SxProps<Theme>;
  endIcon?: ReactNode;
  children: ReactNode;
  startIcon?: ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "filled" | "outlined" | "soft";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error";
}

export function Label({
  sx,
  endIcon,
  children,
  startIcon,
  className,
  disabled,
  variant = "soft",
  color = "default",
  ...other
}: LabelProps) {
  return (
    <LabelRoot
      color={color}
      variant={variant}
      disabled={disabled}
      className={mergeClasses([labelClasses.root, className])}
      sx={sx}
      {...other}
    >
      {startIcon && (
        <LabelIcon className={labelClasses.icon}>{startIcon}</LabelIcon>
      )}

      {typeof children === "string" ? upperFirst(children) : children}

      {endIcon && (
        <LabelIcon className={labelClasses.icon}>{endIcon}</LabelIcon>
      )}
    </LabelRoot>
  );
}
