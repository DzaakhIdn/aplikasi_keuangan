import type { CSSObject } from '@mui/system';
import type { Components, Theme } from '@mui/material/styles';

type PaletteEntry = Record<string | number, string>;
type VarsPalette = NonNullable<Theme['vars']>['palette'];
type ExtendedPaletteColor = VarsPalette['primary'] & {
  darker: string;
  lighter: string;
};
type ExtendedVarsPalette = Omit<
  VarsPalette,
  | 'background'
  | 'common'
  | 'error'
  | 'grey'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'text'
  | 'warning'
> &
  Record<string, PaletteEntry> & {
    background: VarsPalette['background'] & { neutral: string };
    common: VarsPalette['common'] & { blackChannel: string; whiteChannel: string };
    error: ExtendedPaletteColor;
    grey: VarsPalette['grey'] & PaletteEntry;
    info: ExtendedPaletteColor;
    primary: ExtendedPaletteColor;
    secondary: ExtendedPaletteColor;
    success: ExtendedPaletteColor;
    text: VarsPalette['text'] & { disabledChannel: string; primaryChannel: string };
    warning: ExtendedPaletteColor;
  };

export type ComponentTheme = Theme & {
  shape: Theme['shape'] & { borderRadius: number };
  vars: NonNullable<Theme['vars']> & {
    customShadows: Record<string, string>;
    palette: ExtendedVarsPalette;
  };
  mixins: Theme['mixins'] & {
    menuItemStyles: (theme: ComponentTheme) => CSSObject;
    paperStyles: (theme: ComponentTheme, options?: { dropdown?: boolean }) => CSSObject;
  };
  typography: Theme['typography'] & {
    fontWeightMedium: number;
    fontWeightSemiBold: number;
  };
};

export type ComponentOwnerState = Record<string, unknown> & {
  alt?: string;
  color?: string;
  disabled?: boolean;
  fullScreen?: boolean;
  severity?: string;
  variant?: string;
};

export type StyleParams = {
  ownerState: ComponentOwnerState;
  style?: { left?: string | number };
  theme: ComponentTheme;
};

type StyleResult = CSSObject | Record<string, unknown>;
type StyleOverride = CSSObject | ((params: StyleParams) => StyleResult);

export type ComponentConfig = {
  defaultProps?: Record<string, unknown>;
  styleOverrides?: Record<string, StyleOverride>;
};

export type ComponentConfigMap = Record<string, ComponentConfig>;
export type MaterialComponentConfigMap = Partial<Components<ComponentTheme>>;
