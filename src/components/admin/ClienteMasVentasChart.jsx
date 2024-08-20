import React, { useState, useEffect, useContext } from 'react';
import { Bar } from '@ant-design/charts';
//import axios from 'axios';
//import { MyContext } from '../../services/MyContext'; // Asegúrate de que la ruta sea correcta

const ClienteMasVentasChart = () => {
  const [data, setData] = useState([]);
  //const { user } = useContext(MyContext);
  //const END_POINT = "http://arcaweb.test/api/V1";

  useEffect(() => {
    // Datos mokqueados
    const mockData = [
      { cliente: 'pedro hernandez', ventas: 50000 },
      { cliente: 'alberto lopez', ventas: 75000 },
      { cliente: 'carlos martinez', ventas: 25000 },
      { cliente: 'david torres', ventas: 100000 },
      { cliente: 'luisa gonzalez', ventas: 5000 },
    ];

    // Simula un retardo en la carga de datos, como si fuera una llamada a la API
    setTimeout(() => {
      setData(mockData);
    }, 1000);
  }, []);

  const config = {
    data,    
    xField: 'ventas',
    yField: 'cliente',
    seriesField: 'cliente',
    legend: { position: 'top-left' },
    xAxis: {
      label: {
        formatter: (v) => `$${v}`,
      },
    },
  };

  return <Bar {...config} />;
};

   /* useEffect(() => {
    const fetchData = async () => {
      const userSession = JSON.parse(sessionStorage.getItem('user'));
      const token = userSession?.token?.access_token;

      if (user && token) {
        try {
          const response = await axios.get(`${END_POINT}/clienteMasVentas`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            setData(response.data.map(item => ({
              cliente: item.nombre,
              ventas: item.total_ventas
            })));
          } else {
            console.error('Datos no válidos:', response.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.error("Access token no disponible");
      }
    };

    fetchData();
  }, [user]);

  const config = {
    data,
    xField: 'ventas',
    yField: 'cliente',
    seriesField: 'cliente',
    legend: { position: 'top-left' },
    xAxis: {
      label: {
        formatter: (v) => `$${v}`,
      },
    },
  };

  return <Bar {...config} />;
};*/

export default ClienteMasVentasChart;