import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PicRegistro from './PicRegistro';
import { Box, Stack, Alert, TextField, Typography, Button } from '@mui/material';
import { styled } from "@mui/material/styles"; // Asegúrate de importar styled correctamente
import { useNavigate } from "react-router-dom";



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


const CodeEmailConfirmation = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que ambas contraseñas coincidan
        if (password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // Enviar la solicitud al backend con el token, password y password_confirmation
            const response = await axios.post('http://arcaweb.test/api/V1/password-reset', {
                token,
                password,
                password_confirmation: passwordConfirmation, // Enviar la confirmación de la contraseña
            });
            setSuccess(true);
            setTimeout(() => {
                navigate("/iniciar-sesion")
            }, 3000);

        } catch (error) {
            if (error.response) {
                const { error: errorMsg, messages } = error.response.data;

                // Si hay mensajes de error específicos para los campos
                if (messages) {
                    const errorMessages = Object.values(messages).flat(); // Obtiene todos los mensajes de error

                    setError(errorMessages)
                    setTimeout(() => {
                        setError(false)
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

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', }}>
            <PicRegistro sx={{ position: 'relative' }} />
            <Box sx={style}>
                <Typography variant="h2" component="h2" sx={{ padding: '1rem', minWidth: { md: '100%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>Restablecer Contraseña</Typography>

                <StyledForm onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <TextField
                        sx={{ margin: '5px 0', width: { xs: '100%' } }}
                        type="password"
                        placeholder="Nueva contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        sx={{ margin: '5px 0', width: { xs: '100%' } }}
                        type="password"
                        placeholder="Confirmar contraseña"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary">Reestablecer Contraseña</Button>
                </StyledForm>


                {error && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">{error}</Alert>
                    </Stack>
                )}

                {success && (
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="success">{success}"Se a cambiado la contraseña correctamente"</Alert>
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default CodeEmailConfirmation;
