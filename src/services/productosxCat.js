import axios from "axios";

const API_URL = 'http://arcaweb.test/api/V1/categorias';

export const allProductosCat = async (id) => {
  try {
    const resultado = await axios.get(`${API_URL}/${id}?included=productos`);
    console.log('API Response: ', resultado.data.data.productos); 
    return resultado.data.data.productos;
  } catch (error) {
    console.error("Error fetching productos:", error);
    throw error;
  }
};