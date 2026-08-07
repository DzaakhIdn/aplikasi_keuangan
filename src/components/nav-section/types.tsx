import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import type { ButtonBaseProps } from '@mui/material/ButtonBase';
import type { SxProps, Theme } from '@mui/material/styles';

export type NavCssVars = Partial<Record<`--${string}`, string | number>>;
export type CheckPermissions = (allowedRoles?: readonly string[]) => boolean;

export type NavInfo = readonly [key: string, value: ReactNode];

export type NavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  info?: ReactNode | NavInfo;
  caption?: string;
  disabled?: boolean;
  allowedRoles?: readonly string[];
  children?: readonly NavItem[];
};

export type NavGroup = {
  subheader?: string;
  items: readonly NavItem[];
};

export type NavData = readonly NavGroup[];

export type NavRenderMap = {
  navIcon?: Readonly<Record<string, ReactNode>>;
  navInfo?: (value: ReactNode) => Readonly<Record<string, ReactElement>>;
};

export type NavItemSlotProps = {
  sx?: SxProps<Theme>;
  icon?: SxProps<Theme>;
  info?: SxProps<Theme>;
  texts?: SxProps<Theme>;
  title?: SxProps<Theme>;
  arrow?: SxProps<Theme>;
  caption?: SxProps<Theme>;
};

export type NavSectionSlotProps = {
  rootItem?: NavItemSlotProps;
  subItem?: NavItemSlotProps;
  subheader?: SxProps<Theme>;
  dropdown?: { paper?: SxProps<Theme> };
};

export type NavSectionProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  data: NavData;
  sx?: SxProps<Theme>;
  render?: NavRenderMap;
  slotProps?: NavSectionSlotProps;
  checkPermissions?: CheckPermissions;
  enabledRootRedirect?: boolean;
  cssVars?: NavCssVars;
};

export type NavListProps = {
  data: NavItem;
  depth: number;
  render?: NavRenderMap;
  cssVars?: NavCssVars;
  slotProps?: NavSectionSlotProps;
  checkPermissions?: CheckPermissions;
  enabledRootRedirect?: boolean;
};

export type NavItemComponentProps = Omit<ButtonBaseProps, 'children' | 'title' | 'ref'> & {
  ref?: Ref<HTMLElement>;
  path?: string;
  icon?: ReactNode;
  info?: ReactNode | NavInfo;
  title: string;
  caption?: string;
  open: boolean;
  active: boolean;
  depth: number;
  render?: NavRenderMap;
  hasChild: boolean;
  slotProps?: NavItemSlotProps;
  externalLink: boolean;
  enabledRootRedirect?: boolean;
};

export type NavItemOwnerState = {
  open: boolean;
  active: boolean;
  disabled?: boolean;
  variant: 'rootItem' | 'subItem';
};

export function checkPermissions(
  allowedRoles?: readonly string[],
  currentRole?: string | null
): boolean {
  return !allowedRoles?.length || (currentRole != null && allowedRoles.includes(currentRole));
}
