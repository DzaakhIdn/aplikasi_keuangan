import Link from "@mui/material/Link";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

import { RouterLink } from "@/routes/components";
import { Iconify, iconifyClasses } from "../iconify";

// ----------------------------------------------------------------------

interface BackLinkProps {
  href: string;
  sx?: SxProps<Theme>;
  label?: ReactNode;
  [key: string]: unknown;
}

export function BackLink({ href, sx, label, ...other }: BackLinkProps) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      underline="none"
      sx={[
        (theme) => ({
          verticalAlign: "middle",
          [`& .${iconifyClasses.root}`]: {
            verticalAlign: "inherit",
            transform: "translateY(-2px)",
            ml: {
              xs: "-14px",
              md: "-18px",
            },
            transition: theme.transitions.create(["opacity"], {
              duration: theme.transitions.duration.shorter,
              easing: theme.transitions.easing.sharp,
            }),
          },
          "&:hover": {
            [`& .${iconifyClasses.root}`]: {
              opacity: 0.48,
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Iconify width={18} icon="eva:arrow-ios-back-fill" />
      {label}
    </Link>
  );
}
