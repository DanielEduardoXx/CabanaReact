import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Select, MenuItem, IconButton, Paper
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

const NuevaVentaModal = ({ isOpen, onClose, onSubmit, productos, promociones }) => {
  const [ventaData, setVentaData] = useState({
    user_id: '',
    metodo_pago: '',
    address_ventas: '',
  });
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [promocionesSeleccionadas, setPromocionesSeleccionadas] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calcularTotal();
  }, [productosSeleccionados, promocionesSeleccionadas]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVentaData({ ...ventaData, [name]: value });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProductos = [...productosSeleccionados];
    updatedProductos[index] = { ...updatedProductos[index], [field]: value };

    if (field === 'id') {
      const selectedProduct = productos.find(p => p.id === value);
      updatedProductos[index] = {
        ...updatedProductos[index],
        nom_producto: selectedProduct.nom_producto,
        precio_producto: selectedProduct.precio_producto,
        cantidad: 1,
        porcentaje: 0,
        descuento: 0,
        subtotal: selectedProduct.precio_producto,
        esPromocion: false
      };
    }

    if (field === 'cantidad' || field === 'porcentaje') {
      const { precio_producto, cantidad, porcentaje } = updatedProductos[index];
      const descuento = (precio_producto * cantidad * porcentaje) / 100;
      const subtotal = precio_producto * cantidad - descuento;
      updatedProductos[index] = {
        ...updatedProductos[index],
        descuento,
        subtotal,
      };
    }

    setProductosSeleccionados(updatedProductos);
  };

  const handlePromocionChange = (event) => {
    const promocionId = event.target.value;
    if (promocionId && !promocionesSeleccionadas.includes(promocionId)) {
      const promocion = promociones.find(p => p.id === promocionId);
      setPromocionesSeleccionadas([...promocionesSeleccionadas, promocionId]);
      
      const nuevosProductos = promocion.detpromociones.map(detPromo => ({
        id: detPromo.producto.id,
        nom_producto: detPromo.producto.nom_producto,
        precio_producto: detPromo.producto.precio_producto,
        cantidad: detPromo.cantidad,
        porcentaje: detPromo.porcentaje,
        descuento: (detPromo.producto.precio_producto * detPromo.cantidad * detPromo.porcentaje) / 100,
        subtotal: detPromo.producto.precio_producto * detPromo.cantidad * (1 - detPromo.porcentaje / 100),
        esPromocion: true,
        promocionId: promocionId
      }));

      setProductosSeleccionados([...productosSeleccionados, ...nuevosProductos]);
    }
  };

  const handleAddProductRow = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      {
        id: '',
        nom_producto: '',
        precio_producto: 0,
        cantidad: 1,
        porcentaje: 0,
        descuento: 0,
        subtotal: 0,
        esPromocion: false
      },
    ]);
  };


  const handleCancel = () => {
    setVentaData({
      user_id: '',
      metodo_pago: '',
      address_ventas: '',
    });
    setProductosSeleccionados([]);
    setPromocionesSeleccionadas([]);
    setTotal(0);
    onClose();
  };
  
  const handleRemoveProductRow = (index) => {
    const removedProduct = productosSeleccionados[index];
    const updatedProductos = productosSeleccionados.filter((_, i) => i !== index);
    setProductosSeleccionados(updatedProductos);
  
    if (removedProduct.esPromocion) {
      const updatedPromociones = promocionesSeleccionadas.filter(id => id !== removedProduct.promocionId);
      setPromocionesSeleccionadas(updatedPromociones);
    }
  };
  

  const calcularTotal = () => {
    const nuevoTotal = productosSeleccionados.reduce((sum, prod) => sum + prod.subtotal, 0);
    setTotal(nuevoTotal);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...ventaData,
      productosSeleccionados,
      promocionesSeleccionadas,
      total
    });
    handleCancel();
  };

  if (!isOpen) return null;  
 
  return (
    
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: 1000,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 4,
      borderRadius: 2,
      maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      <Typography variant="h6" sx={{ mb: 3 }}>Nueva Venta</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="user_id"
          label="Id Usuario"
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
          value={ventaData.user_id}
          onChange={handleInputChange}
        />
        
        <Select
          name="metodo_pago"
          label="Método de Pago"
          fullWidth
          displayEmpty
          sx={{ mb: 2 }}
          value={ventaData.metodo_pago}
          onChange={handleInputChange}
        >
          <MenuItem value="" disabled>
            <em>Método de Pago</em>
          </MenuItem>
          <MenuItem value="Efectivo">Efectivo</MenuItem>
          <MenuItem value="T_credito">Tarjeta de crédito</MenuItem>
          <MenuItem value="Nequi">Nequi</MenuItem>
        </Select>

        <TextField
          type="text"
          name="address_ventas"
          label="Dirección"
          fullWidth
          margin="normal"
          sx={{ mb: 2 }}
          required
          value={ventaData.address_ventas}
          onChange={handleInputChange}
        />
        
        <Select
          value=""
          onChange={handlePromocionChange}
          fullWidth
          displayEmpty
          sx={{ mb: 3 }}
        >
          <MenuItem value="">
            <em>Seleccionar Promoción (Opcional)</em>
          </MenuItem>
          {promociones.map((promocion) => (
            <MenuItem
              key={promocion.id} 
              value={promocion.id}
              disabled={promocionesSeleccionadas.includes(promocion.id)}
            >
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
                <TableCell>Descuento</TableCell>
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
                      disabled={producto.esPromocion}
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
                      onChange={(e) => handleProductChange(index, 'precio_producto', parseInt(e.target.value))}
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
                      disabled={producto.esPromocion}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={producto.porcentaje}
                      onChange={(e) => handleProductChange(index, 'porcentaje', parseInt(e.target.value))}
                      fullWidth
                      disabled={producto.esPromocion}
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
                    <IconButton onClick={() => handleRemoveProductRow(index)} disabled={producto.esPromocion}>
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
          <Button onClick={handleCancel} sx={{ mr: 2 }}>Cancelar</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#E3C800', color: '#fff' }}>
            Guardar Venta
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default NuevaVentaModal;