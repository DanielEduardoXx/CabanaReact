import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

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
const PromocionesComponent = ({ searchQuery }) => {
  const [promocionesData, setPromocionesData] = useState([]);
  const [filteredPromocionesData, setFilteredPromocionesData] = useState([]);
  const [isNewPromocionModalOpen, setIsNewPromocionModalOpen] = useState(false);
  const [isViewPromocionModalOpen, setIsViewPromocionModalOpen] = useState(false);
  const [isEditPromocionModalOpen, setIsEditPromocionModalOpen] = useState(false);
  const [isDeletePromocionesDialogOpen, setIsDeletePromocionDialogOpen] = useState(false);
  const [selectedPromocion, setSelectedPromocion] = useState(null);

  // Función para obtener los datos de las promociones desde la API al cargar el componente
  const fetchPromocionesData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/V1/promociones');
      if (response.data && Array.isArray(response.data)) {
        setPromocionesData(response.data);
      } else {
        console.error('Datos de promociones no válidos:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de promociones:', error);
    }
  };

  useEffect(() => {
    fetchPromocionesData();
  }, []);

  // Función para filtrar las promociones según la búsqueda
  useEffect(() => {
    setFilteredPromocionesData(
      promocionesData.filter(promocion =>
        (promocion.id && promocion.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (promocion.nom_promo && promocion.nom_promo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (promocion.total_promo && promocion.total_promo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (promocion.categoria_id && promocion.categoria_id.toString().includes(searchQuery))
      )
    );
  }, [searchQuery, promocionesData]);

  // Función para agregar una nueva promoción
  const handleAddPromocion = async (event) => {
    event.preventDefault();
    const newPromocionesData = {
      nom_promo: event.target.nom_promo.value,
      total_promo: event.target.total_promo.value,
      categoria_id: event.target.categoria_id.value,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/V1/promociones', newPromocionesData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setPromocionesData([...promocionesData, response.data]);
        setFilteredPromocionesData([...filteredPromocionesData, response.data]);
        handleCloseNewPromocionModal();
      } else {
        console.error('Error al agregar la promoción:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar la promoción:', error.response ? error.response.data : error.message);
    }
  };

  // Función para editar una promoción
  const handleEditPromocionSubmit = async (event) => {
    event.preventDefault();
    const editedPromocionesData = {
      nom_promo: event.target.nom_promo.value,
      total_promo: event.target.total_promo.value,
      categoria_id: event.target.categoria_id.value,
    };

    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/V1/promociones/${selectedPromocion.id}`, editedPromocionesData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPromocionesData(promocionesData.map(promocion => promocion.id === selectedPromocion.id ? response.data : promocion));
        setFilteredPromocionesData(filteredPromocionesData.map(promocion => promocion.id === selectedPromocion.id ? response.data : promocion));
        handleCloseEditPromocionModal();
      } else {
        console.error('Error al editar promoción:', response.data);
      }
    } catch (error) {
      console.error('Error al editar promoción:', error.response ? error.response.data : error.message);
    }
  };

  // Función para eliminar una promoción
  const handleDeletePromocion = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/V1/promociones/${selectedPromocion.id}`);
      if (response.status === 204 || response.status === 200) {
        setPromocionesData(promocionesData.filter(promocion => promocion.id !== selectedPromocion.id));
        setFilteredPromocionesData(filteredPromocionesData.filter(promocion => promocion.id !== selectedPromocion.id));
        handleCloseDeletePromocionesDialog();
      } else {
        console.error('Error al eliminar promoción:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar promoción:', error);
    }
  };

  // Maneja la apertura del modal de nueva promoción
  const handleOpenNewPromocionModal = () => {
    setIsNewPromocionModalOpen(true);
  };

  // Maneja el cierre del modal de nueva promoción
  const handleCloseNewPromocionModal = () => {
    setIsNewPromocionModalOpen(false);
    fetchPromocionesData();
  };

  // Maneja la apertura del modal de visualización de promociones
  const handleViewPromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setIsViewPromocionModalOpen(true);
  };

  // Maneja el cierre del modal de visualización de promociones
  const handleCloseViewPromocionModal = () => {
    setIsViewPromocionModalOpen(false);
  };

  // Maneja la apertura del modal de edición de promociones
  const handleEditPromocion = (promocion) => {
    setSelectedPromocion(promocion);
    setIsEditPromocionModalOpen(true);
  };

  // Maneja el cierre del modal de edición de promociones
  const handleCloseEditPromocionModal = () => {
    setIsEditPromocionModalOpen(false);
    fetchPromocionesData();
  };

  // Maneja la apertura del diálogo de confirmación de eliminación de promociones
  const handleOpenDeletePromocionesDialog = (promocion) => {
    setSelectedPromocion(promocion);
    setIsDeletePromocionDialogOpen(true);
  };

  // Maneja el cierre del diálogo de confirmación de eliminación de promociones
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
              <TableCell>Id Categoria</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPromocionesData.map((promocion) => (
              <TableRow key={promocion.id}>
                <TableCell>{promocion.id}</TableCell>
                <TableCell>{promocion.nom_promo}</TableCell>
                <TableCell>{promocion.total_promo}</TableCell>
                <TableCell>{promocion.categoria_id}</TableCell>
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
            <TextField id="nom_promo" label="Nombre Promoción" type="text" fullWidth margin="normal" />
            <TextField id="total_promo" label="Total" type="number" fullWidth margin="normal" />
            <TextField id="categoria_id" label="Id Categoria" type="number" fullWidth margin="normal" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewPromocionModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                Guardar
              </Button>
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
              <Typography>Id Categoria: {selectedPromocion.categoria_id}</Typography>
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
              <TextField id="nom_promo" label="Nombre Promoción" fullWidth margin="normal" defaultValue={selectedPromocion.nom_promo} />
              <TextField id="total_promo" label="Total" fullWidth margin="normal" defaultValue={selectedPromocion.total_promo} />
              <TextField id="categoria_id" label="Id Categoria" fullWidth margin="normal" defaultValue={selectedPromocion.categoria_id} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditPromocionModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeletePromocionesDialogOpen} onClose={handleCloseDeletePromocionesDialog}>
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
