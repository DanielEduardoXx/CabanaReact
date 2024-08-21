import axios from "axios";


const API_DESCARGAR_PDF = 'http://arcaweb.test/api/V1/pdf/comprobante'


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

export const DescargarPDF = async (id) => {
    let token = getToken();
    if (!token) {
        throw new Error('Token no Disponible');
    }

    try {
        const response = await axios.post(`${API_DESCARGAR_PDF}`, 
            { id }, // Envía el id en el cuerpo de la solicitud
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob' // Asegúrate de que la respuesta sea un blob (archivo binario)
            }
        );

        if (response.status === 200) {
            // Crear un enlace para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            console.log('url',url)
            link.href = url;
            link.setAttribute('download', 'archivo.pdf'); // Cambia el nombre del archivo si es necesario
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            console.log('PDF descargado correctamente');
        } else {
            console.log('url',url)
            throw new Error('Error al descargar el PDF');
        }
    } catch (error) {
        console.error('Error en la descarga del PDF:', error);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }

        if (error.response?.status === 401) {
            try {
                const newSession = await refresh_token();
                
                if (newSession && newSession.token?.access_token) {
                    token = newSession.token.access_token;
                    setToken(token);

                    const retryResponse = await axios.post(`${API_DESCARGAR_PDF}`, 
                        { id }, // Envía el id en el cuerpo de la solicitud
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            responseType: 'blob' // Asegúrate de que la respuesta sea un blob (archivo binario)
                        }
                    );

                    if (retryResponse.status === 200) {
                        // Crear un enlace para descargar el archivo
                        const url = window.URL.createObjectURL(new Blob([retryResponse.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'archivo.pdf'); // Cambia el nombre del archivo si es necesario
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        console.log('PDF descargado correctamente');
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