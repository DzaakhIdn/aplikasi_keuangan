import { setFont, hexToRgbChannel, createPaletteChannel } from 'minimal-shared/utils';

import { createShadowColor } from '@/theme/core/custom-shadows';
import type { ThemeDirection } from '@/theme/theme-config';
import {
  primaryColorPresets,
  type ColorPresetName,
} from '@/theme/with-settings/color-presets';

export interface ThemeSettings {
  direction?: ThemeDirection;
  fontFamily?: string;
  fontSize?: number | string;
  contrast?: 'default' | 'hight';
  primaryColor?: ColorPresetName;
}

interface CorePalette {
  background?: Record<string, string>;
  grey: Record<number, string>;
  [key: string]: unknown;
}

interface CoreColorScheme {
  palette: CorePalette;
  customShadows?: Record<string, string>;
  [key: string]: unknown;
}

export interface CoreThemeOptions {
  colorSchemes: {
    light: CoreColorScheme;
    dark: CoreColorScheme;
  };
  typography: Record<string, unknown>;
  direction?: ThemeDirection;
  [key: string]: unknown;
}

// ----------------------------------------------------------------------

export function updateCoreWithSettings(
  theme: CoreThemeOptions,
  settingsState: ThemeSettings
): CoreThemeOptions {
  const {
    direction,
    fontFamily,
    contrast = 'default',
    primaryColor = 'default',
  } = settingsState;

  const isDefaultContrast = contrast === 'default';
  const isDefaultPrimaryColor = primaryColor === 'default';
  const lightPalette = theme.colorSchemes.light.palette;
  const updatedPrimaryColor = createPaletteChannel(primaryColorPresets[primaryColor]);

  const updateColorScheme = (scheme: 'light' | 'dark'): CoreColorScheme => {
    const colorScheme = theme.colorSchemes[scheme];

    const updatedPalette = {
      ...colorScheme.palette,
      ...(!isDefaultPrimaryColor && { primary: updatedPrimaryColor }),
      ...(scheme === 'light' && {
        background: {
          ...lightPalette.background,
          ...(!isDefaultContrast && {
            default: lightPalette.grey[200],
            defaultChannel: hexToRgbChannel(lightPalette.grey[200]),
          }),
        },
      }),
    };

    const updatedCustomShadows = {
      ...colorScheme.customShadows,
      ...(!isDefaultPrimaryColor && {
        primary: createShadowColor(updatedPrimaryColor.mainChannel),
      }),
    };

    return {
      ...colorScheme,
      palette: updatedPalette,
      customShadows: updatedCustomShadows,
    };
  };

  return {
    ...theme,
    direction,
    colorSchemes: {
      light: updateColorScheme('light'),
      dark: updateColorScheme('dark'),
    },
    typography: {
      ...theme.typography,
      fontFamily: setFont(fontFamily),
    },
  };
}
