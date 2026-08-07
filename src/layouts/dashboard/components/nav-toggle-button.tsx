// import React from 'react';
import IconButton from '@mui/material/IconButton';
import type { SxProps, Theme } from '@mui/material/styles';

interface NavToggleButtonProps {
  isNavMini?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
}

export function NavToggleButton({ isNavMini, onClick, sx }: NavToggleButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        width: 32,
        height: 32,
        position: 'absolute',
        top: 12,
        right: -16,
        zIndex: 9,
        borderRadius: '50%',
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        ...sx,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d={isNavMini ? 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' : 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z'}
        />
      </svg>
    </IconButton>
  );
}