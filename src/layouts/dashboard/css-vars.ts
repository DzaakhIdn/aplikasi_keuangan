/* eslint-disable @typescript-eslint/no-explicit-any */
import { varAlpha } from "minimal-shared/utils";

import { bulletColor } from "@/components/nav-section";
import type { Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

export function dashboardLayoutVars(theme: any) {
  return {
    "--layout-transition-easing": "linear",
    "--layout-transition-duration": "120ms",
    "--layout-nav-mini-width": "88px",
    "--layout-nav-vertical-width": "300px",
    "--layout-nav-horizontal-height": "64px",
    "--layout-dashboard-content-pt": theme.spacing(1),
    "--layout-dashboard-content-pb": theme.spacing(8),
    "--layout-dashboard-content-px": theme.spacing(5),
  };
}

// ----------------------------------------------------------------------

export function dashboardNavColorVars(
  theme: Theme,
  navColor = "integrate",
  navLayout = "vertical",
): {
  layout: Record<string, string | number>;
  section: Record<string, string | number> | undefined;
} {
  const {
    vars: { palette },
  } = theme;

  // Helper function to extract only CSS custom properties from theme.applyStyles
  const extractCssVars = (styles: any): Record<string, string | number> => {
    const result: Record<string, string | number> = {};
    if (styles && typeof styles === "object") {
      Object.keys(styles).forEach((key) => {
        if (
          key.startsWith("--") &&
          (typeof styles[key] === "string" || typeof styles[key] === "number")
        ) {
          result[key] = styles[key];
        }
      });
    }
    return result;
  };

  switch (navColor) {
    case "integrate": {
      const darkStyles = theme.applyStyles("dark", {
        "--layout-nav-border-color": varAlpha(palette.grey["500Channel"], 0.08),
        "--layout-nav-horizontal-bg": varAlpha(
          palette.background.defaultChannel,
          0.96,
        ),
      });

      return {
        layout: {
          "--layout-nav-bg": palette.background.default,
          "--layout-nav-horizontal-bg": varAlpha(
            palette.background.defaultChannel,
            0.8,
          ),
          "--layout-nav-border-color": varAlpha(
            palette.grey["500Channel"],
            0.12,
          ),
          "--layout-nav-text-primary-color": palette.text.primary,
          "--layout-nav-text-secondary-color": palette.text.secondary,
          "--layout-nav-text-disabled-color": palette.text.disabled,
          ...extractCssVars(darkStyles),
        },
        section: undefined,
      };
    }
    case "apparent": {
      const darkStyles = theme.applyStyles("dark", {
        "--layout-nav-bg": palette.grey[800],
        "--layout-nav-horizontal-bg": varAlpha(palette.grey["800Channel"], 0.8),
      });

      return {
        layout: {
          "--layout-nav-bg": palette.grey[900],
          "--layout-nav-horizontal-bg": varAlpha(
            palette.grey["900Channel"],
            0.96,
          ),
          "--layout-nav-border-color": "transparent",
          "--layout-nav-text-primary-color": palette.common.white,
          "--layout-nav-text-secondary-color": palette.grey[500],
          "--layout-nav-text-disabled-color": palette.grey[600],
          ...extractCssVars(darkStyles),
        },
        section: {
          // caption
          "--nav-item-caption-color": palette.grey[600],
          // subheader
          "--nav-subheader-color": palette.grey[600],
          "--nav-subheader-hover-color": palette.common.white,
          // item
          "--nav-item-color": palette.grey[500],
          "--nav-item-root-active-color": palette.primary.light,
          "--nav-item-root-open-color": palette.common.white,
          // bullet
          "--nav-bullet-light-color": bulletColor.dark,
          // sub
          ...(navLayout === "vertical" && {
            "--nav-item-sub-active-color": palette.common.white,
            "--nav-item-sub-open-color": palette.common.white,
          }),
        },
      };
    }
    default:
      throw new Error(`Invalid color: ${navColor}`);
  }
}
