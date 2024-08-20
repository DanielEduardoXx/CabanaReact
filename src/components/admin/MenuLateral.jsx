
import React, { useState } from 'react';
import { Box, Button, Collapse, List, ListItem } from '@mui/material';
import axios from 'axios';
import { useColorContext } from './ColorContext';

// Componente principal del menú lateral
const MenuLateral = ({ onMenuClick }) => {

  // Estados para controlar la apertura de los submenús
  const { colors } = useColorContext();
  const [openMenu2, setOpenMenu2] = useState(false);
  const [openMenu3, setOpenMenu3] = useState(false);

  // Función para alternar el estado del submenú de ventas
  const toggleMenu2 = () => {
    setOpenMenu2(!openMenu2);
  };

  // Función para alternar el estado del submenú de gestión
  const toggleMenu3 = () => {
    setOpenMenu3(!openMenu3);
  };


  // Estilos comunes para los botones del menú
  const buttonStyles = {
    color: '#fff',
    backgroundColor: '#E3C800',
    '&:hover': {
      backgroundColor: '#BAC8D3',
    },
    fullWidth: true,
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '250px',
        backgroundColor: colors.sidebar,
        color: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
      }}
    
    >
      {/* Logo del menú lateral */}
      <Box
        sx={{
          padding: '16px',
          textAlign: 'center',       // Alineación del contenido centrada
        }}
      >
        <img 
          src="http:./public/pollo.png" // Ruta de la imagen del logo
          alt="Logo" 
          style={{
            width: '100px',          // Ancho de la imagen
            height: '100px',         // Altura de la imagen
            borderRadius: '50%',     // Bordes redondeados (forma circular)
          }}
        />
      </Box>
      
      {/* Botones del menú lateral */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',               // Espacio entre los botones
          width: '100%',
        }}
      >
        {/* Botón de Dashboard */}
        <Button 
          sx={buttonStyles}
          onClick={() => onMenuClick('Dashboard')}
        >
         Dashboard
        </Button>

        {/* Botón de Clientes */}
        <Button 
          sx={buttonStyles}
          onClick={() => onMenuClick('Clientes')}
        >
          Clientes
        </Button>

        {/* Botón de Ventas con submenú */}
        <Button 
          sx={buttonStyles}
          onClick={toggleMenu2}
        >
          Ventas
        </Button>
        <Collapse in={openMenu2}>
          <List
            sx={{
              backgroundColor: '#B1DDF0', // Color de fondo del submenú
              width: '100%',
              padding: 0,
            }}
          >
            <ListItem button onClick={() => onMenuClick('verificarVentas')}>
              Verificar Ventas
            </ListItem>
            <ListItem button onClick={() => onMenuClick('Historico')}>
              Histórico
            </ListItem>
          </List>
        </Collapse>

        {/* Botón de Gestión con submenú */}
        <Button 
          sx={buttonStyles}
          onClick={toggleMenu3}
        >
          Gestión
        </Button>
        <Collapse in={openMenu3}>
          <List
            sx={{
              backgroundColor: '#B1DDF0', // Color de fondo del submenú
              width: '100%',
              padding: 0,
            }}
          >
            <ListItem button onClick={() => onMenuClick('Promociones')}>
              Promociones
            </ListItem>
            <ListItem button onClick={() => onMenuClick('MateriaPrima')}>
              Materia Prima
            </ListItem>
            <ListItem button onClick={() => onMenuClick('Productos')}>
              Productos
            </ListItem>
            <ListItem button onClick={() => onMenuClick('Categorias')}>
              Categorías
            </ListItem>
          </List>
        </Collapse>

        {/* Botón de Sugerencias */}
        <Button 
          sx={buttonStyles}
          onClick={() => onMenuClick('Sugerencias')}
        >
          Sugerencias
        </Button>
      </Box>
    </Box>
  );
};

export default MenuLateral;
