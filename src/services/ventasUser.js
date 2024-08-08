import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/V1/ventas';

export const ventasUser = async (ventaData) => {
    try {
        const response = await axios.post(API_URL, ventaData);

        if (response.status === 200) {
            console.log('Venta creada correctamente');
            console.log(response.data);
            return response.data;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};
