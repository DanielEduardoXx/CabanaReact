import React, { useState, useEffect, useContext } from 'react';
import { PieChart, Pie, Tooltip, Cell, Label } from 'recharts';
import axios from 'axios';
import { MyContext } from '../../services/MyContext'; // Asegúrate de que la ruta sea correcta

const ProductoMasVendidoChart = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(MyContext);
  const END_POINT = "http://arcaweb.test/api/V1";

  useEffect(() => {
    const fetchData = async () => {
      const userSession = JSON.parse(sessionStorage.getItem('user'));
      const token = userSession?.token?.access_token;

      if (user && token) {
        try {
          const response = await axios.get(`${END_POINT}/producto-mas-vendido`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });
          if (response.status === 200) {
            const formattedData = response.data.map(item => ({
              name: item.nom_producto,
              value: Number(item.total_cantidad_vendida)
            }));
            console.log(formattedData); // Verifica los datos en la consola
            setData(formattedData);
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

  // Lista de colores para las porciones del gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6F61', '#6A5ACD', '#FFD700', '#FF6347'];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <PieChart width={700} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length) {
              const { name, value } = payload[0].payload;
              return (
                <div style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '5px' }}>
                  <strong>{name}</strong>: {value}
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </div>
  );
};

export default ProductoMasVendidoChart;
