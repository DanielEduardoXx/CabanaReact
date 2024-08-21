import { Box, Paper, Modal, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { updateUser } from "../../../services/updateUser";
import { MyContext } from "../../../services/MyContext";
import AlertDesconectado from "./AlertDesconectado";
import PicRegistro from "./PicRegistro";
import fotoPerfil from '../../../services/fotoPerfil.js';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TablaInformacion from "./TablaComprasUser.jsx";
import { getAllCompras } from "../../../services/ventasUser.js";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {},
}));

const Perfil = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { user, setUser } = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [openCompras, setOpenCompras] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        direccion: '',
        tel: ''
    });
    const userId = user?.user?.id;

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const data = await getAllCompras(userId);
                const ventas = (data && data.user && Array.isArray(data.user.ventas)) ? data.user.ventas : [];
                console.log('Datos recibidos:', ventas);
                setCompras(ventas);
                setLoading(false);
            } catch (error) {
                console.error('Error al traer las compras:', error);
                setLoading(false);
            }
        };

        fetchCompras();
    }, [userId]);

    useEffect(() => {
        if (user && user.user) {
            setFormData({
                id: user.user.id || '',
                name: user.user.name || '',
                email: user.user.email || '',
                direccion: user.user.direccion || '',
                tel: user.user.tel || ''
            });

            // Realizar la solicitud para obtener la ruta de la imagen
            const fetchProfileImage = async () => {
                const token = JSON.parse(sessionStorage.getItem('user'))?.token?.access_token;

                if (!token) {
                    console.error('No se encontró un token de autenticación');
                    return;
                }

                try {
                    const response = await fetch(`http://arcaweb.test/api/V1/images/users/${user.user.id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Error en la solicitud: ' + response.statusText);
                    }

                    const data = await response.json();
                    const imageUrl = data.data.path; // Ajusta esto según la estructura de la respuesta
                    setProfileImage(`http://arcaweb.test/${imageUrl}`);
                    console.log('respuesta:', response);
                    console.log('>>:', imageUrl);
                } catch (error) {
                    console.error('Error al cargar la imagen de perfil:', error);
                    setProfileImage(null);
                }
            };

            fetchProfileImage();
        }
    }, [user]);


    const handleOpen = () => setOpen(true);
    const handleOpenCompras = () => setOpenCompras(true);
    const handleClose = () => {
        setOpenCompras(false)
        setOpen(false);
        setMessage(''); // Limpiar el mensaje al cerrar el modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                setMessage('Tipo de archivo no permitido');
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                setMessage('El archivo es demasiado grande');
                return;
            }

            setSelectedImage(file);
            setMessage(`Seleccionado: ${file.name}`); // Limpiar el mensaje al seleccionar un archivo válido
            console.log('Archivo seleccionado:', file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = user?.user?.id;

        if (!userId) {
            setMessage("User ID is undefined");
            return;
        }

        try {
            if (selectedImage) {
                // Llamar a la función fotoPerfil para subir la imagen
                await fotoPerfil(userId, selectedImage);
            }

            const updatedData = {
                id: formData.id || user.user.id,
                name: formData.name || user.user.name,
                email: formData.email || user.user.email,
                direccion: formData.direccion || user.user.direccion,
                tel: formData.tel || user.user.tel
            };

            // Actualizar los datos del usuario
            await updateUser(userId, updatedData);

            // Actualizar el estado del usuario
            const updatedUser = JSON.parse(sessionStorage.getItem('user'))?.user;
            setUser(updatedUser);

            setMessage('Perfil actualizado con éxito'); // Mensaje de éxito
            window.location.reload();  // Recargar la página
        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return <Typography>Cargando...</Typography>;
    }

    if (!user) {
        return <AlertDesconectado />;
    }

    return (
        <>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <PicRegistro sx={{ position: 'relative' }} />

                <Paper sx={{ minWidth: { md: '50%', sm: '50%', xs: '100%' }, padding: '2rem', display: 'flex', flexDirection: 'column', position: { md: 'absolute' } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Imagen de perfil */}
                        {profileImage ? (
                            <img src={profileImage} alt="Foto de perfil" className="profile-image" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                        ) : (
                            <p>No se pudo cargar la imagen de perfil</p>
                        )}

                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h1" component="h2">Perfil</Typography>
                    </Box>


                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Cedula</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.user.id : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Nombre</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.user.name : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Correo</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.user.email : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Teléfono</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.user.tel : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Dirección</Box>
                            <Box sx={{ minWidth: { md: '50%', xs: '50%' } }}>{user ? user.user.direccion : ''}</Box>
                        </Typography>

                        <Box sx={{ display: 'flex' }}>
                            <Box sx={{ marginRight: '1rem' }}>
                                <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginTop: '1rem' }}>Actualizar</Button>

                            </Box>
                            <Box>
                                <Button variant="contained" color="primary" onClick={handleOpenCompras} sx={{ marginTop: '1rem' }}>Ver Compras</Button>

                            </Box>
                        </Box>
                        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <StyledForm noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="id" label="Cédula" variant="outlined" value={formData.id} onChange={handleChange} />
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="name" label="Nombre" variant="outlined" value={formData.name} onChange={handleChange} />
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="email" label="Correo" variant="outlined" value={formData.email} onChange={handleChange} />
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="direccion" label="Dirección" variant="outlined" value={formData.direccion} onChange={handleChange} />
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="tel" label="Teléfono" variant="outlined" value={formData.tel} onChange={handleChange} />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="file-upload" />
                                        <label htmlFor="file-upload">
                                            <Button variant="contained" component="span">Subir Imagen</Button>
                                        </label>

                                        <Button type="submit" variant="contained" sx={{ marginTop: '1rem ' }}>Actualizar Perfil</Button>
                                    </Box>


                                    {message && (

                                        <Stack sx={{ width: '100%' }} spacing={2}>
                                            <Alert severity="success">{message}</Alert>
                                        </Stack>

                                    )}

                                </StyledForm>
                            </Box>
                        </Modal>


                        <Modal open={openCompras} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                            <Box sx={style}>
                                <TablaInformacion
                                    nombreTabla={"Ventas"}
                                    rows={compras || []} // Cambié 'no hay productos' a un array vacío
                                    idKey="id" // Usa el id de la venta como key
                                />
                            </Box>
                        </Modal>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}

export default Perfil;
