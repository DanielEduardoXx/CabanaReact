import axios from "axios";


const END_POINT = "http://arcaweb.test/api/V1";

export const allCategorias = async () => {
    try {
        console.log('Fetch initiated'); // Verificar que la solicitud se inició
        const response = await axios.get(`${END_POINT}/categorias`);
        console.log('API Response:', response.data.data); // Verificar los datos aquí
        return response.data.data;
      } catch (error) {
        console.error('Fetch error:', error); // Verificar errores aquí
        throw error;
      }
    };
    
