import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./components/users/Inicio";
import MenuLink from './components/users/MenuLink';
import Productos from './components/users/Productos';
import CardLogin from './components/users/common/CardLogin';
import CardRegistro from './components/users/common/CardRegistro';
import CardPerfil from './components/users/common/CardPerfil';
import ContinuaCompra from './components/users/common/ContinuaCompra';
import CardCheckout from './components/users/common/CardCheckout';
import { MyContext, MyProvider } from './services/MyContext.jsx';
import Footer from './components/users/Footer.jsx';
import React, { useState } from 'react';
import MenuLateral from './components/admin/MenuLateral';
import Header from './components/admin/Header';
import VentasComponent from './components/admin/VentasComponent';
import ClientesComponent from './components/admin/ClientesComponent';
import HistoricosComponent from './components/admin/HistoricosComponent';
import PromocionesComponent from './components/admin/PromocionesComponent';
import MateriaPrimaComponent from './components/admin/MateriaPrimaComponent';
import ProductosComponent from './components/admin/ProductosComponent';
import CategoriasComponent from './components/admin/CategoriasComponent';
import SugerenciasComponent from './components/admin/SugerenciasComponent';

function App() {
  const [user, setUser] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuClick = (component) => {
    setSelectedComponent(component);
    setSearchQuery(''); // Resetea la búsqueda al cambiar de componente
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <MyProvider value={{ user, setUser }}>
      {user && user.type === 'admin' ? (
        <>
          <Header onSearch={handleSearch} />
          <MenuLateral onMenuClick={handleMenuClick} />
          {selectedComponent === 'Clientes' && <ClientesComponent searchQuery={searchQuery} />}
          {selectedComponent === 'verificarVentas' && <VentasComponent searchQuery={searchQuery} />}
          {selectedComponent === 'Historico' && <HistoricosComponent searchQuery={searchQuery} />}
          {selectedComponent === 'Promociones' && <PromocionesComponent searchQuery={searchQuery} />}
          {selectedComponent === 'MateriaPrima' && <MateriaPrimaComponent searchQuery={searchQuery} />}
          {selectedComponent === 'Productos' && <ProductosComponent searchQuery={searchQuery} />}
          {selectedComponent === 'Categorias' && <CategoriasComponent searchQuery={searchQuery} />}
          {selectedComponent === 'Sugerencias' && <SugerenciasComponent searchQuery={searchQuery} />}
          <Footer />
        </>
      ) : (
        <>
          <MenuLink />
          <Routes>
            <Route path="inicio" element={<Inicio />} />
            <Route path="productos" element={<Productos />} />
            <Route path="iniciar-sesion" element={<CardLogin />} />
            <Route path="registro" element={<CardRegistro />} />
            <Route path="perfil" element={<CardPerfil />} />
            <Route path="continua-compra" element={<ContinuaCompra />} />
            <Route path="checkout" element={<CardCheckout />} />
          </Routes>
          <Footer />
        </>
      )}
    </MyProvider>
  );
}

export default App;
