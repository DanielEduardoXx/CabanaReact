import axios from 'axios';

const API_URL = 'http://arcaweb.test/api/V1/images/categorias';

const get_imagenes_cat = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    console.log("imagene", response)

    // Verifica si la estructura de la respuesta es la esperada
    if (response.data && response.data.data) {
      return response.data.data; // Devuelve las imágenes
    } else {
      console.warn(`No se encontraron imágenes para la categoria con ID: ${id}`);
      return []; // Devuelve un array vacío si no hay imágenes
    }
  } catch (error) {
    console.error("Error fetching product images:", error.message);
    throw error; // Lanza el error para que pueda ser manejado por el llamador
  }
};

export default get_imagenes_cat;
