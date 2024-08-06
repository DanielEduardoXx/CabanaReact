import React, { useState, useEffect, useContext} from 'react';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { MyContext } from '../../services/MyContext';



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

const CategoriasComponent = ({ searchQuery }) => {
  const { user } = useContext(MyContext);
  const [categoriasData, setCategoriasData] = useState([]);
  const [filteredCategoriasData, setFilteredCategoriasData] = useState([]);
  const [isNewCategoriasModalOpen, setIsNewCategoriasModalOpen] = useState(false);
  const [isViewCategoriasModalOpen, setIsViewCategoriasModalOpen] = useState(false);
  const [isEditCategoriasModalOpen, setIsEditCategoriasModalOpen] = useState(false);
  const [isDeleteCategoriasDialogOpen, setIsDeleteCategoriasDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const fetchCategoriasData = async () => {
    try {
      const response = await axios.get('http://arcaweb.test/api/V1/categorias', {
        headers: { 'Authorization': `Bearer ${user?.accessToken}` }
      });
      if (response.data && Array.isArray(response.data.data)) {
        setCategoriasData(response.data.data);
      } else {
        console.error('Datos de categorías no válidos:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de categorías:', error);
    }
  };

  

  useEffect(() => {
    fetchCategoriasData();
  }, [user]);

  useEffect(() => {
    setFilteredCategoriasData(
      categoriasData.filter(categoria =>
        (categoria.id && categoria.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (categoria.nombre_cat && categoria.nombre_cat.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, categoriasData]);

  const handleAddCategoria = async (event) => {
    event.preventDefault();
    const newCategoriaData = {
      nombre_cat: event.target.nombre_cat.value,
    };

    try {
      const response = await axios.post('http://arcaweb.test/api/V1/categorias', newCategoriaData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
          }
      });

      if (response.status === 201) {
        setCategoriasData([...categoriasData, response.data]);
        setFilteredCategoriasData([...filteredCategoriasData, response.data]);
        handleCloseNewCategoriaModal();
      } else {
        console.error('Error al agregar la categoría:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar la categoría:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditCategoriaSubmit = async (event) => {
    event.preventDefault();
    if (!selectedCategoria) return;
    
    const editedCategoriaData = {
      nombre_cat: event.target.nombre_cat.value,
    };

    try {
      const response = await axios.put(`http://arcaweb.test/api/V1/categorias/${selectedCategoria.id}`, editedCategoriaData, {
        headers: {  'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.accessToken}`
         }
      });

      if (response.status === 200) {
        setCategoriasData(categoriasData.map(categoria => categoria.id === selectedCategoria.id ? response.data : categoria));
        handleCloseEditCategoriaModal();
      } else {
        console.error('Error al editar la categoría:', response.data);
      }
    } catch (error) {
      console.error('Error al editar la categoría:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteCategoria = async () => {
    if (!selectedCategoria) return;

    try {
      const response = await axios.delete(`http://arcaweb.test/api/V1/categorias/${selectedCategoria.id}`, {
        headers: { 'Authorization': `Bearer ${user?.accessToken}` }
      });

      if (response.status === 204 || response.status === 200) {
        setCategoriasData(categoriasData.filter(categoria => categoria.id !== selectedCategoria.id));
        handleCloseDeleteCategoriasDialog();
      } else {
        console.error('Error al eliminar la categoría:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
    }
  };

  const handleOpenNewCategoriaModal = () => {
    setIsNewCategoriasModalOpen(true);
  };

  const handleCloseNewCategoriaModal = () => {
    setIsNewCategoriasModalOpen(false);
    fetchCategoriasData();
  };

  const handleViewCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setIsViewCategoriasModalOpen(true);
  };

  const handleCloseViewCategoriaModal = () => {
    setIsViewCategoriasModalOpen(false);
  };

  const handleEditCategoria = (categoria) => {
    setSelectedCategoria(categoria);
    setIsEditCategoriasModalOpen(true);
  };

  const handleCloseEditCategoriaModal = () => {
    setIsEditCategoriasModalOpen(false);
    fetchCategoriasData();
  };

  const handleOpenDeleteCategoriasDialog = (categoria) => {
    setSelectedCategoria(categoria);
    setIsDeleteCategoriasDialogOpen(true);
  };

  const handleCloseDeleteCategoriasDialog = () => {
    setIsDeleteCategoriasDialogOpen(false);
    setSelectedCategoria(null);
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Categorias</Typography>
      </Box>
      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewCategoriaModal}>
          Nuevo
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategoriasData.map((categoria, id) => (
              <TableRow key={id}>
                <TableCell>{categoria.id}</TableCell>
                <TableCell>{categoria.nombre}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewCategoria(categoria)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditCategoria(categoria)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteCategoriasDialog(categoria)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={isNewCategoriasModalOpen} onClose={handleCloseNewCategoriaModal}>
        <Box sx={styles.modal}>
          <Typography variant="h6">Nueva Categoria</Typography>
          <form onSubmit={handleAddCategoria}>
            <TextField id="nombre_cat" name="nombre_cat" label="Nombre" fullWidth margin="normal" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewCategoriaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal open={isViewCategoriasModalOpen} onClose={handleCloseViewCategoriaModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Categoria</Typography>
          {selectedCategoria && (
            <>
              <Typography>Nombre: {selectedCategoria.nombre_cat}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewCategoriaModal} sx={{ marginRight: 1 }}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={isEditCategoriasModalOpen} onClose={handleCloseEditCategoriaModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Categoria</Typography>
          {selectedCategoria && (
            <form onSubmit={handleEditCategoriaSubmit}>
              <TextField name="nombre_cat" label="Nombre" fullWidth margin="normal" defaultValue={selectedCategoria.nombre_cat} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditCategoriaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      <Dialog open={isDeleteCategoriasDialogOpen} onClose={handleCloseDeleteCategoriasDialog}>
        <DialogTitle>Confirma Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la categoría {selectedCategoria?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteCategoriasDialog}>Cancelar</Button>
          <Button type="submit" variant="contained" onClick={handleDeleteCategoria} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriasComponent;
