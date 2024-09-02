import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';
import axios from 'axios';
import { MyContext } from '../../services/MyContext'; // Asegúrate de que la ruta sea correcta

const ClienteMasVentasChart = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(MyContext);
  const END_POINT = "http://arcaweb.test/api/V1";

  useEffect(() => {
    const fetchData = async () => {
      const userSession = JSON.parse(sessionStorage.getItem('user'));
      const token = userSession?.token?.access_token;

      if (user && token) {
        try {
          const response = await axios.get(`${END_POINT}/cliente-mas-ventas`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            setData(response.data.map(item => ({
              cliente: item.nombre_usuario,
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

  // Lista de colores para las barras
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD', '#FFD700', '#FF6347'];

  return (
    <div style={{ width: '100%', height: 450 }}>
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{ top: 20, right: 30, bottom: 5, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="cliente" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="ventas">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
};

export default ClienteMasVentasChart;
