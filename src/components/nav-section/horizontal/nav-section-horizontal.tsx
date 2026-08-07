import { mergeClasses } from 'minimal-shared/utils';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { NavList } from './nav-list';
import { Nav, NavUl, NavLi } from '../components';
import { navSectionClasses, navSectionCssVars } from '../styles';
import type { NavCssVars, NavItem, NavRenderMap, NavSectionProps, NavSectionSlotProps, CheckPermissions } from '../types';

// ----------------------------------------------------------------------

export function NavSectionHorizontal({
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

  const cssVars = { ...navSectionCssVars.horizontal(theme), ...overridesVars };

  return (
    <Box sx={{ height: 1, overflowX: 'auto', overflowY: 'hidden' }}>
      <Box sx={{ height: 1, display: 'flex', alignItems: 'center', width: 'max-content', minWidth: 1 }}>
      <Nav
        className={mergeClasses([navSectionClasses.horizontal, className])}
        sx={[
          () => ({
            ...cssVars,
            height: 1,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            minHeight: 'var(--nav-height)',
          }),
          ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ]}
        {...other}
      >
        <NavUl sx={{ flexDirection: 'row', gap: 'var(--nav-item-gap)' }}>
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
      </Box>
    </Box>
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
      <NavUl sx={{ flexDirection: 'row', gap: 'var(--nav-item-gap)' }}>
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
