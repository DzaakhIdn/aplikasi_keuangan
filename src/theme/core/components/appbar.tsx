import type { ComponentConfig } from './_types';

// ----------------------------------------------------------------------

const MuiAppBar: ComponentConfig = {
  /** **************************************
   * DEFAULT PROPS
   *************************************** */
  defaultProps: { color: 'transparent' },

  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { boxShadow: 'none' } },
};

// ----------------------------------------------------------------------

export const appBar = { MuiAppBar };
