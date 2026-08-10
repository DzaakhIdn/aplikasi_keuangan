import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { SxProps, Theme } from "@mui/material/styles";

import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";
import GlobalStyles from "@mui/material/GlobalStyles";

import { layoutClasses } from "./classes";
import { layoutSectionVars } from "./css-vars";

// ----------------------------------------------------------------------

export type LayoutSectionCssVars = Partial<
  Record<`--${string}`, string | number>
>;

export type LayoutSectionProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  children?: ReactNode;
  cssVars?: LayoutSectionCssVars;
  footerSection?: ReactNode;
  headerSection?: ReactNode;
  sidebarSection?: ReactNode;
  sx?: SxProps<Theme>;
};

export function LayoutSection({
  sx,
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
  className,
  ...other
}: LayoutSectionProps) {
  const inputGlobalStyles = (
    <GlobalStyles
      styles={(theme) => ({
        body: { ...layoutSectionVars(theme), ...cssVars },
      })}
    />
  );

  return (
    <>
      {inputGlobalStyles}

      <LayoutRoot
        id="root__layout"
        className={mergeClasses([layoutClasses.root, className])}
        sx={sx}
        {...other}
      >
        {sidebarSection ? (
          <>
            {sidebarSection}
            <LayoutSidebarContainer className={layoutClasses.sidebarContainer}>
              {headerSection}
              {children}
              {footerSection}
            </LayoutSidebarContainer>
          </>
        ) : (
          <>
            {headerSection}
            {children}
            {footerSection}
          </>
        )}
      </LayoutRoot>
    </>
  );
}

// ----------------------------------------------------------------------

const LayoutRoot = styled("div")({
  display: "flex",
  width: "100%",
  minWidth: 0,
  minHeight: "100vh",
  flexDirection: "row",
  overflowX: "hidden",
});

const LayoutSidebarContainer = styled("div")(() => ({
  display: "flex",
  flex: "1 1 auto",
  minWidth: 0,
  width: "100%",
  flexDirection: "column",
}));
