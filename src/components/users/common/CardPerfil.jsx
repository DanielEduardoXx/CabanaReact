import { Box, Paper, Avatar, Modal, Button, TextField, Typography } from "@mui/material";
import { MyContext } from "../../../services/MyContext";
import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { updateUser } from "../../../services/updateUser";
import AlertDesconectado from "./AlertDesconectado";
import PicRegistro from "./PicRegistro";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {},
}));

const Perfil = () => {
    const { user, setUser, loading } = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        direccion: '',
        tel: ''
    });


    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || '',
                name: user.name || '',
                email: user.email || '',
                direccion: user.direccion || '',
                tel: user.tel || ''
            });
        }
    }, [user]);
    console.log(user)

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = user?.id;
            if (!userId) {
                throw new Error("User ID is undefined");
            }

            // Combine formData with the current user data
            const updatedData = {
                id: formData.id || user.id,
                name: formData.name || user.name,
                email: formData.email || user.email,
                direccion: formData.direccion || user.direccion,
                tel: formData.tel || user.tel
            };

            await updateUser(userId, updatedData);

            setUser(updatedData);

            setMessage('Usuario actualizado correctamente');
            handleClose()
        } catch (error) {
            setMessage(error.message);
        }
    };

    if (loading) {
        return <Typography>Cargando...</Typography>;
    }

    if (!user) {
        return <> <AlertDesconectado /></>;
    }
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <PicRegistro
                    sx={{ position: 'relative' }}
                ></PicRegistro>
                <Paper sx={{ minWidth: { md: '50%', sm: '50%', xs: '100%' }, padding: '2rem', display: 'flex', flexDirection: 'column', position: { md: 'absolute' } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h1" component="h2">Perfil</Typography>
                        {/* <Avatar alt="Remy Sharp" src="../../../assets/perfil1.jgp" /> */}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { xs: 'flex', sm: 'flex', md: 'flex' }, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'center', sm: 'center' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Cedula</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.id : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { xs: 'flex', sm: 'flex', md: 'flex' }, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'center', sm: 'center' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Nombre</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.name : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { xs: 'flex', sm: 'flex', md: 'flex' }, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'center', sm: 'center' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Correo</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.email : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { xs: 'flex', sm: 'flex', md: 'flex' }, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'center', sm: 'center' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Teléfono</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.tel : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { xs: 'flex', sm: 'flex', md: 'flex' }, flexDirection: { xs: 'column', sm: 'column', md: 'row' }, alignItems: { xs: 'center', sm: 'center' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Dirección</Box>
                            <Box sx={{ minWidth: { md: '50%', xs: '50%' } }}>{user ? user.direccion : ''}</Box>
                        </Typography>

                        <div>
                            <Button  variant="contained" color="primary" onClick={handleOpen} sx={{ marginTop: '1rem' }}>Actualizar</Button>
                            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                <Box sx={style}>
                                    <StyledForm noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} name="id" label="Identificacion" type="number" variant="outlined" value={user ? user.id : ''} onChange={handleChange} />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} name="name" label="name" variant="outlined" type="text" value={formData.name} onChange={handleChange} />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} name="direccion" label="Direccion" type="text" variant="outlined" value={formData.direccion} onChange={handleChange} />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} name="tel" label="Telefono" type="number" variant="outlined" value={formData.tel} onChange={handleChange} />
                                        </Box>

                                        <Button type="submit" variant="contained" color="primary" sx={{ width: { xs: '100%' } }}>
                                            Actualizar
                                        </Button>
                                    </StyledForm>
                                    {message && <Typography color="error">{message}</Typography>}
                                </Box>
                            </Modal>
                        </div>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Perfil;
