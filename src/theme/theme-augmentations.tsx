import type { CSSObject } from '@mui/material/styles';
import type { CSSProperties } from 'react';

import type { BgBlurProps, BgGradientProps } from './core/mixins/background';
import type { BorderGradientProps } from './core/mixins/border';
import type { PaperStylesOptions } from './core/mixins/global-styles-components';
import type { MaxLineProps } from './core/mixins/text';
import type { CustomShadows } from './core/custom-shadows';

declare module '@mui/material/styles' {
  interface CssThemeVariables {
    enabled: true;
  }

  interface PaletteColor {
    lighter: string;
    darker: string;
    lighterChannel: string;
    lightChannel: string;
    mainChannel: string;
    darkChannel: string;
    darkerChannel: string;
    contrastTextChannel: string;
  }

  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    lighterChannel?: string;
    lightChannel?: string;
    mainChannel?: string;
    darkChannel?: string;
    darkerChannel?: string;
    contrastTextChannel?: string;
  }

  interface CommonColors {
    blackChannel: string;
    whiteChannel: string;
  }

  interface Color {
    '50Channel': string;
    '100Channel': string;
    '200Channel': string;
    '300Channel': string;
    '400Channel': string;
    '500Channel': string;
    '600Channel': string;
    '700Channel': string;
    '800Channel': string;
    '900Channel': string;
  }

  interface TypeText {
    primaryChannel: string;
    secondaryChannel: string;
    disabledChannel: string;
  }

  interface TypeBackground {
    neutral: string;
    defaultChannel: string;
    paperChannel: string;
    neutralChannel: string;
  }

  interface TypographyVariants {
    fontSecondaryFamily: CSSProperties['fontFamily'];
    fontWeightSemiBold: CSSProperties['fontWeight'];
  }

  interface TypographyVariantsOptions {
    fontSecondaryFamily?: CSSProperties['fontFamily'];
    fontWeightSemiBold?: CSSProperties['fontWeight'];
  }

  interface Mixins {
    hideScrollX: CSSObject;
    hideScrollY: CSSObject;
    borderGradient: (props?: BorderGradientProps) => CSSObject;
    bgGradient: (props: BgGradientProps) => CSSObject;
    bgBlur: (props: BgBlurProps) => CSSObject;
    textGradient: (color: string) => CSSObject;
    paperStyles: (
      theme: import('@mui/material/styles').Theme,
      options?: PaperStylesOptions
    ) => CSSObject;
    menuItemStyles: (theme: import('@mui/material/styles').Theme) => CSSObject;
    maxLine: (props: MaxLineProps) => CSSObject;
  }

  interface ColorSystemOptions {
    customShadows?: Partial<CustomShadows>;
  }

  interface ColorSystem {
    customShadows: CustomShadows;
  }

  interface ThemeVars {
    customShadows: CustomShadows;
  }

  interface Theme {
    customShadows: CustomShadows;
  }

  interface ThemeOptions {
    customShadows?: Partial<CustomShadows>;
  }
}

export {};
