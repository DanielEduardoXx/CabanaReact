import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/V1';

export const login = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token); // Guarda el token en localStorage
      return response.data;
    } else {
      throw new Error('Las Credenciales No Coinciden');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Error desconocido';
      throw new Error(errorMessage);
    } else {
      throw new Error('Error: No se pudo conectar con el servidor');
    }
  }
};
