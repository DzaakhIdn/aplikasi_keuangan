import type { ReactNode } from 'react';

import Divider from '@mui/material/Divider';
import type { DividerProps } from '@mui/material/Divider';

// ----------------------------------------------------------------------

type FormDividerProps = Omit<DividerProps, 'children'> & {
  label?: ReactNode;
};

export function FormDivider({ sx, label = 'OR', ...other }: FormDividerProps) {
  return (
    <Divider
      sx={[
        () => ({
          my: 3,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, :after': { borderTopStyle: 'dashed' },
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...other}
    >
      {label}
    </Divider>
  );
}
