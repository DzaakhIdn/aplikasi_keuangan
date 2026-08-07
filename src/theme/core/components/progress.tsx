import { varAlpha } from 'minimal-shared/utils';
import type { CSSObject } from '@mui/system';
import type { ComponentConfig, ComponentOwnerState } from './_types';

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;

// ----------------------------------------------------------------------

function styleColors(
  ownerState: ComponentOwnerState,
  styles: (color: (typeof COLORS)[number]) => CSSObject
) {
  const outputStyle = COLORS.reduce((acc, color) => {
    if (ownerState.color === color) {
      acc = styles(color);
    }
    return acc;
  }, {});

  return outputStyle;
}

const MuiLinearProgress: ComponentConfig = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    root: ({ theme, ownerState }) => {
      const styled = {
        colors: styleColors(ownerState, (color) => ({
          backgroundColor: varAlpha(theme.vars.palette[color].mainChannel, 0.24),
        })),
        inheritColor: {
          ...(ownerState.color === 'inherit' && {
            '&::before': { display: 'none' },
            backgroundColor: varAlpha(theme.vars.palette.text.primaryChannel, 0.24),
          }),
        },
      };
      return {
        borderRadius: 4,
        ...(ownerState.variant !== 'buffer' && { ...styled.inheritColor, ...styled.colors }),
      };
    },
    bar: { borderRadius: 'inherit' },
  },
};

// ----------------------------------------------------------------------

export const progress = { MuiLinearProgress };
