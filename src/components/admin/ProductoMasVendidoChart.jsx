import React, { useState, useEffect, useContext } from 'react';
import { Pie } from '@ant-design/charts';
//import axios from 'axios';
//import { MyContext } from '../../services/MyContext'; // Asegúrate de que la ruta sea correcta

const ProductoMasVendidoChart = () => {
  const [data, setData] = useState([]);
  //const { user } = useContext(MyContext);
  //const END_POINT = "http://arcaweb.test/api/V1";

  useEffect(() => {
    // Datos mokqueados
    const mockData = [
      { type: 'Producto A', value: 40 },
      { type: 'Producto B', value: 21 },
      { type: 'Producto C', value: 17 },
      { type: 'Producto D', value: 13 },
      { type: 'Producto E', value: 9 },
    ];

    // Simula un retardo en la carga de datos, como si fuera una llamada a la API
    setTimeout(() => {
      setData(mockData);
    }, 1000);
  }, []);

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'outer',
      content: ({ value }) => `${value}`, // Muestra el valor directamente
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    tooltip: {
      showTitle: false,
      formatter: (datum) => ({ name: datum.type, value: datum.value }), // Muestra el valor en el tooltip
    },
    interactions: [{ type: 'element-active' }],
  };

  return <Pie {...config} />;
};


  /*useEffect(() => {
    const fetchData = async () => {
      const userSession = JSON.parse(sessionStorage.getItem('user'));
      const token = userSession?.token?.access_token;

      if (user && token) {
        try {
          const response = await axios.get(`${END_POINT}/productoMasVendido`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            setData(response.data.map(item => ({
              type: item.nombre,
              value: item.cantidad_vendida
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
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  return <Pie {...config} />;
};*/

export default ProductoMasVendidoChart;