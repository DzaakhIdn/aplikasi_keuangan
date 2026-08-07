import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import type { LinkProps } from '@mui/material/Link';
import { styled } from '@mui/material/styles';

import { CONFIG } from '@/global-config';

import { logoClasses } from './classes';

export type LogoProps = Omit<LinkProps, 'href'> & {
  href?: string;
  disabled?: boolean;
  isSingle?: boolean;
};

export function Logo({
  sx,
  href = '/',
  disabled = false,
  isSingle = true,
  className,
  ...other
}: LogoProps) {
  return (
    <LogoRoot
      href={disabled ? undefined : href}
      aria-label={`${CONFIG.appName} home`}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          width: isSingle ? 48 : 112,
          height: isSingle ? 48 : 56,
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
      {...other}
    >
      <img src={`${CONFIG.assetsDir}/logo/logo.png`} alt={CONFIG.appName} />
    </LogoRoot>
  );
}

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  display: 'inline-flex',
  verticalAlign: 'middle',
  '& img': {
    width: '100%',
    height: '100%',
    display: 'block',
    objectFit: 'contain',
  },
}));
