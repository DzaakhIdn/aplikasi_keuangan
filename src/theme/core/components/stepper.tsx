import type { ComponentConfig } from './_types';

// ----------------------------------------------------------------------

const MuiStepConnector: ComponentConfig = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { line: ({ theme }) => ({ borderColor: theme.vars.palette.divider }) },
};

// ----------------------------------------------------------------------

export const stepper = { MuiStepConnector };
