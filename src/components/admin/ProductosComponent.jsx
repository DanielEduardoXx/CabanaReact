import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
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
  const ProductosComponent = ({ searchQuery }) => {
  const { user } = useContext(MyContext);
  const [productosData, setProductosData] = useState([]);
  const [categoriasData, setCategoriasData] = useState([]);
  const [filteredProductosData, setFilteredProductosData] = useState([]);
  const [isNewProductoModalOpen, setIsNewProductoModalOpen] = useState(false);
  const [isViewProductoModalOpen, setIsViewProductoModalOpen] = useState(false);
  const [isEditProductoModalOpen, setIsEditProductoModalOpen] = useState(false);
  const [isDeleteProductoDialogOpen, setIsDeleteProductoDialogOpen] = useState(false);
  const [isCategoriasModalOpen, setIsCategoriasModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  
  const userSession=JSON.parse(sessionStorage.getItem('user'));
  console.log( "userSession ",userSession);
  const token = userSession?.token?.access_token;
  console.log("hola ",token);

  // Función para obtener los datos de productos  desde la API 
  const fetchProductosData = async () => {
    if (user) {
      try {
        const response = await axios.get(`${END_POINT}/productos`, {
          headers: { 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
        });
      if (response.status === 200) {
        setProductosData(response.data.data);
      } else {
        console.error('Datos de productos no válidos:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de productos:', error);
    }
  } else {
    console.error("Access token no disponible");
  }
};

// Función para obtener los datos de categorías desde la API
const fetchCategoriasData = async () => {
    if (user) {
    try {
      const response = await axios.get(`${END_POINT}/categorias`, {
        headers: { 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
      });

      if (response.status === 200) {
        setCategoriasData(Array.isArray(response.data.data) ? response.data.data : []);
      } else {
        console.error('Datos de categorias no válidos:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de categorías:', error);
    }
  } else {
    console.error("Access token no disponible");
  }
};

  useEffect(() => {
    fetchProductosData();
    fetchCategoriasData();
  }, []);

  //  filtrar los productos según la búsqueda
  useEffect(() => {
    setFilteredProductosData(
      productosData.filter(producto =>
        (producto.id && producto.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (producto.nom_producto && producto.nom_producto.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (producto.precio_producto && producto.precio_producto.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (producto.detalle && producto.detalle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (producto.codigo && producto.codigo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (producto.categoria_id && producto.categoria_id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, productosData]);

  // Función para agregar un nuevo producto
  const handleAddProducto = async (event) => {
    event.preventDefault();
    const newProductosData = {
      id: event.target.id.value,
      nom_producto: event.target.nom_producto.value,
      precio_producto: event.target.precio_producto.value,
      detalle: event.target.detalle.value,
      codigo: event.target.codigo.value,
      categoria_id: event.target.categoria_id.value,
    };

    try {
      const response = await axios.post(`${END_POINT}/productos`, newProductosData, {
        
          headers: { 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
         }
      });

      if (response.status === 201) {
        setProductosData([...productosData, response.data]);
        setFilteredProductosData([...filteredProductosData, response.data]);
        handleCloseNewProductoModal();
      } else {
        console.error('Error al agregar Producto:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar Producto:', error.response ? error.response.data : error.message);
    }
  };

  // Función para editar un producto
  const handleEditProductoSubmit = async (event) => {
    event.preventDefault();
    const editedProductosData = {
      id: event.target.id.value,
      nom_producto: event.target.nom_producto.value,
      precio_producto: event.target.precio_producto.value,
      detalle: event.target.detalle.value,
      codigo: event.target.codigo.value,
      categoria_id: event.target.categoria_id.value,
    };

    try {
      const response = await axios.patch(`${END_POINT}/productos/${selectedProducto.id}`, editedProductosData, {
        headers: { 'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setProductosData(productosData.map(producto => producto.id === editedProductosData.id ? response.data : producto));
        handleCloseEditProductoModal();
      } else {
        console.error('Error al editar cliente:', response.data.data);
      }
    } catch (error) {
      console.error('Error al editar cliente:', error.response ? error.response.data : error.message);
    }
  };

  // Función para eliminar un producto
  const handleDeleteProducto = async () => {
    try {
      const response = await axios.delete(`${END_POINT}/productos/${selectedProducto.id}`, {
        headers: { 'Authorization': `Bearer ${token}`,
         }
      });

      if (response.status === 204 || response.status === 200) {
        setProductosData(productosData.filter(producto => producto.id !== selectedProducto.id));
        handleCloseDeleteProductoDialog();
      } else {
        console.error('Error al eliminar el producto:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar el Producto:', error);
    }
  };

  // Maneja la apertura del modal de nuevo producto
  const handleOpenNewProductoModal = () => {
    setIsNewProductoModalOpen(true);
  };

  // Maneja el cierre del modal de nuevo producto
  const handleCloseNewProductoModal = () => {
    setIsNewProductoModalOpen(false);
    fetchProductosData();
  };

  // Maneja la apertura del modal de visualización de productos
  const handleViewProducto = (producto) => {
    setSelectedProducto(producto);
    setIsViewProductoModalOpen(true);
  };

  // Maneja el cierre del modal de visualización de productos
  const handleCloseViewProductoModal = () => {
    setIsViewProductoModalOpen(false);
  };

  // Maneja la apertura del modal de edición de productos
  const handleEditProducto = (producto) => {
    setSelectedProducto(producto);
    setIsEditProductoModalOpen(true);
  };

  // Maneja el cierre del modal de edición de productos
  const handleCloseEditProductoModal = () => {
    setIsEditProductoModalOpen(false);
    fetchProductosData();
  };

  // Maneja la apertura del diálogo de confirmación de eliminación de productos
  const handleOpenDeleteProductoDialog = (producto) => {
    setSelectedProducto(producto);
    setIsDeleteProductoDialogOpen(true);
  };

  // Maneja el cierre del diálogo de confirmación de eliminación de productos
  const handleCloseDeleteProductoDialog = () => {
    setIsDeleteProductoDialogOpen(false);
    setSelectedProducto(null);
  };

  // Maneja la apertura del modal de categorías
  const handleOpenCategoriasModal = () => {
    setIsCategoriasModalOpen(true);
  };

  // Maneja el cierre del modal de categorías
  const handleCloseCategoriasModal = () => {
    setIsCategoriasModalOpen(false);
  };

  // Maneja la selección de una categoría para mostrar los productos correspondientes
  const handleSelectCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    const productosFiltrados = productosData.filter(producto => producto.categoria_id === categoria.id);
    setFilteredProductosData(productosFiltrados);
    handleCloseCategoriasModal();
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Gestion / Productos</Typography>
      </Box>

      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewProductoModal}>
          Nuevo
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff", marginLeft: '10px' }} onClick={handleOpenCategoriasModal}>
          Categorías
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Producto</TableCell>
              <TableCell>Nombre Producto</TableCell>
              <TableCell>Precio Producto</TableCell>
              <TableCell>Detalle</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>ID Categoría</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProductosData.map((producto, id) => (
              <TableRow key={id}>
                <TableCell>{producto.id}</TableCell>
                <TableCell>{producto.nom_producto}</TableCell>
                <TableCell>{producto.precio_producto}</TableCell>
                <TableCell>{producto.detalle}</TableCell>
                <TableCell>{producto.codigo}</TableCell>
                <TableCell>{producto.categoria_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewProducto(producto)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditProducto(producto)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteProductoDialog(producto)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para nuevo producto */}
      <Modal open={isNewProductoModalOpen} onClose={handleCloseNewProductoModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Nuevo Producto</Typography>
          <form onSubmit={handleAddProducto}>
            <TextField id="nom_producto" label="Nombre" fullWidth margin="normal" />
            <TextField id="detalle" label="Detalle" fullWidth margin="normal" />
            <TextField id="precio_producto" label="Precio" type="number" fullWidth margin="normal" />
            <TextField id="categoria_id" label="ID Categoría" type="number" fullWidth margin="normal" />
            <TextField id="codigo" label="Código" fullWidth margin="normal" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewProductoModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} >
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Modal para visualizar producto */}
      <Modal open={isViewProductoModalOpen} onClose={handleCloseViewProductoModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Producto</Typography>
          {selectedProducto && (
            <>
              <Typography>ID Producto: {selectedProducto.id}</Typography>
              <Typography>Nombre: {selectedProducto.nom_producto}</Typography>
              <Typography>Detalle: {selectedProducto.detalle}</Typography>
              <Typography>Precio: {selectedProducto.precio_producto}</Typography>
              <Typography>ID Categoría: {selectedProducto.categoria_id}</Typography>
              <Typography>Código: {selectedProducto.codigo}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewProductoModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para editar productos */}
      <Modal open={isEditProductoModalOpen} onClose={handleCloseEditProductoModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Producto</Typography>
          {selectedProducto && (
            <form onSubmit={handleEditProductoSubmit}>
              <TextField id="nom_producto" label="Nombre" fullWidth margin="normal" defaultValue={selectedProducto.nom_producto} />
              <TextField id="detalle" label="Detalle" fullWidth margin="normal" defaultValue={selectedProducto.detalle} />
              <TextField id="precio_producto" label="Precio" type="number" fullWidth margin="normal" defaultValue={selectedProducto.precio_producto} />
              <TextField id="categoria_id" label="ID Categoría" type="number" fullWidth margin="normal" defaultValue={selectedProducto.categoria_id} disabled />
              <TextField id="imagen" label="Imagen" fullWidth margin="normal" defaultValue={selectedProducto.imagen} />
              <TextField id="codigo" label="Código" fullWidth margin="normal" defaultValue={selectedProducto.codigo} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditProductoModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} >
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteProductoDialogOpen} onClose={handleCloseDeleteProductoDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el producto {selectedProducto?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteProductoDialog}>Cancelar</Button>
          <Button type="submit" variant="contained" onClick={handleDeleteProducto} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar categorías */}
      <Modal open={isCategoriasModalOpen} onClose={handleCloseCategoriasModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Categorías</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Categoría</TableCell>
                  <TableCell>Nombre</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categoriasData.map((categoria) => (
                  <TableRow key={categoria.id} onClick={() => handleSelectCategoria(categoria)}>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell>{categoria.nombre}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductosComponent;
