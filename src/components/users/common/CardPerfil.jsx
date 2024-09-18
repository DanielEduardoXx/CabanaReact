import { Box, Paper, Modal, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { updateUser } from "../../../services/updateUser";
import { MyContext } from "../../../services/MyContext";
import AlertDesconectado from "./AlertDesconectado";
import PicRegistro from "./PicRegistro";
import { fotoPerfil, updateFoto, fetchProfileImage, eliminarFoto } from '../../../services/fotoPerfil.js';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TablaInformacion from "./TablaComprasUser.jsx";
import { getAllCompras } from "../../../services/ventasUser.js";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "./LoadingComponent.jsx";
import PicPerfil from "./PicPerfil.jsx";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    width:'50%'
};

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {},
}));



const Perfil = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { user, setUser } = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [openCompras, setOpenCompras] = useState(false);
    const [openModalFoto, setOpenModalFoto] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [btnActualizarfoto, setBtnActualizarfoto] = useState(false)
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

    //Boton de actualizar Foto de  Perfil
    const BtnUpdateFotoPerfil = ({ habilitarBtnUpdate }) => {
        return (
            <Button
                type="submit"
                variant="contained"
                sx={{ marginTop: '1rem ' }}
                onClick={handleChangeFoto}
                style={{ display: habilitarBtnUpdate ? 'block' : 'none' }}
            >
                Actualizar
            </Button>
        );
    };

    useEffect(() => {
        if (user && user.user) {
            // Configurar los datos del formulario
            setFormData({
                id: user.user.id || '',
                name: user.user.name || '',
                email: user.user.email || '',
                direccion: user.user.direccion || '',
                tel: user.user.tel || ''
            });

            // Realizar la solicitud para obtener la imagen de perfil
            const fetchProfile = async () => {
                try {
                    // Llamada a la función fetchProfileImage que ya importaste
                    const { fullImageUrl } = await fetchProfileImage(user.user.id);

                    // Actualizar el estado de la imagen de perfil con la URL obtenida
                    setProfileImage(fullImageUrl);

                    console.log('URL de la imagen:', fullImageUrl);
                } catch (error) {
                    console.error('Error al obtener la imagen de perfil:', error);

                    // Limpiar la imagen de perfil en caso de error
                    setProfileImage(null);
                    sessionStorage.removeItem('profileImage'); // Eliminar la imagen si hubo un error
                }
            };

            fetchProfile();
        }
    }, [user]);



    const handleOpen = () => setOpen(true);
    const handleOpenCompras = () => setOpenCompras(true);
    const handleOpenModalFoto = () => setOpenModalFoto(true);




    const handleClose = () => {
        setOpenCompras(false)
        setOpen(false);
        setOpenModalFoto(false);
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

            //Boton de Actualizar Foto
            if (setSelectedImage) {
                setBtnActualizarfoto(true)
            } else {
                setBtnActualizarfoto(false)
            }



        }
    };


// Función para manejar el cambio de foto
const handleChangeFoto = async (e) => {
    e.preventDefault();
    const userId = user?.user?.id;

    if (!userId) {
        setMessage("User ID is undefined");
        return;
    }

    try {
        // Verificar que haya una imagen seleccionada
        if (!selectedImage) {
            setMessage('Por favor seleccione una imagen para actualizar.');
            return;
        }

        // Crear una nueva instancia de FormData
        const formData = new FormData();
        formData.append('imageable_type', 'users');
        formData.append('imageable_id', userId);
        formData.append('image', selectedImage);

        // Mostrar el contenido de FormData en la consola
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        // Intentar obtener el imageId desde sessionStorage (si ya se subió una imagen antes)
        let imageId = sessionStorage.getItem('profileImageId');

        if (imageId === null) { // `null` o vacío significa que no hay una imagen
            console.log('No hay imagen, creando una nueva...');

            try {
                // Crear nueva imagen
                imageId = await fotoPerfil(userId, selectedImage);
                setMessage('Imagen de perfil creada con éxito');
            } catch (error) {
                setMessage('Error al crear la imagen: ' + error.message);
                return;
            }

            // Guardar el nuevo imageId en sessionStorage para futuras actualizaciones
            sessionStorage.setItem('profileImageId', imageId);
        } else {
            // Si ya existe una imagen, actualízala
            console.log('Imagen existente, actualizando...');

            try {
                await updateFoto(imageId, userId, selectedImage);
                setMessage('Foto de Perfil actualizada con éxito');
            } catch (error) {
                setMessage('Error al actualizar la imagen: ' + error.message);
                return;
            }
        }

        window.location.reload(); // Recargar la página después de actualizar o crear la imagen
    } catch (error) {
        setMessage('Error inesperado: ' + error.message);
    }
};




    // Función para eliminar el cambio de foto
    const handleEliminarFoto = async (e) => {
        e.preventDefault();
        const userId = user?.user?.id;

        if (!userId) {
            setMessage("User ID is undefined");
            return;
        }

        try {

            // Crear una nueva instancia de FormData
            const formData = new FormData();
            formData.append('imageable_type', 'users');
            formData.append('imageable_id', userId);

            // Mostrar el contenido de FormData en la consola
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            // Intentar obtener el imageId desde sessionStorage (si ya se subió una imagen antes)
            let imageId = sessionStorage.getItem('profileImageId');


            try {
                // Eliminar la imagen
                imageId = await eliminarFoto( imageId, userId );
                setMessage('Imagen de perfil Eliminada con éxito');
            } catch (error) {
                setMessage('Error al Eliminar la imagen: ' + error.message);
                return;
            }

            // Eliminar imageId en sessionStorage para futuras actualizaciones
            sessionStorage.removeItem('profileImageId');

            window.location.reload(); // Recargar la página después de actualizar o crear la imagen
        } catch (error) {
            setMessage('Error inesperado: ' + error.message);
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


    const handleSolicitudEmail = () => {
        // Redirige a la ruta deseada, por ejemplo, "/cambiar-contraseña"
        navigate('/SolicitudEmail');
    };

    if (loading) {
        return <LoadingComponent />;
    }


    return (
        <>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                <PicRegistro sx={{ position: 'relative' }} />
                <Box>

                </Box>

                <Paper sx={{ minWidth: { md: '50%', sm: '50%', xs: '100%' }, padding: '2rem', display: 'flex', flexDirection: 'column', position: { md: 'absolute' } }}>



                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Imagen de perfil */}
                        <Button onClick={handleOpenModalFoto} sx={{ padding: 0, borderRadius: '50%', minWidth: 0 }}>
                            {profileImage ? (
                                <img src={profileImage} alt="Foto de perfil" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                            ) : (
                                <PicPerfil />
                            )}
                        </Button>

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
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="id" label="Cédula" variant="outlined" value={formData.id} onChange={handleChange} disabled/>
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="name" label="Nombre" variant="outlined" value={formData.name} onChange={handleChange} disabled/>
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="email" label="Correo" variant="outlined" value={formData.email} onChange={handleChange} disabled/>
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="direccion" label="Dirección" variant="outlined" value={formData.direccion} onChange={handleChange} />
                                        <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} required name="tel" label="Teléfono" variant="outlined" value={formData.tel} onChange={handleChange} />
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                        <Button type="submit" variant="contained" color="success" sx={{ marginTop: '1rem ' }}>Actualizar Perfil</Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ marginTop: '1rem ' }}
                                            onClick={handleSolicitudEmail}
                                        >
                                            Contraseña
                                        </Button>

                                    </Box>


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

                        <Modal open={openModalFoto} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Actualizar Foto Perfil
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Imagen de perfil */}
                                    <Button sx={{ padding: 0, borderRadius: '50%', minWidth: 0 }}>
                                        {profileImage ? (
                                            <img src={profileImage} alt="Foto de perfil" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
                                        ) : (
                                            <PicPerfil />
                                        )}
                                    </Button>

                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0 1rem 0' }} >

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="file-upload" />
                                        <label htmlFor="file-upload">
                                            <Button variant="contained" component="span">Elegir Imagen</Button>
                                        </label>

                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                                        <Button type="submit"
                                            variant="contained"
                                            onClick={handleEliminarFoto}>Eliminar Imagen
                                        </Button>
                                    </Box>
                                </Box>

                                {message && (

                                    <Stack sx={{ width: '100%' }} spacing={2}>
                                        <Alert severity="success">{message}</Alert>
                                    </Stack>

                                )}

                                <StyledForm noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <BtnUpdateFotoPerfil habilitarBtnUpdate={btnActualizarfoto} />
                                </StyledForm>





                            </Box>

                        </Modal>
                    </Box>
                </Paper >
            </Box >
        </>
    );
}

export default Perfil;
