import type { ComponentPropsWithoutRef } from 'react';
import { mergeClasses } from 'minimal-shared/utils';

import { styled } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';

import { navSectionClasses } from '../styles';

// ----------------------------------------------------------------------

export const Nav = styled('nav')``;

// ----------------------------------------------------------------------

type NavLiProps = ComponentPropsWithoutRef<'li'> & {
  disabled?: boolean;
  sx?: SxProps<Theme>;
};

export const NavLi = styled(
  (props: NavLiProps) => {
    const forwardedProps = { ...props };
    delete forwardedProps.disabled;
    return (
      <li
        {...forwardedProps}
        className={mergeClasses([navSectionClasses.li, forwardedProps.className])}
      />
    );
  },
  { shouldForwardProp: (prop: PropertyKey) => !['disabled', 'sx'].includes(String(prop)) }
)<NavLiProps>(() => ({
  display: 'inline-block',
  variants: [{ props: { disabled: true }, style: { cursor: 'not-allowed' } }],
}));

// ----------------------------------------------------------------------

type NavUlProps = ComponentPropsWithoutRef<'ul'> & { sx?: SxProps<Theme> };

export const NavUl = styled((props: NavUlProps) => (
  <ul {...props} className={mergeClasses([navSectionClasses.ul, props.className])} />
))<NavUlProps>(() => ({ display: 'flex', flexDirection: 'column' }));
