// AdminApp.jsx
import React, { useState } from 'react';
import Header from './components/admin/Header';
import MenuLateral from './components/admin/MenuLateral';
import VentasComponent from './components/admin/VentasComponent';
import ClientesComponent from './components/admin/ClientesComponent';
import HistoricosComponent from './components/admin/HistoricosComponent';
import PromocionesComponent from './components/admin/PromocionesComponent';
import MateriaPrimaComponent from './components/admin/MateriaPrimaComponent';
import ProductosComponent from './components/admin/ProductosComponent';
import CategoriasComponent from './components/admin/CategoriasComponent';
import SugerenciasComponent from './components/admin/SugerenciasComponent';
import FooterAdmin from './components/admin/FooterAdmin';

const AdminApp = () => {
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
      <FooterAdmin />
    </>
  );
};

export default AdminApp;