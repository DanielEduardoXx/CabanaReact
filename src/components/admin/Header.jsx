import React, { useState } from 'react';
import { AppBar, Toolbar, Box, Input, Button, Typography, Menu, MenuItem } from '@mui/material';

const Header = ({ onSearch }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log('Cerrar sesión');
    handleClose();
  };

  const handleProfile = () => {
    console.log('Perfil');
    handleClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        marginLeft: '250px',
        width: 'calc(97.90% - 250px)',
        backgroundColor: '#263491',
      }}
    >
      <Toolbar
        sx={{
          backgroundColor: '#263491',
          marginLeft: '80px',
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Input
            sx={{ background: '#fff', borderRadius: '4px', marginRight: '10px' }}
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button
            sx={{ backgroundColor: '#E3C800' }}
            variant="contained"
            onClick={handleSearchClick}
          >
            Buscar
          </Button>
        </Box>

        <Typography
          sx={{
            flexGrow: 0,
            textAlign: 'center',
          }}
        >
          Nombre del Admi
        </Typography>

        <Box
          sx={{
            padding: 'px',
            cursor: 'pointer',
          }}
          onClick={handleAvatarClick}
        >
          <img
            src="http:./public/pollo.png"
            alt="Admin"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
          />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleProfile}>Perfil</MenuItem>
          <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
