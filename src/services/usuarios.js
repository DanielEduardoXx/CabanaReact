import axios from "axios";



const API_URL = 'http://arcaweb.test/api/V1/password-reset-request';

export const recuperarPasswordEmail = async (email) => {
    try {
        const resultado = await axios.post(`${API_URL}`, { email });
        console.log('API Response: ', resultado);
        return resultado.data;
    } catch (error) {
        console.error("Error enviando datos:", error);
        throw error;
    }
};