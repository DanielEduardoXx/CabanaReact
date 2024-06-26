import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/V1';

export const login = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 60000 // Aumenta el tiempo de espera a 60 segundos
    });

    if (response.status === 200) {
      // const { token } = response.data;
      console.log(response.data)
      // localStorage.setItem('access_token', token.access_token); // Guarda el token en localStorage

      return response.data;
    } else {
      throw new Error('Las credenciales no coinciden');
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
