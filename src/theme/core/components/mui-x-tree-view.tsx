import type { ComponentConfig } from './_types';

// ----------------------------------------------------------------------

const MuiTreeItem: ComponentConfig = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: {
    label: ({ theme }) => ({ ...theme.typography.body2 }),
    iconContainer: { width: 'auto' },
  },
};

// ----------------------------------------------------------------------

export const treeView = { MuiTreeItem };
