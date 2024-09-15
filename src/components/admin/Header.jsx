import React, { useState, useContext } from 'react';
import {
  AppBar, Toolbar, Box, Input, Button, Typography, Menu, MenuItem, Dialog
} from '@mui/material';
import { MyContext } from '../../services/MyContext';
import Profile from './Profile'; 
import { useColorContext } from './ColorContext';


const Header = ({ onSearch }) => {
  const { colors } = useColorContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, setUser } = useContext(MyContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

   // Define una imagen por defecto
   const defaultImagePath = "/pollo.png";

   // Usa el operador de coalescencia nula (??) para manejar casos donde la imagen no existe
   const imagePath = user?.user?.images?.path ?? defaultImagePath;

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    handleCloseMenu();
  };

  const handleProfile = () => {
    setIsProfileOpen(true);
    handleCloseMenu();
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          marginLeft: '250px',
          width: 'calc(99.99% - 250px)',
          backgroundColor: colors.header,
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: colors.header,
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
            {user?.user?.name || 'Nombre del Admin'}
          </Typography>

          <Box
            sx={{
              padding: 'px',
              cursor: 'pointer',
            }}
            onClick={handleAvatarClick}
          >
            <img
              // Utiliza la URL que viene del contexto MyContext
          
             src={`http://localhost/${imagePath}`}
             alt={'admin'}
             onError={(e) => e.currentTarget.src = defaultImagePath}
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
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleProfile}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Modal para el perfil */}
      <Dialog open={isProfileOpen} onClose={handleCloseProfile} maxWidth="sm" fullWidth>
        <Profile open={isProfileOpen} onClose={handleCloseProfile} />
      </Dialog>
    </>
  );
};

export default Header;
