import type { ComponentConfig } from './_types';

// ----------------------------------------------------------------------

const MuiMenuItem: ComponentConfig = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }) => ({ ...theme.mixins.menuItemStyles(theme) }) },
};

// ----------------------------------------------------------------------

export const menu = { MuiMenuItem };
