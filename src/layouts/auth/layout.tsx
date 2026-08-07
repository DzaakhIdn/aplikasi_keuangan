import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { AppBarProps } from '@mui/material/AppBar';
import type { ContainerProps } from '@mui/material/Container';
import type { Breakpoint, CSSObject, Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';

import { CONFIG } from '@/global-config';
import { createClasses } from '@/theme/create-classes';
import { Logo } from '@/components/logo';

import { AuthCenteredContent } from './content';
import type { AuthCenteredContentProps } from './content';

// ----------------------------------------------------------------------

type HeaderSlots = {
  topArea?: ReactNode;
  leftArea?: ReactNode;
  centerArea?: ReactNode;
  rightArea?: ReactNode;
  bottomArea?: ReactNode;
};

type HeaderSlotProps = {
  container?: ContainerProps;
  centerArea?: BoxProps;
};

type AuthHeaderProps = Omit<AppBarProps, 'children' | 'slots' | 'slotProps'> & {
  slots?: HeaderSlots;
  slotProps?: HeaderSlotProps;
};

type AuthLayoutSlotProps = {
  header?: AuthHeaderProps;
  main?: BoxProps;
  content?: AuthCenteredContentProps;
};

type LayoutCssVars = Partial<Record<`--${string}`, string | number>>;

export type AuthCenteredLayoutProps = Omit<BoxProps, 'children'> & {
  children?: ReactNode;
  cssVars?: LayoutCssVars;
  layoutQuery?: Breakpoint;
  slotProps?: AuthLayoutSlotProps;
};

const layoutClasses = {
  root: createClasses('layout__root'),
  main: createClasses('layout__main'),
  header: createClasses('layout__header'),
};

const layoutCssVars = (theme: Theme): LayoutCssVars => ({
  '--layout-header-zIndex': theme.zIndex.appBar + 1,
  '--layout-header-mobile-height': '64px',
  '--layout-header-desktop-height': '72px',
});

export function AuthCenteredLayout({
  sx,
  cssVars,
  children,
  slotProps,
  className,
  layoutQuery = 'md',
  ...other
}: AuthCenteredLayoutProps) {
  const {
    slots: customHeaderSlots,
    slotProps: customHeaderSlotProps,
    sx: headerSx,
    className: headerClassName,
    ...headerProps
  } = slotProps?.header ?? {};

  const headerSlots: HeaderSlots = {
    topArea: (
      <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
        This is an info Alert.
      </Alert>
    ),
    leftArea: <Logo />,
    rightArea: (
      <Link href="/faqs" color="inherit" sx={{ typography: 'subtitle2' }}>
        Need help?
      </Link>
    ),
    ...customHeaderSlots,
  };

  const { sx: mainSx, className: mainClassName, ...mainProps } = slotProps?.main ?? {};

  return (
    <Box
      id="root__layout"
      className={[layoutClasses.root, className].filter(Boolean).join(' ')}
      sx={[
        (theme) => ({
          ...layoutCssVars(theme),
          '--layout-auth-content-width': '420px',
          ...cssVars,
          minHeight: '100vh',
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          '&::before': backgroundStyles(theme),
        }),
        ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
      ]}
      {...other}
    >
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        className={[layoutClasses.header, headerClassName].filter(Boolean).join(' ')}
        {...headerProps}
        sx={[
          (theme) => ({
            zIndex: 'var(--layout-header-zIndex)',
            [theme.breakpoints.up(layoutQuery)]: { position: 'fixed' },
          }),
          ...(headerSx ? (Array.isArray(headerSx) ? headerSx : [headerSx]) : []),
        ]}
      >
        {headerSlots.topArea}

        <Container
          maxWidth={false}
          {...customHeaderSlotProps?.container}
          sx={[
            (theme) => ({
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color)',
              height: 'var(--layout-header-mobile-height)',
              [theme.breakpoints.up(layoutQuery)]: {
                height: 'var(--layout-header-desktop-height)',
              },
            }),
            ...(customHeaderSlotProps?.container?.sx
              ? Array.isArray(customHeaderSlotProps.container.sx)
                ? customHeaderSlotProps.container.sx
                : [customHeaderSlotProps.container.sx]
              : []),
          ]}
        >
          {headerSlots.leftArea}

          <Box
            {...customHeaderSlotProps?.centerArea}
            sx={[
              { display: 'flex', flex: '1 1 auto', justifyContent: 'center' },
              ...(customHeaderSlotProps?.centerArea?.sx
                ? Array.isArray(customHeaderSlotProps.centerArea.sx)
                  ? customHeaderSlotProps.centerArea.sx
                  : [customHeaderSlotProps.centerArea.sx]
                : []),
            ]}
          >
            {headerSlots.centerArea}
          </Box>

          {headerSlots.rightArea}
        </Container>

        {headerSlots.bottomArea}
      </AppBar>

      <Box
        component="main"
        className={[layoutClasses.main, mainClassName].filter(Boolean).join(' ')}
        {...mainProps}
        sx={[
          (theme) => ({
            p: theme.spacing(3, 2, 10, 2),
            display: 'flex',
            flex: '1 1 auto',
            alignItems: 'center',
            flexDirection: 'column',
            [theme.breakpoints.up(layoutQuery)]: {
              justifyContent: 'center',
              p: theme.spacing(10, 0, 10, 0),
            },
          }),
          ...(mainSx ? (Array.isArray(mainSx) ? mainSx : [mainSx]) : []),
        ]}
      >
        <AuthCenteredContent {...slotProps?.content}>{children}</AuthCenteredContent>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (theme: Theme): CSSObject => ({
  ...theme.mixins.bgGradient({
    images: [`url(${CONFIG.assetsDir}/assets/background/background-3-blur.webp)`],
  }),
  zIndex: 1,
  opacity: 0.24,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  ...theme.applyStyles('dark', {
    opacity: 0.08,
  }),
});
