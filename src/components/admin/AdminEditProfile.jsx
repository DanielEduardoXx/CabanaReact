import React, { useContext, useState, useEffect } from 'react';
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from '@mui/material';
import axios from 'axios';
import { MyContext } from '../../services/MyContext';
import ImgRegistro from './ImgRegistro';
import { BASE_URL, END_POINT } from './Config';

const defaultImagePath = "http:./public/pollo.png"; 

const AdminEditProfile = ({ open, handleClose }) => {
    const { user, setUser } = useContext(MyContext);
    const [adminData, setAdminData] = useState({
        name: user.user.name,
        email: user.user.email,
        tel: user.user.tel,
        direccion: user.user.direccion,
    });
    const [avatarUrl, setAvatarUrl] = useState(user.user.images ? `${BASE_URL}${user.user.images.path}` : defaultImagePath);

    useEffect(() => {
        if (user.user.images && user.user.images.path) {
            setAvatarUrl(`${BASE_URL}${user.user.images.path}`);
        } else {
            setAvatarUrl(defaultImagePath);
        }
    }, [user.user.images]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminData({ ...adminData, [name]: value });
    };

    const updateAvatar = (newImagePath) => {
        console.log('Actualizando avatar con la nueva ruta:', newImagePath);
        const newAvatarUrl = `${BASE_URL}${newImagePath}?t=${new Date().getTime()}`;
        setAvatarUrl(newAvatarUrl);

        const updatedUser = {
            ...user,
            user: {
                ...user.user,
                images: { path: newImagePath }
            }
        };
        console.log('Estado actualizado del usuario después de la actualización del avatar:', updatedUser);
        setUser(updatedUser);
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const handleSave = async () => {
        try {
            console.log('Guardando la información del perfil:', adminData);
            const response = await axios.put(
                `${END_POINT}/users/${user.user.id}`,
                adminData,
                {
                    headers: {
                        Authorization: `Bearer ${user.token.access_token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const updatedUser = {
                    ...user,
                    user: { ...user.user, ...adminData }
                };
                console.log('Estado actualizado del usuario después de guardar:', updatedUser);
                setUser(updatedUser);
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                handleClose();
            } else {
                alert('No se pudo actualizar la información del administrador.');
            }
        } catch (error) {
            alert('Error al actualizar la información: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const handleDeleteImage = async () => {
    if (!user.user.images || !user.user.images.id) {
        alert('No hay imagen para eliminar.');
        console.log('No hay imagen para eliminar:', user.user.images);
        return;
    }

    try {
        const imageId = parseInt(user.user.images.id, 10); // Convierte a entero
        console.log('Eliminando la imagen con ID:', imageId);
        const response = await axios.delete(
            `${END_POINT}/images/users/${user.user.id}/${imageId}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token.access_token}`,
                    'Accept': 'application/json',
                },
            }
        );

        if (response.status === 200) {
            // Asegúrate de que la imagen esté eliminada en el estado
            const updatedUser = {
                ...user,
                user: {
                    ...user.user,
                    images: null // Limpiar la información de la imagen
                }
            };
            console.log('Estado actualizado del usuario después de eliminar la imagen:', updatedUser);
            setUser(updatedUser);
            sessionStorage.setItem('user', JSON.stringify(updatedUser));

            setAvatarUrl(defaultImagePath);
            alert('Imagen eliminada con éxito.');
        } else {
            alert('No se pudo eliminar la imagen.');
        }
    } catch (error) {
        alert('Error al eliminar la imagen: ' + (error.response ? error.response.data.message : error.message));
    }
};


    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Editar Información del Administrador</DialogTitle>
            <DialogContent>
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={avatarUrl}
                            sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <ImgRegistro profileData={user.user} updateAvatar={updateAvatar} />
                        {user.user.images && user.user.images.path && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleDeleteImage}
                                sx={{ mt: 2 }}
                            >
                                Eliminar Imagen
                            </Button>
                        )}
                    </Box>

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
