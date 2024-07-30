import React, { useState, useEffect } from 'react';
import {
  Paper, Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Modal, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

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
    maxHeight: '80vh',
    overflowY: 'auto',
    backgroundColor: 'white',
    padding: '1rem',
    boxShadow: 24,
  },
};

const ClientesComponent = ({ searchQuery }) => {
  const [clientesData, setClientesData] = useState([]); // Estado para almacenar todos los clientes
  const [filteredClientesData, setFilteredClientesData] = useState([]); // Estado para almacenar clientes filtrados
  const [isNewClientesModalOpen, setIsNewClientesModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal de nuevo cliente
  const [isViewClientesModalOpen, setIsViewClientesModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal de visualización de cliente
  const [isEditClientesModalOpen, setIsEditClientesModalOpen] = useState(false); // Estado para controlar la apertura/cierre del modal de edición de cliente
  const [isDeleteClientesDialogOpen, setIsDeleteClientesDialogOpen] = useState(false); // Estado para controlar la apertura/cierre del diálogo de eliminación
  const [selectedCliente, setSelectedCliente] = useState(null); // Estado para almacenar el cliente seleccionado para editar, ver o eliminar

  // Función para obtener los datos de los clientes desde la API al cargar el componente
  const fetchClientesData = async () => {
    try {
      const response = await axios.get('http://arcaweb.test/api/V1/users');
      if (response.data && Array.isArray(response.data)) {
        setClientesData(response.data);
      } else {
        console.error('Datos de clientes no válidos:', response.data);
      }
    } catch (error) {
      console.error('Error al obtener datos de clientes:', error);
    }
  };
  useEffect(() => {

    fetchClientesData();
  }, []);

  // Función para filtrar los clientes según la búsqueda
  useEffect(() => {
    setFilteredClientesData(
      clientesData.filter(cliente =>
        (cliente.id && cliente.id.toString().toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cliente.name && cliente.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cliente.apellido && cliente.apellido.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (cliente.tel && cliente.tel.toString().includes(searchQuery)) ||
        (cliente.email && cliente.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [searchQuery, clientesData]);

  // Función para agregar un nuevo cliente
  const handleAddCliente = async (event) => {
    event.preventDefault();
    const newClienteData = {
      id: event.target.id.value,
      name: event.target.name.value,
      tipo_doc: event.target.tipo_doc.value,
      tel: event.target.tel.value,
      fecha_naci: event.target.fecha_naci.value,
      genero: event.target.genero.value,
      direccion: event.target.direccion.value,
      email: event.target.email.value,
      password: event.target.password.value,
    };

    try {
      const response = await axios.post('http://arcaweb.test/api/V1/users', newClienteData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201) {
        //Actualizar la lista de clientes con el nuevo cliente
        setClientesData([...clientesData, response.data]);
      
        setFilteredClientesData([...filteredClientesData, response.data]);
        
        handleCloseNewClientesModal();
      } else {
        console.error('Error al agregar cliente:', response.data);
      }
    } catch (error) {
      console.error('Error al agregar cliente:', error.response ? error.response.data : error.message);
    }
  };




  // Función para editar un cliente
  const handleEditClienteSubmit = async (event) => {
    event.preventDefault();
    const editedClienteData = {
      tel: event.target.tel.value,      
      genero: event.target.genero.value,
      direccion: event.target.direccion.value,
    };

    try {
      const response = await axios.patch(`http://arcaweb.test/api/V1/users/${selectedCliente.id}`, editedClienteData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Actualizar la lista de clientes con el cliente editado y cerrar el modal
        setClientesData(clientesData.map(cliente => cliente.id === editedClienteData.id? response.data : cliente));
        handleCloseEditClientesModal();
      } else {
        console.error('Error al editar cliente:', response.data);
      }
    } catch (error) {
      console.error('Error al editar cliente:', error.response ? error.response.data : error.message);
    }
  };



 // Función para eliminar  un cliente
  const handleDeleteCliente = async () => {
    try {
      const response = await axios.delete(`http://arcaweb.test/api/V1/users/${selectedCliente.id}`);
     if (response.status === 204 || response.status === 200)  {
        setClientesData(clientesData.filter(cliente => cliente.id !== selectedCliente.id));
        handleCloseDeleteClientesDialog();
      } else {
        console.error('Error al eliminar cliente:', response.data);
      }
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const handleOpenNewClientesModal = () => {
    setIsNewClientesModalOpen(true);
  };

  const handleCloseNewClientesModal = () => {
    setIsNewClientesModalOpen(false);
    fetchClientesData();
  };



  const handleViewCliente = (cliente) => {
    setSelectedCliente(cliente);
    setIsViewClientesModalOpen(true);
  };

  const handleCloseViewClientesModal = () => {
    setIsViewClientesModalOpen(false);
  };


  
  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente);
    setIsEditClientesModalOpen(true);
  };

  const handleCloseEditClientesModal = () => {
    setIsEditClientesModalOpen(false);
    fetchClientesData();
  };



  const handleOpenDeleteClientesDialog = (cliente) => {
    setSelectedCliente(cliente);
    setIsDeleteClientesDialogOpen(true);
  };

  const handleCloseDeleteClientesDialog = () => {
    setIsDeleteClientesDialogOpen(false);
    setSelectedCliente(null);
  };

  return (
    <Box style={styles.mainBox}>
      <Box style={styles.subBox}>
        <Typography variant="h6">Clientes</Typography>
      </Box>
            {/* boton para agregar un nuevo cliente */}
      <Box style={styles.subBox}>
        <Button variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }} onClick={handleOpenNewClientesModal}>
          Nuevo
        </Button>
      </Box>
            {/* nombre de las columnas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Documento</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo Documento</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Fecha Nacimiento</TableCell>
              <TableCell>Genero</TableCell>
              <TableCell>Direccion</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* cuerpo de la tabla */}
          <TableBody>
            {filteredClientesData.map((cliente, index) => (
              <TableRow key={index}>
                <TableCell>{cliente.id}</TableCell>
                <TableCell>{cliente.name}</TableCell>
                <TableCell>{cliente.tipo_doc}</TableCell>
                <TableCell>{cliente.tel}</TableCell>
                <TableCell>{cliente.fecha_naci}</TableCell>
                <TableCell>{cliente.genero}</TableCell>
                <TableCell>{cliente.direccion}</TableCell>
                <TableCell>{cliente.email}</TableCell>

                {/* columna de acciones */}
                <TableCell>
                  <IconButton onClick={() => handleViewCliente(cliente)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEditCliente(cliente)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteClientesDialog(cliente)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Modal para agregar un nuevo cliente */}
      <Modal open={isNewClientesModalOpen} onClose={handleCloseNewClientesModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Agregar Nuevo Cliente</Typography>
          <form onSubmit={handleAddCliente}>
            <TextField name="id" label="Documento" fullWidth margin="normal" />
            <TextField name="name" label="Nombre" fullWidth margin="normal" />
            <TextField name="tipo_doc" label="Tipo de Documento" fullWidth margin="normal" />
            <TextField name="tel" label="Teléfono" fullWidth margin="normal" />
            <TextField name="fecha_naci" type="date" fullWidth margin="normal" />
            <TextField name="genero" label="Género" fullWidth margin="normal" />
            <TextField name="direccion" label="Dirección" fullWidth margin="normal" />
            <TextField name="email" label="Correo" fullWidth margin="normal" />
            <TextField name="password" label="Contraseña" fullWidth margin="normal" />
            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <Button onClick={handleCloseNewClientesModal} sx={{ marginRight: 1 }}>Cancelar</Button>
              <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color:"#fff" }}>
                Guardar
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>



                {/* Modal para visualizar un cliente */}
      <Modal open={isViewClientesModalOpen} onClose={handleCloseViewClientesModal}>
        <Box sx={{ color: "black" }} style={styles.modal}>
          <Typography variant="h6">Visualizar Cliente</Typography>
          {selectedCliente && (
            <>
              <Typography>Documento: {selectedCliente.id}</Typography>
              <Typography>Nombre: {selectedCliente.name}</Typography>
              <Typography>Tipo de Documento: {selectedCliente.tipo_doc}</Typography>
              <Typography>Teléfono: {selectedCliente.tel}</Typography>
              <Typography>Fecha de Nacimiento: {selectedCliente.fecha_naci}</Typography>
              <Typography>Género: {selectedCliente.genero}</Typography>
              <Typography>Dirección: {selectedCliente.direccion}</Typography>
              <Typography>Correo: {selectedCliente.email}</Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseViewClientesModal}>Cerrar</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>



          {/* Modal para editar un cliente */}
      <Modal open={isEditClientesModalOpen} onClose={handleCloseEditClientesModal}>
        <Box style={styles.modal}>
          <Typography variant="h6">Editar Cliente</Typography>
          {selectedCliente && (
            <form onSubmit={handleEditClienteSubmit}>             
              <TextField name="tel" label="Teléfono" fullWidth margin="normal" defaultValue={selectedCliente.tel} />       
              <TextField name="genero" label="Género" fullWidth margin="normal" defaultValue={selectedCliente.genero} />
              <TextField name="direccion" label="Dirección" fullWidth margin="normal" defaultValue={selectedCliente.direccion} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <Button onClick={handleCloseEditClientesModal} sx={{ marginRight: 1 }}>Cancelar</Button>
                <Button type="submit" variant="contained" sx={{ backgroundColor: "#E3C800", color: "#fff" }}>
                  Guardar
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>



            {/* Modal para eliminar un cliente */}
      <Dialog open={isDeleteClientesDialogOpen} onClose={handleCloseDeleteClientesDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al cliente {selectedCliente?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteClientesDialog}>Cancelar</Button>
          <Button type= "submit" variant="contained" onClick={handleDeleteCliente} sx={{ backgroundColor: "#E3C800", color: "#fff",  }}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientesComponent;

