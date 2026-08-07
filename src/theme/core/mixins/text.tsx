import { remToPx } from 'minimal-shared/utils';

import { createTheme as getTheme } from '@mui/material/styles';
import type { CSSObject } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * The original theme has not been customized.
 * Only use non-styling features such as breakpoints...
 */
const defaultMuiTheme = getTheme();

export interface PersistentTypography extends CSSObject {
  fontSize?: string | number;
  lineHeight?: string | number;
}

export interface MaxLineProps {
  line: number;
  persistent?: PersistentTypography;
}

function hasFontSize(value: unknown): value is { fontSize?: string | number } {
  return typeof value === 'object' && value !== null;
}

/**
 * @usage
 * ...theme.mixins.textGradient(`to right, ${theme.vars.palette.text.primary}, ${alpha(theme.vars.palette.text.primary, 0.2)}`
 */
export function textGradient(color: string): CSSObject {
  return {
    background: `linear-gradient(${color})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    color: 'transparent',
  };
}

function getFontSize(fontSize: string | number | undefined) {
  return typeof fontSize === 'string' ? remToPx(fontSize) : fontSize;
}

function getLineHeight(lineHeight: string | number | undefined, fontSize?: number) {
  if (typeof lineHeight === 'string') {
    return fontSize ? remToPx(lineHeight) / fontSize : 1;
  }

  return lineHeight;
}

function calculateHeight(fontSize: number, lineHeight: number, line: number) {
  return fontSize * lineHeight * line;
}

// ----------------------------------------------------------------------

export function maxLine({ line, persistent }: MaxLineProps): CSSObject {
  const breakpoints = defaultMuiTheme.breakpoints.keys;

  const baseStyles: CSSObject = {
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    WebkitLineClamp: line,
    WebkitBoxOrient: 'vertical',
  };

  if (!persistent) {
    return baseStyles;
  }

  const fontSizeBase = getFontSize(persistent.fontSize);
  const lineHeight = getLineHeight(persistent.lineHeight, fontSizeBase);

  if (!lineHeight || !fontSizeBase) {
    return baseStyles;
  }

  const responsiveStyles = breakpoints.reduce<CSSObject>((acc, breakpoint) => {
    const breakpointStyles = persistent[defaultMuiTheme.breakpoints.up(breakpoint)];
    const fontSize = getFontSize(hasFontSize(breakpointStyles) ? breakpointStyles.fontSize : undefined);

    if (fontSize) {
      acc[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        height: calculateHeight(fontSize, lineHeight, line),
      };
    }

    return acc;
  }, {});

  return {
    ...baseStyles,
    height: calculateHeight(fontSizeBase, lineHeight, line),
    ...responsiveStyles,
  };
}
