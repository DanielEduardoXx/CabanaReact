
import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Inicio from './components/users/Inicio';
import MenuLink from './components/users/MenuLink';
import Productos from './components/users/Productos';
import CardLogin from './components/users/common/CardLogin';
import CardRegistro from './components/users/common/CardRegistro';
import CardPerfil from './components/users/common/CardPerfil';
import CardCheckout from './components/users/common/CardCheckout';
import Footer from './components/users/Footer.jsx';
import BtnCarrito from './components/users/common/BtnInfoCarrito.jsx';
import SolicitudEmail from './components/users/common/SolicitudEmail.jsx';
import CodeEmailConfirmation from './components/users/common/CodeEmailConfirmation.jsx';
import { MyContext } from './services/MyProvider.jsx';
import VerificacionCuenta from './components/users/common/VerificacionCuenta.jsx';
// import { ImagenesProvider } from './services/MyContext.jsx';

const UserApp = () => {
    const{user}=
    useContext(MyContext);

  return (
    <>
    <MenuLink />
    <BtnCarrito />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="inicio" element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="iniciar-sesion" element={<CardLogin />} />
        <Route path="registro" element={<CardRegistro />} />
        <Route path="perfil" element={<CardPerfil />} />
        <Route path="checkout" element={<CardCheckout />} />
        <Route path="SolicitudEmail" element={<SolicitudEmail />} />
        <Route path="CodeEmailConfirmation" element={<CodeEmailConfirmation />} />
        <Route path="VerificacionCuenta" element={<VerificacionCuenta />} />
      </Routes>
    <Footer />
  </>
  );
};

export default UserApp;
