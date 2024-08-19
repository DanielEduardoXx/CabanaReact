import React from 'react';
import { Box, Typography } from '@mui/material';
import { useColorContext } from './ColorContext';

const FooterAdmin = () => {
  const { colors } = useColorContext();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginLeft: '250px',
        width: 'calc(100% - 250px)',
        backgroundColor: colors.footer,
        textAlign: 'center',
        padding: '8px',
      }}
    
    >
      <Typography sx={{ color: '#ffffff' }}>© Derechos Reservados</Typography>
    </Box>
  );
};

export default FooterAdmin;
