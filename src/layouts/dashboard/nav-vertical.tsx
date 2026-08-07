import React from "react";
import { varAlpha, mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import type { Breakpoint, SxProps, Theme } from "@mui/material/styles";

import { Logo } from "@/components/logo";
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";
import { NavSectionMini } from "@/components/nav-section/mini";

import { layoutClasses } from "../core/classes";
import { NavToggleButton } from "./components/nav-toggle-button";

// ----------------------------------------------------------------------

interface NavVerticalProps {
  sx?: SxProps<Theme>;
  data?: any;
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  cssVars?: Record<string, string | number>;
  className?: string;
  isNavMini?: boolean;
  onToggleNav?: () => void;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  layoutQuery?: Breakpoint;
}

type OtherProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof NavVerticalProps
>;

export function NavVertical({
  sx,
  data,
  slots,
  cssVars,
  className,
  isNavMini,
  onToggleNav,
  checkPermissions,
  layoutQuery = "md",
  ...other
}: NavVerticalProps & OtherProps) {
  const renderNavVertical = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1, flexShrink: 0 }}>
          <Logo />
        </Box>
      )}

      <Box
        sx={{
          flex: "1 1 0",
          minHeight: 0,
          overflowY: "scroll",
          overflowX: "hidden",
          // Hide scrollbar by default, show on hover
          "&::-webkit-scrollbar": { width: 5, backgroundColor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 3,
            backgroundColor: "transparent",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(145,158,171,0.32)",
          },
          "&:hover::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(145,158,171,0.56)",
          },
          // Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "transparent transparent",
          "&:hover": {
            scrollbarColor: "rgba(145,158,171,0.32) transparent",
          },
        }}
      >
        <NavSectionVertical
          data={data || []}
          cssVars={cssVars}
          checkPermissions={checkPermissions}
          sx={{ px: 2, flex: "1 1 auto" }}
        />

        {slots?.bottomArea}
      </Box>
    </>
  );

  const renderNavMini = () => (
    <>
      {slots?.topArea ?? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2.5 }}>
          <Logo />
        </Box>
      )}

      <NavSectionMini
        data={data || []}
        cssVars={cssVars}
        checkPermissions={checkPermissions}
        sx={[
          (theme) => ({
            ...theme.mixins.hideScrollY,
            pb: 2,
            px: 0.5,
            flex: "1 1 auto",
            overflowY: "auto",
          }),
        ]}
      />

      {slots?.bottomArea}
    </>
  );

  return (
    <NavRoot
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      className={mergeClasses([
        layoutClasses.nav.root,
        layoutClasses.nav.vertical,
        className,
      ])}
      sx={sx}
      {...other}
    >
      <NavToggleButton
        isNavMini={isNavMini}
        onClick={onToggleNav}
        sx={[
          (theme) => ({
            display: "none",
            [theme.breakpoints.up(layoutQuery)]: { display: "inline-flex" },
          }),
        ]}
      />
      {isNavMini ? renderNavMini() : renderNavVertical()}
    </NavRoot>
  );
}

// ----------------------------------------------------------------------

interface NavRootProps {
  isNavMini?: boolean;
  layoutQuery?: Breakpoint;
}

const NavRoot = styled("div", {
  shouldForwardProp: (prop: string) =>
    !["isNavMini", "layoutQuery", "sx"].includes(prop),
})<NavRootProps>(({ isNavMini, layoutQuery = "md", theme }) => ({
  top: 0,
  left: 0,
  height: "100vh",
  display: "none",
  position: "fixed",
  flexDirection: "column",
  overflow: "hidden",
  zIndex: "var(--layout-nav-zIndex)",
  backgroundColor: "var(--layout-nav-bg)",
  width: isNavMini
    ? "var(--layout-nav-mini-width)"
    : "var(--layout-nav-vertical-width)",
  borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
    theme.vars.palette.grey["500Channel"],
    0.12,
  )})`,
  transition: theme.transitions.create(["width"], {
    easing: "var(--layout-transition-easing)",
    duration: "var(--layout-transition-duration)",
  }),
  [theme.breakpoints.up(layoutQuery)]: { display: "flex" },
}));
