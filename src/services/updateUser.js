import axios from 'axios';
import refresh_token from './token';

const API_URL = 'http://arcaweb.test/api/V1';

function setToken(newToken) {
    let session = JSON.parse(sessionStorage.getItem('user'));
    if (session) {
        session.token.access_token = newToken;
        sessionStorage.setItem('user', JSON.stringify(session));
    }
}

function getToken() {
    const session = JSON.parse(sessionStorage.getItem('user'));
    return session?.token?.access_token;
}

const updateUser = async (userId, formData) => {
    let token = getToken(); // Declara `token` en un ámbito más amplio
    try {
        if (!token) {
            throw new Error('Token de acceso no disponible');
        }

        const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const userActual = response.data.user;
            console.log('User Actual:', userActual);

            const currentSession = JSON.parse(sessionStorage.getItem('user')) || {};
            currentSession.user = userActual;
            sessionStorage.setItem('user', JSON.stringify(currentSession));

            console.log('Session Storage Updated:', JSON.parse(sessionStorage.getItem('user')));

            return userActual;
        } else {
            throw new Error('No se pudo actualizar el usuario');
        }
    } catch (error) {
        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token();
                
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token; // Actualiza el token
                    setToken(token); // Guarda el nuevo token en el almacenamiento

                    // Reintenta la solicitud PUT con el nuevo token y `formData`
                    const retryResponse = await axios.put(`${API_URL}/users/${userId}`, formData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 200) {
                        console.log('Usuario Actualizado Correctamente');
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

        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

export { updateUser };