import axios from 'axios';

const API_URL = 'http://arcaweb.test/api/V1/refreshToken';

const refresh_token = async () => {
    const session = JSON.parse(sessionStorage.getItem("user"));
    console.log(">>", session);

    try {
        const response = await axios.post(`${API_URL}`, {
            user_id: session?.user?.id, // Envía el user_id
            refresh_token: session?.token?.refresh_token, // Envía el refresh_token
        });

        const newTokenData = response.data;

        if (newTokenData?.access_token) {
            // Si hay un nuevo token, actualízalo en la sesión existente
            session.token.access_token = newTokenData.access_token;
            session.token.refresh_token = newTokenData.refresh_token || session.token.refresh_token; // Si se proporcionó un nuevo refresh_token, actualizarlo
            sessionStorage.setItem("user", JSON.stringify(session));
        } else {
            // Manejo en caso de que no haya un nuevo token en la respuesta
            console.error('No se recibió un nuevo token de acceso');
        }

        return session;
    } catch (error) {
        console.error('Error en refresh_token:', error);
        sessionStorage.removeItem("user"); // Eliminar la sesión solo si ocurre un error en la solicitud
        throw error;
    }
};

export default refresh_token;
