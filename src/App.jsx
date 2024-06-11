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
import { MyContext } from './services/myContext';


import { useState } from 'react';


function App() {

  const [user, setUser] = useState(null);




  return (
    <>


        <MyContext.Provider value={{ user, setUser }}>
          {user != null ? (<MenuLink />) : (<MenuLink />)}

          <Routes>
            <Route path="inicio" element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="iniciar-sesion" element={<CardLogin />} />
            <Route path="registro" element={<CardRegistro />} />
            <Route path="perfil" element={<CardPerfil />} />
            <Route path="continua compra" element={<ContinuaCompra />} />
            <Route path="checkout" element={<CardCheckout />} />
          </Routes>
          
        </MyContext.Provider>

    </>
  )
}

export default App
