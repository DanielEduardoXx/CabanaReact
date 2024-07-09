import './App.css'

import { BrowserRouter, Route, Routes } from "react-router-dom";

//import { useUsuarios } from "./hooks/useUsuarios.js";

import Inicio from "./components/users/Inicio"
import MenuLink from './components/users/MenuLink'
import Productos from './components/users/Productos'
import CardLogin from './components/users/common/CardLogin'
import CardRegistro from './components/users/common/CardRegistro'
import CardPerfil from './components/users/common/CardPerfil'
import ContinuaCompra from './components/users/common/ContinuaCompra'
import CardCheckout from './components/users/common/CardCheckout';
import { MyContext, MyProvider } from './services/MyContext.jsx';
import Footer from './components/users/Footer.jsx';

import { useState } from 'react';


function App() {

  const [user, setUser] = useState(null);


  return (
    <>


      <MyProvider value={{ user, setUser }}>
        <MenuLink />

          <Routes>
            <Route path="inicio" element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="iniciar-sesion" element={<CardLogin />} />
            <Route path="registro" element={<CardRegistro />} />
            <Route path="perfil" element={<CardPerfil />} />
            <Route path="continua compra" element={<ContinuaCompra />} />
            <Route path="checkout" element={<CardCheckout />} />
          </Routes>


      </MyProvider>

      <Footer />
    </>
  )
}

export default App
