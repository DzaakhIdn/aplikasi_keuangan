import { cloneElement, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import type { NavInfo, NavRenderMap } from '../types';

// ----------------------------------------------------------------------

type CreateNavItemOptions = {
  path?: string;
  icon?: ReactNode;
  info?: ReactNode | NavInfo;
  depth: number;
  render?: NavRenderMap;
  hasChild: boolean;
  externalLink: boolean;
  enabledRootRedirect?: boolean;
};

function isNavInfo(info: ReactNode | NavInfo): info is NavInfo {
  return Array.isArray(info) && info.length === 2 && typeof info[0] === 'string';
}

export function createNavItem({
  path,
  icon,
  info,
  depth,
  render,
  hasChild,
  externalLink,
  enabledRootRedirect,
}: CreateNavItemOptions) {
  const rootItem = depth === 1;
  const subItem = !rootItem;
  const subDeepItem = Number(depth) > 2;

  const linkProps = !path
    ? { component: 'div' as const }
    : externalLink
      ? { component: 'a' as const, href: path, target: '_blank', rel: 'noopener' }
      : { component: Link, to: path };

  const baseProps = hasChild && !enabledRootRedirect ? { component: 'div' } : linkProps;

  /**
   * Render @icon
   */
  const renderIcon: ReactNode =
    icon && render?.navIcon && typeof icon === 'string' ? (render.navIcon[icon] ?? icon) : icon;

  /**
   * Render @info
   */
  const renderInfo: ReactNode = (() => {
    if (info && render?.navInfo && isNavInfo(info)) {
      const [key, value] = info;
      const element = render.navInfo(value)[key];
      return isValidElement(element) ? cloneElement(element) : null;
    }
    return info;
  })();

  return {
    subItem,
    rootItem,
    subDeepItem,
    baseProps,
    renderIcon,
    renderInfo,
  };
}
