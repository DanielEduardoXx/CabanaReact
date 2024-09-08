import axios from "axios";

const END_POINT = "http://arcaweb.test/api/V1";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProductos = async () => {
    try {

        const response = await axios.get(`${END_POINT}/productos`);
        console.log('API Response:', response.data.data); // Verificar los datos aquí

        await delay(1000); // Delay para evitar múltiples solicitudes rápidas
        return response.data.data;

    } catch (error) {
        if (error.response) {
            // El servidor respondió con un estado diferente de 2xx
            console.error("Error en la respuesta del servidor:", error.response.status, error.response.data);
        } else if (error.request) {
            // La solicitud se hizo pero no se recibió respuesta
            console.error("No se recibió respuesta del servidor:", error.request);
        } else {
            // Ocurrió un error en la configuración de la solicitud
            console.error("Error al configurar la solicitud:", error.message);
        }
        throw new Error("No se pudieron obtener los productos. Intenta nuevamente más tarde.");
    }
};
