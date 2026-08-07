import { useEffect } from "react";
import type { JSX } from "react";
import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";

import { useLocation } from "react-router";

import { Logo } from "@/components/logo";
import { Scrollbar } from "@/components/scrollbar";
import { NavSectionVertical } from "@/components/nav-section";

import { layoutClasses } from "../core/classes";
import type { SxProps, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

// Helper function to check if data is NavSection array
function isNavSectionArray(
  arr: NavItem[] | NavSection[] | undefined,
): arr is NavSection[] {
  if (!arr || arr.length === 0) return false;
  return (arr as any[])[0] && "items" in (arr as any[])[0];
}

// Helper function to convert data to NavSection format
function toNavSectionData(
  data: NavItem[] | NavSection[] | undefined,
): NavSection[] {
  if (!data || data.length === 0) return [];
  if (isNavSectionArray(data)) return data;
  // If it's NavItem[], wrap it in a single section
  return [{ items: data }];
}

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
  subheader?: string;
  items: NavItem[];
}

interface NavMobileProps {
  sx?: SxProps<Theme>;
  data?: NavItem[] | NavSection[];
  open?: boolean;
  slots?: {
    topArea?: JSX.Element;
    bottomArea?: JSX.Element;
  };
  onClose?: () => void;
  className?: string;
  checkPermissions?: (roles: string[] | undefined) => boolean;
  cssVars?: Record<string, string | number>;
}

type OtherProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  keyof NavMobileProps
>;

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  className,
  checkPermissions,
  ...other
}: NavMobileProps & OtherProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (open && typeof onClose === "function") {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: mergeClasses([
            layoutClasses.nav.root,
            layoutClasses.nav.vertical,
            className,
          ]),
          sx: [
            {
              overflow: "unset",
              bgcolor: "var(--layout-nav-bg)",
              width: "var(--layout-nav-mobile-width)",
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {slots?.topArea ?? (
        <Box sx={{ pl: 3.5, pt: 2.5, pb: 1 }}>
          <Logo />
        </Box>
      )}

      <Scrollbar fillContent>
        <NavSectionVertical
          data={toNavSectionData(data)}
          checkPermissions={checkPermissions}
          sx={{ px: 0, flex: "1 1 auto" }}
          {...other}
        />
      </Scrollbar>

      {slots?.bottomArea}
    </Drawer>
  );
}
