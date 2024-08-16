import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Select, MenuItem
} from '@mui/material';
import { Visibility, Edit, Delete, Add } from '@mui/icons-material';
import { MyContext } from '../../services/MyContext';

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
    width: '900px',
    backgroundColor: 'white',
    padding: '3rem',
    boxShadow: 24,
  },
};

const PromocionesComponent = ({ searchQuery }) => {
  const { user } = useContext(MyContext);
  const [promocionesData, setPromocionesData] = useState([]);
  const [filteredPromocionesData, setFilteredPromocionesData] = useState([]);
  const [isNewPromocionModalOpen, setIsNewPromocionModalOpen] = useState(false);
  const [isViewPromocionModalOpen, setIsViewPromocionModalOpen] = useState(false);
  const [isEditPromocionModalOpen, setIsEditPromocionModalOpen] = useState(false);
  const [isDeletePromocionDialogOpen, setIsDeletePromocionDialogOpen] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);
  const [productos, setProductos] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([{
    id: '',
    nom_producto: '',
    precio_producto: 0,
    cantidad: 1,
    descuento: 0,
    subtotal: 0,
  }]);

  const userSession = JSON.parse(sessionStorage.getItem('user'));
  const token = userSession?.token?.access_token;

  // Función para obtener los datos de las promociones y productos
  const fetchPromocionesData = async () => {
    if (!user) {
      console.error("Access token no disponible");
      return;
    }

    try {
      const response = await axios.get('http://arcaweb.test/api/V1/promociones?included=detpromociones.producto', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('Data obtenidas de la API:', response.data.data);
      if (response.status === 200) {
        setPromocionesData(response.data.data);
      } else {
        console.error('Datos de categorías no válidos:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de categorías:', error);
    }
  };

  // Función para obtener los datos de los productos
  const fetchProductosData = async () => {
    try {
      const response = await axios.get('http://arcaweb.test/api/V1/productos', {
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

  useEffect(() => {
    fetchPromocionesData();
    fetchProductosData();
  }, []);

  // Función para filtrar las promociones según la búsqueda
  useEffect(() => {
    setFilteredPromocionesData(
      promocionesData.filter(promocion =>
        (promocion.id && promocion.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (promocion.nom_promo && promocion.nom_promo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (promocion.total_promo && promocion.total_promo.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, promocionesData]);

  // Función para calcular el subtotal
  const calcularSubtotal = (precio, cantidad, descuento) => {
    const descuentoMonto = (precio * cantidad) * (descuento / 100);
    return (precio * cantidad) - descuentoMonto;
  };

  // Función para manejar la selección de productos
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
      }

      if (field === 'cantidad' || field === 'descuento' || field === 'precio_producto') {
        newState[index].subtotal = calcularSubtotal(
          newState[index].precio_producto,
          newState[index].cantidad,
          newState[index].descuento
        );
      }
      return newState;
    });
  };

  const handleOpenNewPromocionModal = () => {
    setIsNewPromocionModalOpen(true);
    setProductosSeleccionados([{
      id: '',
      nom_producto: '',
      precio_producto: 0,
      cantidad: 1,
      descuento: 0,
      subtotal: 0,
    }]);
  };

  const handleCloseNewPromocionModal = () => {
    setIsNewPromocionModalOpen(false);
    setProductosSeleccionados([]);
  };

  const handleAddProductRow = () => {
    setProductosSeleccionados((prevState) => [
      ...prevState,
      {
        id: '',
        nom_producto: '',
        precio_producto: 0,
        cantidad: 1,
        descuento: 0,
        subtotal: 0,
      },
    ]);
  };

  // Función para agregar una nueva promoción
  const handleAddPromocion = async (event) => {
    event.preventDefault();
  
    const nuevaPromocion = {
      nom_promo: event.target.nom_promo.value,
      total_promo: productosSeleccionados.reduce((total, prod) => total + prod.subtotal, 0),
      categoria_id: 5,
    };
    try {
      // Enviar la solicitud para crear la promoción principal
      const response = await axios.post('http://arcaweb.test/api/V1/promociones', nuevaPromocion, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 201) {
        
        const promocionId = response.data.data.id
        //console.log( response.data.data.id)
       
  
        // Crear los detalles de la promoción
        const detalles = productosSeleccionados.map((prod) => ({
          cantidad: prod.cantidad,
          descuento: prod.descuento,
          subtotal: prod.subtotal,
          promocione_id: promocionId,
          producto_id: prod.id,
        }));
        console.log()



        
        await axios.post('http://arcaweb.test/api/V1/detpromociones', { detalles }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        await fetchPromocionesData(); // Actualizar la lista de promociones
        handleCloseNewPromocionModal();
      } else {
        console.error('Error al agregar la promoción:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar la promoción:', error.response ? error.response.data : error.message);
    }
  };
  




  const handleEditPromocionSubmit = async (event) => {
    event.preventDefault();
  
    const promocionActualizada = {
      nom_promo: event.target.nom_promo.value,
      total_promo: productosSeleccionados.reduce((total, prod) => total + prod.subtotal, 0),
    };
  
    try {
      // Enviar la solicitud para actualizar la promoción principal
      const responsePromocion = await axios.put(`http://arcaweb.test/api/V1/promociones/${selectedPromocion.id}`, promocionActualizada, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (responsePromocion.status === 200) {
        const detalles = productosSeleccionados.map((prod) => ({
          id: prod.detalle_id, // Debe ser el ID correcto del detalle
          cantidad: prod.cantidad,
          descuento: prod.descuento,
          subtotal: prod.subtotal,
          producto_id: prod.id,
        }));
  
        // Crear un array de promesas para cada detalle
        const updatePromises = detalles.map((detalle) => axios.put(`http://arcaweb.test/api/V1/detpromociones/${detalle.id}`, { detalles: [detalle] }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }));
  
        // Esperar a que todas las promesas se resuelvan
        await Promise.all(updatePromises);
  
        await fetchPromocionesData(); // Actualizar la lista de promociones
        handleCloseEditPromocionModal();
      } else {
        console.error('Error al editar la promoción:', responsePromocion.data);
      }
    } catch (error) {
      console.error('Error al editar la promoción:', error.response ? error.response.data : error.message);
    }
  };
  
  





  const handleDeletePromocion = async () => {
    try {
      //  eliminar la promoción
      const response = await axios.delete(`http://arcaweb.test/api/V1/promociones/${selectedPromocion.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 204 || response.status === 200) {
        await fetchPromocionesData(); // Actualizar la lista de promociones
        handleCloseDeletePromocionesDialog();
      } else {
        console.error('Error al eliminar la promoción:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar la promoción:', error.response ? error.response.data : error.message);
    }
  };

  // Funciones para manejar la visualización, edición y eliminación de promociones
  const handleViewPromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setIsViewPromocionModalOpen(true);
  };

  const handleCloseViewPromocionModal = () => {
    setIsViewPromocionModalOpen(false);
  };

  const handleEditPromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setIsEditPromocionModalOpen(true);
    setProductosSeleccionados(promocion.detpromociones.map(det => ({
      ...det.producto,
      cantidad: det.cantidad,
      descuento: det.descuento,
      subtotal: det.subtotal,
      detalle_id: det.id, // Agregar el id de detalle para referencia
    })));
  };

  const handleCloseEditPromocionModal = () => {
    setIsEditPromocionModalOpen(false);
    setProductosSeleccionados([]);
  };

  const handleOpenDeletePromocionesDialog = (promocion) => {
    setSelectedPromocion(promocion);
    setIsDeletePromocionDialogOpen(true);
  };

  const handleCloseDeletePromocionesDialog = () => {
    setIsDeletePromocionDialogOpen(false);
    setSelectedPromocion(null);
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Gestion / Promociones</Typography>
      </Box>

      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewPromocionModal}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Promoción</TableCell>
              <TableCell>Nombre Promoción</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPromocionesData.map((promocion) => (
              <TableRow key={promocion.id}>
                <TableCell>{promocion.id}</TableCell>
                <TableCell>{promocion.nom_promo}</TableCell>
                <TableCell>{promocion.total_promo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewPromocion(promocion)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditPromocion(promocion)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeletePromocionesDialog(promocion)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para nueva promoción */}
      <Modal open={isNewPromocionModalOpen} onClose={handleCloseNewPromocionModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Nueva Promoción</Typography>
          <form onSubmit={handleAddPromocion}>
            <TextField
              id="nom_promo"
              label="Nombre de la Promoción"
              fullWidth
              margin="normal"
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Descuento (%)</TableCell>
                  <TableCell>Subtotal</TableCell>
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
                        value={producto.descuento}
                        onChange={(e) => handleProductChange(index, 'descuento', parseFloat(e.target.value))}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>{producto.subtotal.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
              <Button variant="outlined" onClick={handleAddProductRow} startIcon={<Add />}>
                Añadir Producto
              </Button>
              <Box>
                <Button onClick={handleCloseNewPromocionModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Modal para visualizar promoción */}
      <Modal open={isViewPromocionModalOpen} onClose={handleCloseViewPromocionModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Promoción</Typography>
          {selectedPromocion && (
            <>
              <Typography>ID Promoción: {selectedPromocion.id}</Typography>
              <Typography>Nombre Promoción: {selectedPromocion.nom_promo}</Typography>
              <Typography>Total: {selectedPromocion.total_promo}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Descuento</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedPromocion.detpromociones.map((detalle) => (
                    <TableRow key={detalle.id}>
                      <TableCell>{detalle.producto.nom_producto}</TableCell>
                      <TableCell>{detalle.producto.precio_producto}</TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{detalle.descuento}</TableCell>
                      <TableCell>{detalle.subtotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewPromocionModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para editar promoción */}
      <Modal open={isEditPromocionModalOpen} onClose={handleCloseEditPromocionModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Promoción</Typography>
          {selectedPromocion && (
            <form onSubmit={handleEditPromocionSubmit}>
              <TextField
                id="nom_promo"
                label="Nombre de la Promoción"
                defaultValue={selectedPromocion.nom_promo}
                fullWidth
                margin="normal"
              />
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Descuento (%)</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosSeleccionados.map((producto, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={producto.id}
                          onChange={(e) => handleProductChange(index, 'id', e.target.value)}
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
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={producto.cantidad}
                          onChange={(e) => handleProductChange(index, 'cantidad', parseInt(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={producto.descuento}
                          onChange={(e) => handleProductChange(index, 'descuento', parseFloat(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>{producto.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                <Button variant="outlined" onClick={handleAddProductRow} startIcon={<Add />}>
                  Añadir Producto
                </Button>
                <Box>
                  <Button onClick={handleCloseEditPromocionModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                    Guardar
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeletePromocionDialogOpen} onClose={handleCloseDeletePromocionesDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la promoción con ID {selectedPromocion?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeletePromocionesDialog}>Cancelar</Button>
          <Button type="submit" variant="contained" onClick={handleDeletePromocion} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromocionesComponent;
