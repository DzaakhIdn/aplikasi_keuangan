import { createTheme as createMuiTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

import { mixins } from '@/theme/core/mixins';
import { shadows } from '@/theme/core/shadows';
import { palette } from '@/theme/core/palette';
import { components } from '@/theme/core/components';
import { typography } from '@/theme/core/typography';
import { customShadows } from '@/theme/core/custom-shadows';
import { themeConfig } from '@/theme/theme-config';
import {
  updateCoreWithSettings,
  updateComponentsWithSettings,
  type CoreThemeOptions,
  type ThemeSettings,
} from '@/theme/with-settings';

export type ThemeMergeOptions = Record<string, unknown>;

export interface CreateThemeOptions {
  settingsState?: ThemeSettings;
  themeOverrides?: ThemeMergeOptions;
  localeComponents?: ThemeMergeOptions;
}

// ----------------------------------------------------------------------

export const baseTheme: CoreThemeOptions = {
  colorSchemes: {
    light: {
      palette: palette.light,
      shadows: shadows.light,
      customShadows: customShadows.light,
    },
    dark: {
      palette: palette.dark,
      shadows: shadows.dark,
      customShadows: customShadows.dark,
    },
  },
  mixins,
  components,
  typography,
  shape: { borderRadius: 8 },
  direction: themeConfig.direction,
  cssVariables: themeConfig.cssVariables,
  defaultColorScheme: themeConfig.defaultMode,
};

// ----------------------------------------------------------------------

export function createTheme({
  settingsState,
  themeOverrides = {},
  localeComponents = {},
}: CreateThemeOptions = {}) {
  const updatedCore = settingsState ? updateCoreWithSettings(baseTheme, settingsState) : baseTheme;
  const updatedComponents = settingsState
    ? updateComponentsWithSettings(components, settingsState)
    : {};

  return createMuiTheme(
    updatedCore as ThemeOptions,
    updatedComponents,
    localeComponents,
    themeOverrides
  );
}
