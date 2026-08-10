import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';

import { layoutClasses } from '../core/classes';

// ----------------------------------------------------------------------

export type MainSectionProps = Omit<ComponentPropsWithoutRef<'main'>, 'children'> & {
  children?: ReactNode;
  sx?: SxProps<Theme>;
};

export function MainSection({ children, className, sx, ...other }: MainSectionProps) {
  return (
    <MainRoot className={mergeClasses([layoutClasses.main, className])} sx={sx} {...other}>
      {children}
    </MainRoot>
  );
}

// ----------------------------------------------------------------------

const MainRoot = styled('main')({
  display: 'flex',
  flex: '1 1 auto',
  minWidth: 0,
  width: '100%',
  flexDirection: 'column',
});
