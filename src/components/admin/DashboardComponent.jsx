// DashboardComponent.jsx
import React from 'react';
import ClienteMasVentasChart from './ClienteMasVentasChart';
import ProductoMasVendidoChart from './ProductoMasVendidoChart';
import PromocionMasVendidasChart from './PromocionMasVendidasChart';

const DashboardComponent = () => {
  return (
    <div className="dashboard">
      <h2>Panel de Control</h2>
      <div className="chart-container">
        <div className="chart">
          <h3>Clientes con más ventas</h3>
          <ClienteMasVentasChart />
        </div>
        <div className="chart">
          <h3>Productos más vendidos</h3>
          <ProductoMasVendidoChart />
        </div>
        {/*<div className="chart">
          <h3>Promociones con más unidades vendidas</h3>
          <PromocionMasVendidasChart />
        </div>*/}
      </div>
    </div>
  );
};

export default DashboardComponent;