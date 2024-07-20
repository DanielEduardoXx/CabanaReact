import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/V1/ventas';
const API_DET_URL = 'http://127.0.0.1:8000/api/V1/detventas';

export const ventasUser = async (ventaData) => {
    try {
        const response = await axios.post(API_URL, ventaData);
        if (response.status === 201) {
            console.log('Venta creada correctamente');
            return response.data;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error en ventasUser:', error);
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};

export const detVentasUser = async (detVentaData) => {
    try {
        const response = await axios.post(API_DET_URL, detVentaData);
        if (response.status === 200 || response.status === 201) {
            console.log('Detalle de venta creado correctamente');
            return response.data;
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error al enviar los detalles de la venta:', error);
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.error || 'Error desconocido';
            throw new Error(errorMessage);
        } else {
            throw new Error('No se pudo conectar con el servidor');
        }
    }
};
