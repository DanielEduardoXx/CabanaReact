import axios from "axios";

const API_URL = 'http://127.0.0.1:8000/api/V1/categorias';

export const allProductosCat = async (id) => {

    try {
        const resultado = await (axios.get(`${API_URL}/${id}?included=productos`));
        console.log('Fetch initiated'); // Verificar que la solicitud se inició;
        console.log('API Response: ', resultado.data[0].productos); // Verificar los datos aquí
        return resultado.data[0].productos;
    } catch (error) {
        throw (error, "nada")
    }

}