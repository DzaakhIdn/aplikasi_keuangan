import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';

import { createClasses } from '@/theme/create-classes';

// ----------------------------------------------------------------------

export type AuthCenteredContentProps = BoxProps;

const contentClassName = createClasses('layout__main__content');

export function AuthCenteredContent({
  sx,
  children,
  className,
  ...other
}: AuthCenteredContentProps) {
  return (
    <Box
      className={[contentClassName, className].filter(Boolean).join(' ')}
      sx={[
        (theme) => ({
          py: 5,
          px: 3,
          width: 1,
          zIndex: 2,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          bgcolor: theme.vars.palette.background.default,
        }),
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
      {...other}
    >
      {children}
    </Box>
  );
}
