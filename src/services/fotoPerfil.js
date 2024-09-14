import axios from 'axios';
import refresh_token from './token';

const API_URL = 'http://arcaweb.test/api/V1/images';

const getToken = () => {
    const userSession = JSON.parse(sessionStorage.getItem('user'));
    return userSession?.token?.access_token;
};

function setToken(newToken) {
    let session = JSON.parse(sessionStorage.getItem('user'));
    if (session) {
        session.token.access_token = newToken;
        sessionStorage.setItem('user', JSON.stringify(session));
    }
}


// Función para obtener la imagen de perfil
export const fetchProfileImage = async (userId) => {
    const token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.data) {
            throw new Error('Error en la solicitud: Datos vacíos');
        }

        const imageId = response.data.data.id;
        const imageUrl = response.data.data.path;
        const fullImageUrl = `http://arcaweb.test/${imageUrl}`;

        sessionStorage.setItem('profileImageId', imageId);
        sessionStorage.setItem('profileImage', fullImageUrl);

        return { imageId, fullImageUrl };
    } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
        sessionStorage.removeItem('profileImage'); // Limpiar si hay error
        throw error;
    }
};


export const fotoPerfil = async (userId, image) => {
    const formData = new FormData();
    formData.append('imageable_type', 'users');
    formData.append('imageable_id', userId); // Usar el userId para crear la imagen
    formData.append('image', image);

    const token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        // Intentar crear la imagen
        const response = await axios.post(`${API_URL}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });

        // Si la creación es exitosa, obtén el ID de la imagen de la respuesta
        const imageId = response.data.data.id;
        console.log('Imagen creada con éxito, ID:', imageId);

        return imageId; // Devolver el ID de la imagen creada
    } catch (error) {
        console.error('Error en subir img:', error.response?.data || error.message);

        // Verificar si el error es debido a que ya existe una imagen
        if (error.response?.data?.message?.includes('Ya hay una imagen asignada, por favor actualícela o elimínela')) {
            console.log('Ya hay una imagen asignada, actualizando la imagen existente...');

            // Obtener el ID de la imagen existente del sessionStorage o el error
            const existingImageId = sessionStorage.getItem('profileImageId');

            if (existingImageId) {
                // Intentar actualizar la imagen existente
                try {
                    const updateResponse = await updateFoto(existingImageId, image);
                    return updateResponse;
                } catch (updateError) {
                    console.error('Error al intentar actualizar la imagen:', updateError.response?.data || updateError.message);
                    throw updateError;
                }
            } else {
                throw new Error('No se encontró el ID de la imagen existente para actualizar.');
            }
        } else {
            console.error('Error al subir la imagen:', error.response?.data?.message || error.message);
            throw error;
        }
    }
};

// Función para actualizar la imagen del perfil existente
export const updateFoto = async (imageId, userId, image) => {
    const formData = new FormData();
    formData.append('imageable_type', 'users');
    formData.append('imageable_id', userId); // Usar el ID de la imagen existente
    formData.append('image', image);


    // Verifica los datos en `FormData`
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

    let token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/${imageId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Imagen actualizada correctamente:', response.data);
        return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error('Error en updateFoto:', error);

        if (error.response?.status === 401) {
            // Intentar refrescar el token y reintentar
            try {
                const newSession = await refresh_token();
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.post(`${API_URL}/${imageId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 201) {
                        console.log('Imagen actualizada correctamente después de reintentar');
                        return retryResponse.data;
                    } else {
                        throw new Error('Error en la respuesta del servidor al reintentar');
                    }
                } else {
                    throw new Error('No se pudo obtener un nuevo token de acceso');
                }
            } catch (refreshError) {
                console.error('Error al refrescar el token:', refreshError);
                throw refreshError;
            }
        }

        throw new Error(axios.isAxiosError(error) ? error.response?.data?.error : 'No se pudo conectar con el servidor');
    }
};


// Eliminar Foto de Perfil
export const eliminarFoto = async (imageId, userId) => {

    let token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        const response = await axios.delete(`${API_URL}/users/${userId}/${imageId}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Imagen Eliminada correctamente:', response.data);
 
        return response.data; // Devuelve la respuesta del servidor
    } catch (error) {
        console.error('Error en updateFoto:', error);

        if (error.response?.status === 401) {
            // Intentar refrescar el token y reintentar
            try {
                const newSession = await refresh_token();
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.delete(`${API_URL}/users/${userId}/${imageId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 201) {
                        console.log('Imagen Eliminada correctamente después de reintentar');
                        return retryResponse.data;
                    } else {
                        throw new Error('Error en la respuesta del servidor al reintentar');
                    }
                } else {
                    throw new Error('No se pudo obtener un nuevo token de acceso');
                }
            } catch (refreshError) {
                console.error('Error al refrescar el token:', refreshError);
                console.log("Z>>>", token)
                throw refreshError;
            }
        }

        throw new Error(axios.isAxiosError(error) ? error.response?.data?.error : 'No se pudo conectar con el servidor');
    }
};
