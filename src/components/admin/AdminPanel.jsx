import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { SketchPicker } from 'react-color';
import { useColorContext } from './ColorContext';

const AdminPanel = () => {
  const { colors, updateColors } = useColorContext();

  const handleChangeComplete = (color) => {
    updateColors(color.hex);
  };

  return (
    <Box sx={{  alignContent: 'center', borderRadius: 2, mb: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>
         Color Selector
      </Typography>
      <SketchPicker 
        width='100%'
        height='30%'
        
        color={colors.main}
        onChangeComplete={handleChangeComplete}
      />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Selected color: {colors.main}
      </Typography>
    </Box>
  );
};

export default AdminPanel;