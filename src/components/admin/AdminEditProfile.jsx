import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import axios from 'axios';
import { MyContext } from '../../services/MyContext';

const AdminEditProfile = ({ open, handleClose }) => {
    const { user, setUser } = useContext(MyContext);
    const [adminData, setAdminData] = useState({
        name: user.user.name,
        email: user.user.email,
        tel: user.user.tel,
        direccion: user.user.direccion,
    });

    const END_POINT = "http://arcaweb.test/api/V1"; 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value });
    };

    const handleSave = async () => {
        const userSession = JSON.parse(sessionStorage.getItem('user'));
        const token = userSession?.token?.access_token;
    
        try {
            const response = await axios.put(
                `${END_POINT}/users/${user.user.id}`,
                adminData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 200) {
                // Actualiza el estado del usuario con los nuevos datos
                const updatedUser = { ...user, user: { ...user.user, ...adminData } };
                setUser(updatedUser);
                
                // Actualiza también la sesión del usuario
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                
                handleClose(); // Cierra el diálogo de edición
            } else {
                alert('No se pudo actualizar la información del administrador.');
            }
        } catch (error) {
            alert('Error al actualizar la información: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Información del Administrador</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: 2 }}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={adminData.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Correo"
                        name="email"
                        value={adminData.email}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Teléfono"
                        name="tel"
                        value={adminData.tel}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Dirección"
                        name="direccion"
                        value={adminData.direccion}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancelar</Button>
                <Button onClick={handleSave} color="primary">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminEditProfile;
