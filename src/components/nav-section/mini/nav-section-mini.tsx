import { mergeClasses } from 'minimal-shared/utils';

import { useTheme } from '@mui/material/styles';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';
import type { NavCssVars, NavItem, NavRenderMap, NavSectionProps, NavSectionSlotProps, CheckPermissions } from '../types';

// ----------------------------------------------------------------------

export function NavSectionMini({
  sx,
  data,
  render,
  className,
  slotProps,
  checkPermissions,
  enabledRootRedirect,
  cssVars: overridesVars,
  ...other
}: NavSectionProps) {
  const theme = useTheme();

  const cssVars = { ...navSectionCssVars.mini(theme), ...overridesVars };

  return (
    <Nav
      className={mergeClasses([navSectionClasses.mini, className])}
      sx={[{ ...cssVars }, ...(sx ? (Array.isArray(sx) ? sx : [sx]) : [])]}
      {...other}
    >
      <NavUl sx={{ flex: '1 1 auto', gap: 'var(--nav-item-gap)' }}>
        {data.filter((group) => group.items.length > 0).map((group, index) => (
          <Group
            key={group.subheader ?? group.items[0]?.title ?? index}
            render={render}
            cssVars={cssVars}
            items={group.items}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </Nav>
  );
}

// ----------------------------------------------------------------------

type GroupProps = {
  items: readonly NavItem[];
  render?: NavRenderMap;
  cssVars: NavCssVars;
  slotProps?: NavSectionSlotProps;
  checkPermissions?: CheckPermissions;
  enabledRootRedirect?: boolean;
};

function Group({ items, render, cssVars, slotProps, checkPermissions, enabledRootRedirect }: GroupProps) {
  const visibleItems = items.filter(
    (item) => !item.allowedRoles || !checkPermissions || checkPermissions(item.allowedRoles)
  );

  if (visibleItems.length === 0) return null;

  return (
    <NavLi>
      <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
        {visibleItems.map((list) => (
          <NavList
            key={list.title}
            depth={1}
            data={list}
            render={render}
            cssVars={cssVars}
            slotProps={slotProps}
            checkPermissions={checkPermissions}
            enabledRootRedirect={enabledRootRedirect}
          />
        ))}
      </NavUl>
    </NavLi>
  );
}
