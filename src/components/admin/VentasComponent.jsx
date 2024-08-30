import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Select, MenuItem
} from '@mui/material';
import { Visibility, Edit, Delete, Add } from '@mui/icons-material';
import { MyContext } from '../../services/MyContext';

const END_POINT = "http://arcaweb.test/api/V1";

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

const VentasComponent = ({ searchQuery }) => {
  const { user } = useContext(MyContext);
  const [ventasData, setVentasData] = useState([]);
  const [filteredVentasData, setFilteredVentasData] = useState([]);
  const [isNewVentasModalOpen, setIsNewVentasModalOpen] = useState(false);
  const [isViewVentasModalOpen, setIsViewVentasModalOpen] = useState(false);
  const [isEditVentasModalOpen, setIsEditVentasModalOpen] = useState(false);
  const [isDeleteVentasDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [detVenta, setDetVenta] = useState(null);
  const [productos, setProductos] = useState([]);
  const [promocionesData, setPromocionesData] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([{
    id: '',
    nom_producto: '',
    precio_producto: 0,
    cantidad: 1,
    porcentaje: 0,
    descuento: 0,
    subtotal: 0,
  }]);
  const [selectedPromocion, setSelectedPromocion] = useState('');
  const [total, setTotal] = useState(0);

  const userSession = JSON.parse(sessionStorage.getItem('user'));
  const token = userSession?.token?.access_token;

  const fetchVentasData = async () => {
    if (user) {
      try {
        const response = await axios.get(`${END_POINT}/ventaProceso`, {
          headers: { 'Authorization': `Bearer ${token}`,
                     'Content-Type': 'application/json' }
        });
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

  const fetchDetVentaData = async (ventaId) => {
    try {
      const response = await axios.get(`${END_POINT}/detventas`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (response.status === 200) {
        const filteredDetVenta = response.data.data.filter(det => det.venta_id === ventaId);
        setDetVenta(filteredDetVenta);
      } else {
        console.error('Datos de detalle de venta no válidos:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de detalle de venta:', error);
    }
  };

  const fetchProductosData = async () => {
    try {
      const response = await axios.get(`${END_POINT}/productos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      setProductos(response.data.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchPromocionesData = async () => {
    if (!user) {
      console.error("Access token no disponible");
      return;
    }

    try {
      const response = await axios.get(`${END_POINT}/promociones?included=detpromociones.producto`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
        setPromocionesData(response.data.data);
      } else {
        console.error('Datos de promociones no válidos:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de promociones:', error);
    }
  };

  useEffect(() => {
    fetchVentasData();
    fetchProductosData();
    fetchPromocionesData();
  }, []);

  useEffect(() => {
    setFilteredVentasData(
      ventasData.filter(venta =>
        (venta.id && venta.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (venta.user_id && venta.user_id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (venta.metodo_pago && venta.metodo_pago.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, ventasData]);

  const calcularSubtotal = (precio, cantidad, descuento) => {
    const descuentoMonto = (precio * cantidad) * (descuento / 100);
    return (precio * cantidad) - descuentoMonto;
  };

  const handleProductChange = (index, field, value) => {
    setProductosSeleccionados((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        [field]: value,
      };

      if (field === 'id') {
        const selectedProducto = productos.find(prod => prod.id === value);
        newState[index].nom_producto = selectedProducto.nom_producto;
        newState[index].precio_producto = selectedProducto.precio_producto;
        newState[index].cantidad = 1;
        newState[index].porcentaje = 0;
      }

      newState[index].descuento = (newState[index].precio_producto * newState[index].cantidad * newState[index].porcentaje) / 100;
      newState[index].subtotal = (newState[index].precio_producto * newState[index].cantidad) - newState[index].descuento;
  

      if (field === 'cantidad' || field === 'porcentaje' || field === 'precio_producto') {
        newState[index].subtotal = calcularSubtotal(
          newState[index].precio_producto,
          newState[index].cantidad,
          newState[index].porcentaje
        );
      }

      const nuevoTotal = newState.reduce((sum, prod) => sum + prod.subtotal, 0);
      setTotal(nuevoTotal);

      return newState;
    });
  };

  const handleAddProductRow = () => {
    setProductosSeleccionados((prevState) => [
      ...prevState,
      {
        id: '',
        nom_producto: '',
        precio_producto: 0,
        cantidad: 1,
        porcentaje: 0,
        descuento: 0,
        subtotal: 0,
      },
    ]);
  };

  const handleRemoveProductRow = (index) => {
    setProductosSeleccionados((prevState) => {
      const newState = prevState.filter((_, i) => i !== index);
      const nuevoTotal = newState.reduce((sum, prod) => sum + prod.subtotal, 0);
      setTotal(nuevoTotal);
      return newState;
    });
  };

  const handlePromocionChange = (event) => {
    const promocionId = event.target.value;
    setSelectedPromocion(promocionId);

    if (promocionId) {
      const promocion = promocionesData.find(promo => promo.id === promocionId);
      if (promocion && promocion.detpromociones) {
        const productosPromocion = promocion.detpromociones.map(detPromo => ({
          id: detPromo.producto.id,
          nom_producto: detPromo.producto.nom_producto,
          precio_producto: detPromo.producto.precio_producto,
          cantidad: detPromo.cantidad,
          porcentaje: detPromo.porcentaje,
          descuento: detPromo.descuento,
          subtotal: detPromo.subtotal,
        }));
        setProductosSeleccionados(productosPromocion);
        setTotal(promocion.total_promo);
        console.log('productosSeleccionados:', productosSeleccionados);
      }
    }
  };

  const handleOpenNewVentaModal = () => {
    setIsNewVentasModalOpen(true);
    setProductosSeleccionados([{
      id: '',
      nom_producto: '',
      precio_producto: 0,
      cantidad: 1,
      subtotal: 0,
    }]);
    setSelectedPromocion('');
    setTotal(0);
  };

  const handleCloseNewVentaModal = () => {
    setIsNewVentasModalOpen(false);
    fetchVentasData();
  };

  const handleAddVenta = async (event) => {
    event.preventDefault();
  
    const ventaData = {
      user_id: parseInt(event.target.user_id.value),
      metodo_pago: event.target.metodo_pago.value,
      address_ventas: event.target.address_ventas.value,
    };
  
    try {
      // Primero, crear la venta
      const ventaResponse = await axios.post(`${END_POINT}/ventas`, ventaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
  
      if (ventaResponse.status === 201) {
        console.log('Venta creada:', ventaResponse.data);
        const ventaId = ventaResponse.data.data.id;
  
        // Luego, enviar los detalles de la venta
        const detventaData = {
          detalles: productosSeleccionados.map(prod => ({
            nom_producto: prod.nom_producto,
            pre_producto: prod.precio_producto,
            cantidad: prod.cantidad,
            subtotal: prod.subtotal,
            venta_id: ventaId,
            porcentaje: prod.porcentaje,
            descuento: prod.descuento,
            promocione_id: selectedPromocion ? parseInt(selectedPromocion) : null
          })),
          total: total,
        };
  
        console.log('Datos de detventa a enviar:', detventaData);
  
        const detventaResponse = await axios.post(`${END_POINT}/detventas`, detventaData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          }
        });
  
        if (detventaResponse.status === 201) {
          setVentasData([...ventasData, {...ventaResponse.data.data, detalles: detventaResponse.data}]);
          setFilteredVentasData([...filteredVentasData, {...ventaResponse.data.data, detalles: detventaResponse.data}]);
          handleCloseNewVentaModal();
        } else {
          console.error('Error al agregar detalles de venta:', detventaResponse.data);
        }
      } else {
        console.error('Error al agregar venta:', ventaResponse.data);
      }
    } catch (error) {
      console.error('Error al agregar venta:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.messages) {
        const errorMessages = Object.values(error.response.data.messages).flat();
        alert(errorMessages.join('\n'));
      }
    }
  };


  const handleViewVenta = async (venta) => {
    setSelectedVenta(venta);
    await fetchDetVentaData(venta.id);
    setIsViewVentasModalOpen(true);
  };

  const handleCloseViewVentaModal = () => {
    setIsViewVentasModalOpen(false);
  };

  const handleEditVenta = (venta) => {
    setSelectedVenta(venta);
    setIsEditVentasModalOpen(true);
  };

  const handleCloseEditVentaModal = () => {
    setIsEditVentasModalOpen(false);
    fetchVentasData();
  };

  const handleEditVentaSubmit = async (event) => {
    event.preventDefault();
    const editedVentaData = {
      user_id: event.target.user_id.value,
      metodo_pago: event.target.metodo_pago.value,
      total: event.target.total.value,
      address_ventas: event.target.address_ventas.value,
    };

    try {
      const response = await axios.put(`${END_POINT}/detventas/${selectedVenta.id}`, editedVentaData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });

      if (response.status === 200) {
        setVentasData(ventasData.map(venta => venta.id === selectedVenta.id ? response.data : venta));
        handleCloseEditVentaModal();
      } else {
        console.error('Error al editar venta:', response.data);
      }
    } catch (error) {
      console.error('Error al editar venta:', error.response ? error.response.data : error.message);
    }
  };

  const handleOpenDeleteVentaDialog = (venta) => {
    setSelectedVenta(venta);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteVentaDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedVenta(null);
  };

  const handleDeleteVenta = async () => {
    try {
      const response = await axios.delete(`${END_POINT}/detventas/${selectedVenta.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`    
        }
      });

      if (response.status === 204 || response.status === 200) {
        setVentasData(ventasData.filter(venta => venta.id !== selectedVenta.id));
        handleCloseDeleteVentaDialog();
      } else {
        console.error('Error al eliminar venta:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    }
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Ventas / Verificar Ventas</Typography>
      </Box>

      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} color="primary" onClick={handleOpenNewVentaModal}>
          Nuevo
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
              <TableCell>Direccion</TableCell>
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
                <TableCell>{venta.address_ventas}</TableCell>
                <TableCell>{venta.total}</TableCell>
                <TableCell>{venta.estado}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewVenta(venta)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditVenta(venta)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteVentaDialog(venta)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      

      <Modal open={isNewVentasModalOpen} onClose={handleCloseNewVentaModal}>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    maxHeight: '90vh',
    overflowY: 'auto',
  }}>
    <Typography variant="h6" sx={{ mb: 3 }}>Nueva Venta</Typography>
    <form onSubmit={handleAddVenta}>
      <TextField name="user_id" label="Id Usuario" fullWidth margin="normal" sx={{ mb: 2 }} />
      
      <Select
        name="metodo_pago"
        label="Método de Pago"
        fullWidth
        displayEmpty
        sx={{ mb: 2 }}
        defaultValue=""
      >
        <MenuItem value="" disabled>
          <em>Método de Pago</em>
        </MenuItem>
        <MenuItem value="Efectivo">Efectivo</MenuItem>
        <MenuItem value="T_credito">Tarjeta de crédito</MenuItem>
        <MenuItem value="Nequi">Nequi</MenuItem>
      </Select>

      <TextField type="text" name="address_ventas" label="Dirección" fullWidth margin="normal" sx={{ mb: 2 }} required />
      
      <Select
        value={selectedPromocion}
        onChange={handlePromocionChange}
        fullWidth
        displayEmpty
        sx={{ mb: 3 }}
      >
        <MenuItem value="">
          <em>Seleccionar Promoción (Opcional)</em>
        </MenuItem>
        {promocionesData.map((promocion) => (
          <MenuItem key={promocion.id} value={promocion.id}>
            {promocion.nom_promo}
          </MenuItem>
        ))}
      </Select>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Porcentaje</TableCell>
              <TableCell>Descuento (%)</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productosSeleccionados.map((producto, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Select
                    value={producto.id}
                    onChange={(e) => handleProductChange(index, 'id', e.target.value)}
                    fullWidth
                  >
                    {productos.map((prod) => (
                      <MenuItem key={prod.id} value={prod.id}>
                        {prod.nom_producto}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.precio_producto}
                    onChange={(e) => handleProductChange(index, 'precio_producto', parseFloat(e.target.value))}
                    disabled
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleProductChange(index, 'cantidad', parseInt(e.target.value))}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.porcentaje}
                    onChange={(e) => handleProductChange(index, 'porcentaje', parseFloat(e.target.value))}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={producto.descuento}
                    disabled
                    fullWidth
                  />
                </TableCell>
                <TableCell>{producto.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveProductRow(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button variant="outlined" onClick={handleAddProductRow} startIcon={<Add />}>
          Añadir Producto
        </Button>
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleCloseNewVentaModal} sx={{ mr: 2 }}>Cancelar</Button>
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#E3C800', color: '#fff' }}>
          Guardar Venta
        </Button>
      </Box>
    </form>
  </Box>
</Modal>



      <Modal open={isViewVentasModalOpen} onClose={handleCloseViewVentaModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Información de la Venta</Typography>
          {selectedVenta && (
            <>
              <TableContainer component={Paper} style={styles.tableContainer}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Fecha</TableCell>
                      <TableCell>ID Venta</TableCell>
                      <TableCell>Cédula</TableCell>
                      <TableCell>Metodo Pago</TableCell>
                      <TableCell>Direccion</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Estado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{selectedVenta.created_at}</TableCell>
                      <TableCell>{selectedVenta.id}</TableCell>
                      <TableCell>{selectedVenta.user_id}</TableCell>
                      <TableCell>{selectedVenta.metodo_pago}</TableCell>
                      <TableCell>{selectedVenta.address_ventas}</TableCell>
                      <TableCell>{selectedVenta.total}</TableCell>
                      <TableCell>{selectedVenta.estado}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {detVenta && (
              <TableContainer component={Paper} style={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
               {detVenta.map((detalle, index) => (
                <TableRow key={index}>
                          <TableCell>{detalle.nom_producto}</TableCell>
                          <TableCell>{detalle.pre_producto}</TableCell>
                          <TableCell>{detalle.cantidad}</TableCell>
                          <TableCell>{detalle.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewVentaModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>



      <Modal open={isEditVentasModalOpen} onClose={handleCloseEditVentaModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Venta</Typography>
          {selectedVenta && (
            <form onSubmit={handleEditVentaSubmit}>
              <TextField name="created_at" label="Fecha" fullWidth margin="normal" defaultValue={selectedVenta.created_at} />
              <TextField name="user_id" label="Cédula" fullWidth margin="normal" defaultValue={selectedVenta.user_id} />
             
              <Select id="metodo_pago" name="metodo_pago" fullWidth margin="normal" defaultValue={selectedVenta.metodo_pago}>
                  <MenuItem value="Efectivo">Efectivo</MenuItem>
                  <MenuItem value="T_credito">tarjeta de credito</MenuItem>
                  <MenuItem value="Nequi">Nequi</MenuItem>                  
              </Select>
              <TextField name="address_ventas" label="Direccion" fullWidth margin="normal" defaultValue={selectedVenta.address_ventas} />
              <TextField name="total" label="Total" fullWidth margin="normal" defaultValue={selectedVenta.total} />  

              <Select 
              name="metodo_pago"
              label="Método de Pago"
              fullWidth
              displayEmpty
              sx={{ mb: 2 }}
              defaultValue={selectedVenta.estado}>
              <MenuItem value=""disabled>
                  <em value="Estado">Estado</em> 
              </MenuItem>
              <MenuItem value="Completado">Completado</MenuItem>
                   
              
            
              </Select>             
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditVentaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>




      <Dialog open={isDeleteVentasDialogOpen} onClose={handleCloseDeleteVentaDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la venta con ID {selectedVenta?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteVentaDialog}>Cancelar</Button>
          <Button type="submit" variant="contained" onClick={handleDeleteVenta} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VentasComponent;
