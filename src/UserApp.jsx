<<<<<<< Updated upstream
// UserApp.jsx
import React from 'react';
=======

import React, { useContext, useEffect, useState } from 'react';
>>>>>>> Stashed changes
import { Route, Routes } from 'react-router-dom';
import Inicio from './components/users/Inicio';
import MenuLink from './components/users/MenuLink';
import Productos from './components/users/Productos';
import CardLogin from './components/users/common/CardLogin';
import CardRegistro from './components/users/common/CardRegistro';
import Cardpqr from './components/users/common/cardpqr.jsx'
import CardPerfil from './components/users/common/CardPerfil';
import ContinuaCompra from './components/users/common/ContinuaCompra';
import CardCheckout from './components/users/common/CardCheckout';
import Footer from './components/users/Footer.jsx';
<<<<<<< Updated upstream
=======
import BtnCarrito from './components/users/common/BtnInfoCarrito.jsx';
import { MyContext } from './services/MyContext.jsx';
>>>>>>> Stashed changes

const UserApp = () => {
  return (
    <>
      <MenuLink />
      <Routes>
        <Route path="inicio" element={<Inicio />} />
        <Route path="contacto" element={<Cardpqr/>}/>
        <Route path="productos" element={<Productos />} />
        <Route path="iniciar-sesion" element={<CardLogin />} />
        <Route path="registro" element={<CardRegistro />} />
        <Route path="perfil" element={<CardPerfil />} />
        <Route path="continua compra" element={<ContinuaCompra />} />
        <Route path="checkout" element={<CardCheckout />} />
      </Routes>
      <Footer />
    </>
  );
};

export default UserApp;