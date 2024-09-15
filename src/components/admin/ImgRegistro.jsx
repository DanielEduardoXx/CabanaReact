import React, { useState, useContext } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { MyContext } from '../../services/MyContext';
import { END_POINT } from './Config';

const ImgRegistro = ({ profileData, updateAvatar }) => {
    const [error, setError] = useState(null);
    const { setUser } = useContext(MyContext);

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        console.log('Archivo seleccionado:', file);

        if (file) {
            const formData = new FormData();
            formData.append('imageable_type', 'users');
            formData.append('imageable_id', profileData.id);
            formData.append('image', file);

            console.log('Datos del FormData:', {
                imageable_type: formData.get('imageable_type'),
                imageable_id: formData.get('imageable_id'),
                image: formData.get('image').name,
            });

            try {
                const userSession = JSON.parse(sessionStorage.getItem('user'));
                console.log('Sesión del usuario:', userSession);

                const token = userSession?.token?.access_token;
                console.log('Token de autorización:', token);

                const response = await axios.post(`${END_POINT}/images`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                    },
                });

                console.log('Respuesta del servidor:', response.data);

                if (response.status === 201) {
                    const newImagePath = response.data.data.path;
                    console.log('Nueva ruta de la imagen:', newImagePath);

                    // Actualizar el avatar en el componente padre
                    updateAvatar(newImagePath);

                    // Actualizar el contexto global
                    setUser(prevUser => ({
                        ...prevUser,
                        user: {
                            ...prevUser.user,
                            images: {
                                path: newImagePath
                            }
                        }
                    }));

                    // Actualizar la sesión del usuario
                    const updatedUserSession = {
                        ...userSession,
                        user: {
                            ...userSession.user,
                            images: {
                                path: newImagePath
                            }
                        }
                    };
                    sessionStorage.setItem('user', JSON.stringify(updatedUserSession));

                    setError(null);
                } else {
                    console.log('Código de estado de la respuesta:', response.status);
                    setError('No se pudo subir el avatar.');
                }
            } catch (error) {
                console.error('Error completo:', error.response ? error.response.data : error);
                setError('Error al subir el avatar: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
            }
        } else {
            console.log('No se ha seleccionado ningún archivo.');
        }
    };

    return (
        <>
            <Button
                variant="contained"
                component="label"
                sx={{ marginTop: '0.5rem' }}
            >
                Cargar Imagen
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleAvatarUpload}
                />
            </Button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
    );
};

export default ImgRegistro;
