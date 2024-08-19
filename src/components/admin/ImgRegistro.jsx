import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const ImgRegistro = ({ profileData, updateAvatar }) => {
    const END_POINT = "http://arcaweb.test/api/V1"; // Reemplaza con tu endpoint real

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('imageable_type', 'admin'); // Ajusta según sea necesario
            formData.append('imageable_id', profileData.id); // ID del usuario
            formData.append('image', file);

            try {
                const userSession = JSON.parse(sessionStorage.getItem('user'));
                const token = userSession?.token?.access_token;

                const response = await axios.post(`${END_POINT}/images`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    updateAvatar(response.data.url); // Usa la nueva función para actualizar el avatar
                } else {
                    alert('No se pudo subir el avatar.');
                }
            } catch (error) {
                alert('Error al subir el avatar: ' + (error.response ? error.response.data.message : error.message));
            }
        }
    };

    return (
        <Button
            variant="contained"
            component="label"
            sx={{ marginTop: '0.5rem' }}
        >
            Cargar Avatar
            <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleAvatarUpload}
            />
        </Button>
    );
};

export default ImgRegistro;