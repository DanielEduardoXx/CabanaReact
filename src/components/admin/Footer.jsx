import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginLeft: '250px',
        width: 'calc(100% - 250px)',
        backgroundColor: '#263491',
        textAlign: 'center',
        padding: '8px',
      }}
    >
      <Typography sx={{ color: '#ffffff' }}>© Derechos Reservados</Typography>
    </Box>
  );
};

export default Footer;
