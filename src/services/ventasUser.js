import axios from 'axios';

const API_URL = 'http://arcaweb.test/api/V1/ventas';
const API_DET_URL = 'http://arcaweb.test/api/V1/detventas';
const API_DELETE_URL = 'http://arcaweb.test/api/V1/ventas';
const API_COMPRAS_URL = 'http://arcaweb.test/api/V1/users';

const userSession = JSON.parse(sessionStorage.getItem('user'));

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
console.log("Hola userSession", userSession); 
const token = userSession?.token?.access_token; // Asegúrate de que la estructura coincide con el almacenamiento
console.log("Hola", token); 



export const ventasUser = async (ventaData) => {
    let token = getToken(); 
    if (!token) {
        throw new Error('Token no disponible');
    }

    try {
        const response = await axios.post(API_URL, ventaData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 201) {
            console.log('Venta creada correctamente');
            return response.data;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error en ventasUser:', error);

        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token(); 
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.post(API_URL, ventaData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 201) {
                        console.log('Venta creada correctamente');
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
export const detVentasUser = async (detVentaData) => {
    let token = getToken(); 
    if (!token) {
        throw new Error('Token no disponible');
    }
    try {
        const response = await axios.post(API_DET_URL, detVentaData, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Incluye el token en las cabeceras
                'Content-Type': 'application/json',
            }
        });
        if (response.status === 200 || response.status === 201) {
            console.log('Detalle de venta creado correctamente');
            return response.data;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error al enviar los detalles de la venta:', error);
        
        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token(); 
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.post(API_URL, ventaData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 201) {
                        console.log('Venta creada correctamente');
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

export const deleteVentaUser = async (id) => {
    let token = getToken(); // Usa let para permitir la actualización del token
    if (!token) {
        throw new Error('Token no Disponible');
    }

    try {
        // Realiza la solicitud DELETE con el token actual
        const response = await axios.delete(`${API_DELETE_URL}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log('Se ha eliminado correctamente');
            return response.data;
        } else {
            throw new Error('Error al eliminar venta');
        }
    } catch (error) {
        console.error('Error en deleteVentaUser:', error);

        // Si el error es 401 (No autorizado), intenta refrescar el token
        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token();
                
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token; // Actualiza el token
                    setToken(token); // Guarda el nuevo token en el almacenamiento

                    // Reintenta la solicitud DELETE con el nuevo token
                    const retryResponse = await axios.delete(`${API_DELETE_URL}/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 200) {
                        console.log('Se ha eliminado correctamente después de refrescar el token');
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

        // Manejo de otros errores
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};



export const getAllCompras = async (id) => {
    let token = getToken();
    if (!token) {
        throw new Error('Token no Disponible');
    }

    try {
        const response = await axios.get(`${API_COMPRAS_URL}/${id}?included=ventas`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            console.log('Compras Traidas Correctamente');
            return response.data; // Asegúrate de que response.data contiene las ventas
        } else {
            throw new Error('Error al traer ventas');
        }
    } catch (error) {
        console.error('Error en ventas:', error);

        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token();
                
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.get(`${API_COMPRAS_URL}/${id}?included=ventas`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (retryResponse.status === 200) {
                        console.log('Compras Traídas Correctamente Después de Refrescar el Token');
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

        throw new Error('No se pudo conectar con el servidor');
    }
};
