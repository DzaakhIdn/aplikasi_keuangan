import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface EmptyContentProps {
  title?: string;
  description?: string;
  imgUrl?: string;
  sx?: object;
}

export function EmptyContent({ 
  title = 'No Data', 
  description,
  imgUrl,
  sx,
  ...other 
}: EmptyContentProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 3,
        ...sx,
      }}
      {...other}
    >
      {imgUrl && (
        <Box
          component="img"
          src={imgUrl}
          sx={{
            width: 240,
            height: 240,
            objectFit: 'cover',
            marginBottom: 3,
          }}
        />
      )}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
}