import React, { useState } from 'react';
import { Box, Link, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CamposLogin from './CamposLogin';
import ImagenLogin from './AgregarImagen';
import { NavLink, Route } from 'react-router-dom';


export default function CardLogin() {  


  return (


    <Box
      sx={{
        display: {xs: 'center', md: 'flex', sm: 'flex' },
        alignItems: { xs: 'center', sm: 'flex', md: 'center' },
        alignContent: {xs:'center', sm: 'flex', md:'center'},
        width:'100%'
      }}>


      {/*Este es el Box de la imagen */}

      <Box>
        <ImagenLogin></ImagenLogin>
      </Box>

      {/*Este es el Box del LOGIN */}
      <Box
        sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center' ,
          margin: { md: '2rem' },
          padding: { xs: '2rem', md: '0' },
          width: { xs: '100%', sm: '100%', md: '50%' },
          height: { xs: '100%', sm: '100%', md: '50%', lg:'50%' }
        }}>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width:'100%'
          }}>

          {/*Aqui Importo el icono del login */}
          <AccountCircleIcon
            sx={{
              width: '3rem',
              height: '3rem',
            }} />

          <h1>Sing in</h1>

        </Box>

        {/*Aqui Importo CaomposLogin.jsx*/}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center',
            width: '100%'
          }}>

          <CamposLogin 
          sx={{width:'100%'}}
          />

        </Box>


        <Box
          sx={{
            marginTop: '1rem',
            marginLeft: '0',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            typography: 'body1',
            '& > :not(style) ~ :not(style)': {
              ml: 2,

            }
          }}

        >
          <NavLink id="registrarse" to="../registro">Registrarse</NavLink>
          <Link id="olvido-password" href="#">¿Olvidaste tu Contraseña?</Link>
        </Box>

      </Box>
    </Box>
  );
}