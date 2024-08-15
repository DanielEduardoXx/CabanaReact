import React, { useState, useEffect, useContext } from 'react';
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

  const SugerenciasComponent = ({ searchQuery }) => {
  const { user } = useContext(MyContext);
  const [sugerenciasData, setSugerenciasData] = useState([]);
  const [filteredSugerenciasData, setFilteredSugerenciasData] = useState([]);
  const [isNewSugerenciasModalOpen, setIsNewSugerenciasModalOpen] = useState(false);
  const [isViewSugerenciasModalOpen, setIsViewSugerenciasModalOpen] = useState(false);
  const [isEditSugerenciasModalOpen, setIsEditSugerenciasModalOpen] = useState(false);
  const [isDeleteSugerenciasDialogOpen, setIsDeleteSugerenciasDialogOpen] = useState(false);
  const [selectedSugerencia, setSelectedSugerencia] = useState(null);

  const userSession=JSON.parse(sessionStorage.getItem('user'));
  console.log( "userSession ",userSession);
  const token = userSession?.token?.access_token;
  console.log("hola ",token);

  const fetchSugerenciasData = async () => {
    if (user) {
    try {
      const response = await axios.get('http://arcaweb.test/api/V1/pqrs', {
        headers: { 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
      });
      if (response.status === 200) {
        setSugerenciasData(response.data.data);
      } else {
        console.error('Datos de sugerencias no válidos:', response.data.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de sugerencias:', error);
    }
  } else {
    console.error("Access token no disponible");
  }
};

  useEffect(() => {
    fetchSugerenciasData();
  }, []);

  useEffect(() => {
    setFilteredSugerenciasData(
      sugerenciasData.filter(sugerencia =>
        (sugerencia.id && sugerencia.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sugerencia.user_id && sugerencia.user_id.toString().toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, sugerenciasData]);

  const handleAddSugerencia = async (event) => {
    event.preventDefault();
    const newSugerenciaData = {
     
      sugerencia: event.target.sugerencia.value,
      tipo_suge: event.target.tipo_suge.value,
      estado: event.target.estado.value,
      user_id: event.target.user_id.value,
    };

    try {
      const response = await axios.post('http://arcaweb.test/api/V1/pqrs', newSugerenciaData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  
        }
      });

      if (response.status === 200) {
        setSugerenciasData([...sugerenciasData, response.data]);
        setFilteredSugerenciasData([...filteredSugerenciasData, response.data]);
        handleCloseNewSugerenciaModal();
      } else {
        console.error('Error al agregar la Sugerencia:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar la Sugerencia:', error.response ? error.response.data : error.message);
    }
  };




  const handleEditSugerenciaSubmit = async (event) => {
    event.preventDefault();
    const editedSugerenciaData = {

      sugerencia: event.target.sugerencia.value,
      tipo_suge: event.target.tipo_suge.value,
      estado: event.target.estado.value,
      user_id: event.target.user_id.value,
    };

    try {
      const response = await axios.patch(`http://arcaweb.test/api/V1/pqrs/${selectedSugerencia.id}`, editedSugerenciaData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  
        }
      });

      if (response.status === 200) {
        setSugerenciasData(sugerenciasData.map(sugerencia => sugerencia.id === editedSugerenciaData.id ? response.data.data : sugerencia));
        handleCloseEditSugerenciaModal();
      } else {
        console.error('Error al editar la Sugerencia:', response.data);
      }
    } catch (error) {
      console.error('Error al editar la Sugerencia:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteSugerencia = async () => {
    if (!selectedSugerencia) return;

    try {
      const response = await axios.delete(`http://arcaweb.test/api/V1/pqrs/${selectedSugerencia.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`           
        }
      });
      if (response.status === 204 || response.status === 200) {
        setSugerenciasData(sugerenciasData.filter(sugerencia => sugerencia.id !== selectedSugerencia.id));
        handleCloseDeleteSugerenciaDialog();
      } else {
        console.error('Error al eliminar la Sugerencia:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar la Sugerencia:', error);
    }
  };

  const handleOpenNewSugerenciaModal = () => setIsNewSugerenciasModalOpen(true);

  const handleCloseNewSugerenciaModal = () => {setIsNewSugerenciasModalOpen(false); fetchSugerenciasData();}


  
  const handleViewSugerencia = (sugerencia) => { setSelectedSugerencia(sugerencia); setIsViewSugerenciasModalOpen(true);};

  const handleCloseViewSugerenciaModal = () => setIsViewSugerenciasModalOpen(false);
  


  const handleEditSugerencia = (sugerencia) => {setSelectedSugerencia(sugerencia); setIsEditSugerenciasModalOpen(true); };

  const handleCloseEditSugerenciaModal = () => {setIsEditSugerenciasModalOpen(false); fetchSugerenciasData();}



  const handleOpenDeleteSugerenciaDialog = (sugerencia) => {setSelectedSugerencia(sugerencia); setIsDeleteSugerenciasDialogOpen(true)};

  const handleCloseDeleteSugerenciaDialog = () => {setIsDeleteSugerenciasDialogOpen(false);setSelectedSugerencia(null);};



  return (
    <Box sx={styles.mainBox}>
      <Box sx={styles.subBox}>
        <Typography variant="h6">Sugerencias</Typography>
      </Box>
      <Box sx={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewSugerenciaModal}>
          Nuevo
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Tipo sugerencia</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Id Usuario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            {filteredSugerenciasData.map((sugerencia,id) => (
              <TableRow key={id}>
                <TableCell>{sugerencia.id}</TableCell>
                <TableCell>{sugerencia.tipo_suge}</TableCell>
                <TableCell>{sugerencia.estado}</TableCell>
                <TableCell>{sugerencia.user_id}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewSugerencia(sugerencia)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditSugerencia(sugerencia)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteSugerenciaDialog(sugerencia)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>



      <Modal open={isNewSugerenciasModalOpen} onClose={handleCloseNewSugerenciaModal}>
        <Box sx={styles.modal}>
          <Typography variant="h6">Nueva Sugerencia</Typography>
          <form onSubmit={handleAddSugerencia}>
            <TextField id="sugerencia" label="Sugerencia" fullWidth margin="normal" />
            <TextField id="tipo_suge" label="Tipo Sugerencia" fullWidth margin="normal" />
            <TextField id="estado" label="Estado" fullWidth margin="normal" />
            <TextField id="user_id" label="ID Usuario" fullWidth margin="normal" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewSugerenciaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>


      <Modal open={isViewSugerenciasModalOpen} onClose={handleCloseViewSugerenciaModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Sugerencia</Typography>
          {selectedSugerencia && (
            <>
              <Typography>Id: {selectedSugerencia.id}</Typography>
              <Typography>Sugerencia: {selectedSugerencia.sugerencia}</Typography>
              <Typography>Tipo Sugerencia: {selectedSugerencia.tipo_suge}</Typography>
              <Typography>Estado: {selectedSugerencia.estado}</Typography>
              <Typography>Id Usuario: {selectedSugerencia.user_id}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewSugerenciaModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>


      <Modal open={isEditSugerenciasModalOpen} onClose={handleCloseEditSugerenciaModal}>
        <Box sx={styles.modal}>
          <Typography variant="h6">Editar Sugerencia</Typography>
          {selectedSugerencia && (
            <form onSubmit={handleEditSugerenciaSubmit}>
              <TextField id="sugerencia" label="Sugerencia" fullWidth margin="normal" defaultValue={selectedSugerencia.sugerencia} disabled />
              <TextField id="tipo_suge"label="Tipo Sugerencia" fullWidth margin="normal" defaultValue={selectedSugerencia.tipo_suge} disabled />
              <TextField id="estado"label="Estado" fullWidth margin="normal" defaultValue={selectedSugerencia.estado} />
              <TextField id="user_id"label="Id Usuario" fullWidth margin="normal" defaultValue={selectedSugerencia.user_id} disabled/>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditSugerenciaModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>



      <Dialog open={isDeleteSugerenciasDialogOpen} onClose={handleCloseDeleteSugerenciaDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar la sugerencia con ID {selectedSugerencia?.id}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteSugerenciaDialog}>Cancelar</Button>
          <Button onClick={handleDeleteSugerencia} sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SugerenciasComponent;
