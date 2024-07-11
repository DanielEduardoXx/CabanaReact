import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';

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

const MateriaPrimaComponent = ({ searchQuery }) => {
  const [materiaPrimaData, setMateriaPrimaData] = useState([]);
  const [filteredMateriaPrimaData, setFilteredMateriaPrimaData] = useState([]);
  const [isNewMateriaPrimaModalOpen, setIsNewMateriaPrimaModalOpen] = useState(false);
  const [isViewMateriaPrimaModalOpen, setIsViewMateriaPrimaModalOpen] = useState(false);
  const [isEditMateriaPrimaModalOpen, setIsEditMateriaPrimaModalOpen] = useState(false);
  const [isDeleteMateriaPrimaDialogOpen, setIsDeleteMateriaPrimaDialogOpen] = useState(false);
  const [selectedMateriaPrima, setSelectedMateriaPrima] = useState(null);
  const [entrada, setEntrada] = useState(0);
  const [salida, setSalida] = useState(0);

  const fetchMateriaPrimaData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/V1/matprimas');
      if (response.data && Array.isArray(response.data)) {
        setMateriaPrimaData(response.data);
      } else {
        console.error('Datos de clientes no válidos:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de clientes:', error);
    }
  };

  useEffect(() => {
    fetchMateriaPrimaData();
  }, []);

  useEffect(() => {
    setFilteredMateriaPrimaData(
      materiaPrimaData.filter(materiaPrima =>
        (materiaPrima.id && materiaPrima.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (materiaPrima.referencia && materiaPrima.referencia.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (materiaPrima.descripcion && materiaPrima.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (materiaPrima.existencia && materiaPrima.existencia.toString().includes(searchQuery)) ||
        (materiaPrima.entrada && materiaPrima.entrada.toString().includes(searchQuery.toLowerCase())) ||
        (materiaPrima.salida && materiaPrima.salida.toString().includes(searchQuery)) ||
        (materiaPrima.stock && materiaPrima.stock.toString().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, materiaPrimaData]);

  const handleAddMateriaPrima = async (event) => {
    event.preventDefault();
    const entrada = parseFloat(event.target.entrada.value);
    const salida = parseFloat(event.target.salida.value);
    const stock = entrada - salida;

    const newMateriaPrimaData = {
      id: event.target.id.value,
      referencia: event.target.referencia.value,
      descripcion: event.target.descripcion.value,
      existencia: event.target.existencia.value,
      entrada: entrada,
      salida: salida,
      stock: stock,
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/V1/matprimas', newMateriaPrimaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        setMateriaPrimaData([...materiaPrimaData, response.data]);
        setFilteredMateriaPrimaData([...filteredMateriaPrimaData, response.data]);
        handleCloseNewMateriaPrimaModal();
      } else {
        console.error('Error al agregar la materia prima :', response.data);
      }
    } catch (error) {
      console.error('Error al agregar la materia prima:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditMateriaPrimaSubmit = async (event) => {
    event.preventDefault();
    const entrada = parseFloat(event.target.entrada.value);
    const salida = parseFloat(event.target.salida.value);
    const stock = entrada - salida;

    const editedMateriaPrimaData = {
      id: event.target.id.value,
      referencia: event.target.referencia.value,
      descripcion: event.target.descripcion.value,
      existencia: event.target.existencia.value,
      entrada: entrada,
      salida: salida,
      stock: stock,
    };

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/V1/matprimas/${selectedMateriaPrima.id}`, editedMateriaPrimaData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setMateriaPrimaData(materiaPrimaData.map(materiaPrima => materiaPrima.id === editedMateriaPrimaData.id ? response.data : materiaPrima));
        handleCloseEditMateriaPrimaModal();
      } else {
        console.error('Error al editar la materia prima:', response.data);
      }
    } catch (error) {
      console.error('Error al editar la materia prima:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteMateriaPrima = async () => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/V1/matprimas/${selectedMateriaPrima.id}`);
      if (response.status === 204 || response.status === 200) {
        setMateriaPrimaData(materiaPrimaData.filter(materiaPrima => materiaPrima.id !== selectedMateriaPrima.id));
        handleCloseDeleteMateriaPrimaDialog();
      } else {
        console.error('Error al eliminar materia prima:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar materia prima:', error);
    }
  };

  const handleOpenNewMateriaPrimaModal = () => {
    setIsNewMateriaPrimaModalOpen(true);
  };

  const handleCloseNewMateriaPrimaModal = () => {
    setIsNewMateriaPrimaModalOpen(false);
    fetchMateriaPrimaData();
  };

  const handleViewMateriaPrima = (materiaPrima) => {
    setSelectedMateriaPrima(materiaPrima);
    setIsViewMateriaPrimaModalOpen(true);
  };

  const handleCloseViewMateriaPrimaModal = () => {
    setIsViewMateriaPrimaModalOpen(false);
  };

  const handleEditMateriaPrima = (materiaPrima) => {
    setSelectedMateriaPrima(materiaPrima);
    setEntrada(materiaPrima.entrada);
    setSalida(materiaPrima.salida);
    setIsEditMateriaPrimaModalOpen(true);
  };

  const handleCloseEditMateriaPrimaModal = () => {
    setIsEditMateriaPrimaModalOpen(false);
    fetchMateriaPrimaData();
  };

  const handleOpenDeleteMateriaPrimaDialog = (materiaPrima) => {
    setSelectedMateriaPrima(materiaPrima);
    setIsDeleteMateriaPrimaDialogOpen(true);
  };

  const handleCloseDeleteMateriaPrimaDialog = () => {
    setIsDeleteMateriaPrimaDialogOpen(false);
    setSelectedMateriaPrima(null);
  };

  const handleEntradaChange = (event) => {
    setEntrada(parseFloat(event.target.value));
  };

  const handleSalidaChange = (event) => {
    setSalida(parseFloat(event.target.value));
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Gestion / Materia Prima</Typography>
      </Box>

      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewMateriaPrimaModal}>
          Nuevo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Referencia</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Entrada</TableCell>
              <TableCell>Salida</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materiaPrimaData.map((materiaPrima, id) => (
              <TableRow key={id}>
                <TableCell>{materiaPrima.id}</TableCell>
                <TableCell>{materiaPrima.referencia}</TableCell>
                <TableCell>{materiaPrima.descripcion}</TableCell>
                <TableCell>{materiaPrima.entrada}</TableCell>
                <TableCell>{materiaPrima.salida}</TableCell>
                <TableCell>{materiaPrima.stock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewMateriaPrima(materiaPrima)} style={styles.tableButton}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditMateriaPrima(materiaPrima)} style={styles.tableButton}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteMateriaPrimaDialog(materiaPrima)} style={styles.tableButton}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para nueva materia prima */}
      <Modal open={isNewMateriaPrimaModalOpen} onClose={handleCloseNewMateriaPrimaModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Nueva Materia Prima</Typography>
          <form onSubmit={handleAddMateriaPrima}>
            <TextField id="referencia" label="Referencia" fullWidth margin="normal" required />
            <TextField id="descripcion" label="Descripción" fullWidth margin="normal" required />
            <TextField id="existencia" label="Existencia" type="number" fullWidth margin="normal" required />
            <TextField id="entrada" label="Entrada" type="number" fullWidth margin="normal" required onChange={handleEntradaChange} />
            <TextField id="salida" label="Salida" type="number" fullWidth margin="normal" required onChange={handleSalidaChange} />
            <TextField id="stock" label="Stock" type="number" fullWidth margin="normal" disabled value={entrada - salida} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewMateriaPrimaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} >
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Modal para visualizar materia prima */}
      <Modal open={isViewMateriaPrimaModalOpen} onClose={handleCloseViewMateriaPrimaModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Materia Prima</Typography>
          {selectedMateriaPrima && (
            <>
              <Typography>Código: {selectedMateriaPrima.id}</Typography>
              <Typography>Referencia: {selectedMateriaPrima.referencia}</Typography>
              <Typography>Descripción: {selectedMateriaPrima.descripcion}</Typography>
              <Typography>Existencia: {selectedMateriaPrima.existencia}</Typography>
              <Typography>Entrada: {selectedMateriaPrima.entrada}</Typography>
              <Typography>Salida: {selectedMateriaPrima.salida}</Typography>
              <Typography>Stock: {selectedMateriaPrima.stock}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewMateriaPrimaModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal para editar materia prima */}
      <Modal open={isEditMateriaPrimaModalOpen} onClose={handleCloseEditMateriaPrimaModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Materia Prima</Typography>
          {selectedMateriaPrima && (
            <form onSubmit={handleEditMateriaPrimaSubmit}>
              <TextField id="referencia" label="Referencia" fullWidth margin="normal" defaultValue={selectedMateriaPrima.referencia} required />
              <TextField id="descripcion" label="Descripción" fullWidth margin="normal" defaultValue={selectedMateriaPrima.descripcion} required />
              <TextField id="existencia" label="Existencia" type="number" fullWidth margin="normal" defaultValue={selectedMateriaPrima.existencia} required />
              <TextField id="entrada" label="Entrada" type="number" fullWidth margin="normal" defaultValue={selectedMateriaPrima.entrada} onChange={handleEntradaChange} required />
              <TextField id="salida" label="Salida" type="number" fullWidth margin="normal" defaultValue={selectedMateriaPrima.salida} onChange={handleSalidaChange} required />
              <TextField id="stock" label="Stock" type="number" fullWidth margin="normal" disabled value={entrada - salida} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditMateriaPrimaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} >
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteMateriaPrimaDialogOpen} onClose={handleCloseDeleteMateriaPrimaDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la materia prima con ID {selectedMateriaPrima?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteMateriaPrimaDialog}>Cancelar</Button>
          <Button onClick={handleDeleteMateriaPrima} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MateriaPrimaComponent;
