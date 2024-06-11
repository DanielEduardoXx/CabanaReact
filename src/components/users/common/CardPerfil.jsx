import { Box, Paper, Avatar, Modal, Button, TextField, Typography } from "@mui/material";
import { MyContext } from "../../../services/myContext";
import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import { updateUser } from "../../../services/updateUser";

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
    const { user } = useContext(MyContext);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        genero: '',
        direccion: '',
        tel: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.data.name || '',
                email: user.data.email || '',
                direccion: user.data.direccion || '',
                tel: user.data.tel || ''
            });
        }
    }, [user]);

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
        const userId = user.data.id; // Obtener el ID del usuario desde el contexto o localStorage
        try {
            const updatedUser = await updateUser(userId, formData);
            setMessage('Usuario actualizado correctamente');
        } catch (error) {
            setMessage(error.message);
        }
    };
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ minWidth: { md: '50%', sm: '50%', xs: '100%' }, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h1" component="h2">Perfil</Typography>
                        <Avatar alt="Remy Sharp" src="../../../assets/perfil1.jgp" />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { md: 'flex' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Cedula</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.data.id : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { md: 'flex' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Nombre</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.data.name : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { md: 'flex' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Correo</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.data.email : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { md: 'flex' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Teléfono</Box>
                            <Box sx={{ minWidth: { md: '50%' } }}>{user ? user.data.tel : ''}</Box>
                        </Typography>

                        <Typography variant="h2" component="h2" sx={{ paddingTop: '1rem', minWidth: { md: '100%' }, display: { md: 'flex' } }}>
                            <Box sx={{ minWidth: { md: '50%' } }}>Dirección</Box>
                            <Box sx={{ minWidth: { md: '50%', xs: '50%' } }}>{user ? user.data.direccion : ''}</Box>
                        </Typography>

                        <div>
                            <Button onClick={handleOpen}>Open modal</Button>
                            <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                                <Box sx={style}>
                                    <StyledForm noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField disabled sx={{ margin: '5px 0', width: { xs: '100%' } }} name="id" label="Identificacion" type="number" variant="outlined" value={user ? user.data.id : ''} onChange={handleChange} />
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <TextField sx={{ margin: '5px 0', width: { xs: '100%' } }} name="name" label="genero" variant="outlined" type="text" value={formData.genero} onChange={handleChange} />
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
                                    {message && <p>{message}</p>}
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
