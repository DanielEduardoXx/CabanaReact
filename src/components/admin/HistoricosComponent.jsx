import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
TableHead, TableRow, Modal, TextField, IconButton
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { MyContext } from '../../services/MyContext';

const END_POINT = "http://arcaweb.test/api/V1";

// Estilos para el componente
const styles = {
mainBox: {
padding: '1rem',
},
subBox: {
marginBottom: '1rem',
},
tableButton: {
margin: '0.5rem',
},
modal: {
position: 'absolute',
top: '50%',
left: '50%',
transform: 'translate(-50%, -50%)',
width: '400px',
backgroundColor: 'white',
padding: '1rem',
boxShadow: 24,
},
};

// Componente principal
const HistoricosComponent = ({ searchQuery }) => {
const { user } = useContext(MyContext);
const [ventasData, setVentasData] = useState([]);
const [filteredVentasData, setFilteredVentasData] = useState([]);
const [isViewVentasModalOpen, setIsViewVentasModalOpen] = useState(false);
const [selectedVenta, setSelectedVenta] = useState(null);
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [totalVentas, setTotalVentas] = useState(0);

const userSession=JSON.parse(sessionStorage.getItem('user'));
console.log( "userSession ",userSession);
const token = userSession?.token?.access_token;
console.log("hola ",token);

// Función para obtener los datos de las ventas desde la API al cargar el componente
const fetchVentasData = async () => {
if (user) {
try {
const response = await axios.get(`${END_POINT}/ventaCompletado`, {
  headers: { 'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json' 
}
});
console.log('Datos obtenidos de la API:', response.data); // Añadir log
if (response.status === 200) {
  setVentasData(response.data.data);
} else {
  console.error('Datos de ventas no válidos:', response.data.data);
}
} catch (error) {
console.error('Error al obtener datos de ventas:', error);
}
} else {
console.error("Access token no disponible");
}
};

useEffect(() => {
fetchVentasData();
}, []);

// Función para filtrar las ventas según la búsqueda
useEffect(() => {
setFilteredVentasData(
ventasData.filter(venta =>
(venta.id && venta.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
(venta.user_id && venta.user_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
(venta.metodo_pago && venta.metodo_pago.toLowerCase().includes(searchQuery.toLowerCase()))
)
);
}, [searchQuery, ventasData]);

// Función para filtrar las ventas por rango de fechas y calcular el total
const handleSearchVentas = () => {
const filtered = ventasData.filter((venta) => {
const ventasDate = new Date(venta.created_at); // Usar 'created_at' para la fecha
const start = new Date(startDate);
const end = new Date(endDate);
console.log('Fecha de la venta:', venta.created_at);
console.log('Fecha de la venta (Date object):', ventasDate);

return ventasDate >= start && ventasDate <= end;
});

setFilteredVentasData(filtered);

const total = filtered.reduce((acc, venta) => acc + venta.total, 0); // Calcula el total cada vez que se realiza una búsqueda
setTotalVentas(total);

console.log('Ventas filtradas:', filtered);
console.log('Total de ventas:', total); // Añadir log

};

const handleViewVentas = (venta) => {
setSelectedVenta(venta);
setIsViewVentasModalOpen(true);
};

const handleCloseViewVentasModal = () => {
setIsViewVentasModalOpen(false);
};

return (
<Box style={styles.mainBox}>
<Box style={styles.subBox}>
<Typography variant="h6">Ventas / Historico</Typography>
</Box>
<Box sx={{ height: '90px', alignContent: 'center' }} component={Paper} style={styles.subBox}>
    <TextField
      label="Fecha Inicial"
      type="date"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ marginLeft: '3rem', marginRight: '3rem' }}
    />
    <TextField
      label="Fecha Final"
      type="date"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ marginRight: '1rem' }}
    />
    <Button 
      variant="contained" 
      sx={{ backgroundColor: "#E3C800", color: "#fff" }}
      onClick={handleSearchVentas}
    >
      Buscar
    </Button>
  </Box>

  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Fecha</TableCell>
          <TableCell>ID Venta</TableCell>
          <TableCell>Cédula</TableCell>
          <TableCell>Metodo Pago</TableCell>
          <TableCell>Total</TableCell>
          <TableCell>Estado</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredVentasData.map((venta, index) => (
          <TableRow key={index}>
            <TableCell>{venta.created_at}</TableCell>
            <TableCell>{venta.id}</TableCell>
            <TableCell>{venta.user_id}</TableCell>
            <TableCell>{venta.metodo_pago}</TableCell>
            <TableCell>{venta.total}</TableCell>
            <TableCell>{venta.estado}</TableCell>
            <TableCell>
              <IconButton onClick={() => handleViewVentas(venta)}>
                <Visibility />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>

  <Typography variant="h6">Total de Ventas: {totalVentas}</Typography> {/* Mostrar el total de ventas */}

  {/* Modal para visualizar venta */}
  <Modal open={isViewVentasModalOpen} onClose={handleCloseViewVentasModal}>
    <Box sx={{ color: "black" }} style={styles.modal}>
      <Typography variant="h6">Información de la Venta</Typography>
      {selectedVenta && (
        <>
          <Typography>Fecha: {selectedVenta.created_at}</Typography>
          <Typography>Id Venta: {selectedVenta.id}</Typography>
          <Typography>Cédula: {selectedVenta.user_id}</Typography>
          <Typography>Metodo Pago: {selectedVenta.metodo_pago}</Typography>
          <Typography>Total: {selectedVenta.total}</Typography>
          <Typography>Estado: {selectedVenta.estado}</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button onClick={handleCloseViewVentasModal}>Cerrar</Button>
          </Box>
        </>
      )}
    </Box>
  </Modal>
</Box>
);
};

export default HistoricosComponent;