import React, { useState, useEffect, useContext } from 'react';
import { Column } from '@ant-design/charts';
import axios from 'axios';
import { MyContext } from '../../services/MyContext'; // Asegúrate de que la ruta sea correcta

const PromocionMasVendidasChart = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(MyContext);
  const END_POINT = "http://arcaweb.test/api/V1";


 /* useEffect(() => {
    // Datos mokqueados
    const mockData = [
      { promocion: 'san pedro', unidades: 1200 },
      { promocion: 'san valentin', unidades: 950 },
      { promocion: 'navidad', unidades: 750 },
      { promocion: 'año nuevo', unidades: 600 },
      { promocion: 'cumpleaños', unidades: 450 },
    ];

    // Simula un retardo en la carga de datos, como si fuera una llamada a la API
    setTimeout(() => {
      setData(mockData);
    }, 1000);
  }, []);

  const config = {
    data,
    xField: 'promocion',
    yField: 'unidades',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      promocion: { alias: 'Promoción' },
      unidades: { alias: 'Unidades Vendidas' },
    },
  };

  return <Column {...config} />;
};*/

  useEffect(() => {
    const fetchData = async () => {
      const userSession = JSON.parse(sessionStorage.getItem('user'));
      const token = userSession?.token?.access_token;

      if (user && token) {
        try {
          const response = await axios.get(`${END_POINT}/promocion-vendidas`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            setData(response.data.map(item => ({
              promocion: item.nombre,
              unidades: item.unidades_vendidas
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
    xField: 'promocion',
    yField: 'unidades',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      promocion: { alias: 'Promoción' },
      unidades: { alias: 'Unidades Vendidas' },
    },
  };

  return <Column {...config} />;
};

export default PromocionMasVendidasChart;