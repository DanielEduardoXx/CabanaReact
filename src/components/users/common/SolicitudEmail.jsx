import { Box, Paper, Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from 'react';
import { Stack, Alert } from "@mui/material";
import { MyContext } from "../../../services/MyContext";
import AlertDesconectado from "./AlertDesconectado";
import PicRegistro from "./PicRegistro";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles"; // Asegúrate de importar styled correctamente
import { recuperarPasswordEmail } from "../../../services/usuarios";

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
    '& > *': {
        margin: theme.spacing(1),
    },
}));

const SolicitudEmail = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errorCorreo, setErrorCorreo] = useState();
    const [messageExito, setMessageExito] = useState();
    const [formData, setFormData] = useState({
        email: '',
    });

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
        console.log(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await recuperarPasswordEmail(formData.email);

            setMessageExito(response.message)   
            console.log('Success:', response);
        } catch (error) {
            if (error.response) {
                const { error: errorMsg, messages } = error.response.data;

                // Si hay mensajes de error específicos para los campos
                if (messages) {
                    const errorMessages = Object.values(messages).flat(); // Obtiene todos los mensajes de error

                    setErrorCorreo(errorMessages)
                    setTimeout(() => {
                        setErrorCorreo(false)
                    }, 5000);
                } else {
                    alert(`Error: ${errorMsg}`);
                }
            } else {
                console.error('Error:', error.message);
                alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
            }
        }

        console.log('Form data submitted:', formData);
    };



    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <PicRegistro sx={{ position: 'relative' }} />

            <Box sx={style}>
                <StyledForm noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <Typography variant="h2" component="h2" sx={{ padding: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>Por favor confirme correo</Typography>
                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            required
                            name="email"
                            id="email"
                            label="Correo"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <Button type="submit" variant="contained" color="primary">Enviar</Button>
                    </Box>
                </StyledForm>

                {errorCorreo && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">{errorCorreo}</Alert>
                    </Stack>
                )}

                {messageExito && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="success">{messageExito}</Alert>
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default SolicitudEmail;
