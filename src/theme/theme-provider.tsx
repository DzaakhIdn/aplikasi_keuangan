import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';
import type { Theme, ThemeProviderProps as MuiThemeProviderProps } from '@mui/material/styles';

import {
  createTheme,
  type ThemeMergeOptions,
} from '@/theme/create-theme';
import { themeConfig } from '@/theme/theme-config';
import { Rtl, type ThemeSettings } from '@/theme/with-settings';

export interface ThemeProviderProps extends Omit<MuiThemeProviderProps<Theme>, 'theme'> {
  settings?: ThemeSettings;
  themeOverrides?: ThemeMergeOptions;
  localeComponents?: ThemeMergeOptions;
}

// ----------------------------------------------------------------------

export function ThemeProvider({
  settings,
  localeComponents,
  themeOverrides,
  children,
  ...other
}: ThemeProviderProps) {
  const theme = createTheme({
    settingsState: settings,
    localeComponents,
    themeOverrides,
  });

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={theme} {...other}>
      <CssBaseline />
      <Rtl direction={settings?.direction ?? themeConfig.direction}>{children}</Rtl>
    </ThemeVarsProvider>
  );
}
