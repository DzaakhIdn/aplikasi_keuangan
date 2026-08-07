/* eslint-disable @typescript-eslint/no-explicit-any */

import { merge } from "es-toolkit";
import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme, Breakpoint } from "@mui/material/styles";
import { iconButtonClasses } from "@mui/material/IconButton";

import type { ReactNode } from "react";

import { useSettingsContext } from "@/components/settings";
import { useAuth } from "@/auth/context/auth-context";

import { NavMobile } from "./nav-mobile";
// import { VerticalDivider } from "./content";
import { NavVertical } from "./nav-vertical";
import { layoutClasses } from "../core/classes";
// import { NavHorizontal } from './nav-horizontal';
import { _account } from "./conf/nav-config-account";
import { MainSection } from "../core/main-section";
import { MenuButton } from "@/components/menu-button";
import { HeaderSection } from "../core/header-section";
import { LayoutSection } from "../core/layout-section";
import { AccountDrawer } from "@/components/account-drawer";
import { navData as dashboardNavData } from "./conf/nav-config-dashboard";
import { dashboardLayoutVars, dashboardNavColorVars } from "./css-vars";

// ------------------------------------------------------
// Type Definitions
// ------------------------------------------------------

interface NavItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  roles?: string[];
  allowedRoles?: string[];
  caption?: string;
}

interface NavSection {
  subheader: string;
  items: NavItem[];
}

interface DashboardLayoutProps {
  sx?: SxProps<Theme>;
  cssVars?: Record<string, string | number>;
  children?: ReactNode;
  slotProps?: {
    header?: Partial<React.ComponentProps<typeof HeaderSection>>;
    main?: Partial<React.ComponentProps<typeof MainSection>>;
    nav?: {
      data?: NavItem[] | NavSection[];
    };
  };
  layoutQuery?: Breakpoint;
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function isNavSectionArray(
  arr: NavItem[] | NavSection[] | undefined,
): arr is NavSection[] {
  if (!arr || arr.length === 0) return false;
  // elemen pertama punya "items" -> NavSection
  return (arr as any[])[0] && "items" in (arr as any[])[0];
}

function toNavItems(data: NavItem[] | NavSection[] | undefined): NavItem[] {
  if (!data || data.length === 0) return [];
  return isNavSectionArray(data) ? data.flatMap((s) => s.items) : data;
}

// ------------------------------------------------------

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "lg",
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const settings = useSettingsContext();

  const navVars = dashboardNavColorVars(
    theme,
    settings.state.navColor,
    settings.state.navLayout,
  );

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  // biarkan dashboardNavData bertipe campuran juga
  const rawNavData: NavItem[] | NavSection[] =
    (slotProps?.nav?.data as NavItem[] | NavSection[] | undefined) ??
    (dashboardNavData as any);

  // FLATTEN KE NavItem[] untuk horizontal nav (jika diperlukan)
  const navItems: NavItem[] = toNavItems(rawNavData);

  // Untuk vertical nav, gunakan format NavSection[]
  const navSections: NavSection[] = isNavSectionArray(rawNavData)
    ? rawNavData
    : [{ subheader: "", items: rawNavData }];

  const isNavMini = settings.state.navLayout === "mini";
  const isNavHorizontal = settings.state.navLayout === "horizontal";
  const isNavVertical = isNavMini || settings.state.navLayout === "vertical";

  const canDisplayItemByRole = (allowedRoles?: string[]) =>
    !allowedRoles?.includes(user?.role ?? "");

  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false as const,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: "var(--layout-nav-bg)",
            height: { [layoutQuery]: "var(--layout-nav-horizontal-height)" },
            [`& .${iconButtonClasses.root}`]: {
              color: "var(--layout-nav-text-secondary-color)",
            },
          }),
        },
      },
    };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          <MenuButton
            onClick={onOpen}
            sx={{
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: "none" },
            }}
          />
          <NavMobile
            data={rawNavData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
            checkPermissions={canDisplayItemByRole}
          />
        </>
      ),
      rightArea: (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0, sm: 0.75 },
          }}
        >
          <AccountDrawer data={_account} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navSections}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      checkPermissions={canDisplayItemByRole}
      onToggleNav={() =>
        settings.setField(
          "navLayout",
          settings.state.navLayout === "vertical" ? "mini" : "vertical",
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
  );

  const rootSx: SxProps<Theme> = [
    {
      [`& .${layoutClasses.sidebarContainer}`]: {
        [theme.breakpoints.up(layoutQuery)]: {
          pl: isNavMini
            ? "var(--layout-nav-mini-width)"
            : "var(--layout-nav-vertical-width)",
          transition: theme.transitions.create(["padding-left"], {
            easing: "var(--layout-transition-easing)",
            duration: "var(--layout-transition-duration)",
          }),
        },
      },
    },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
  ] as SxProps<Theme>;

  return (
    <LayoutSection
      headerSection={renderHeader()}
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      footerSection={renderFooter()}
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={rootSx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
