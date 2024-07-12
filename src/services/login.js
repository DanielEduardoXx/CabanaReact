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
      console.log("usuario:", response.data.role)

      return response.data; // Devuelve los datos del usuario
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



// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const API_URL = 'http://127.0.0.1:8000/api/V1';

// export const login = async (formData, setUser, navigate) => {
//   try {
//     const response = await axios.post(`${API_URL}/login`, formData, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       timeout: 60000 // Aumenta el tiempo de espera a 60 segundos
//     });

//     if (response.status === 200) {
//       const userData = response.data;
//       setUser(userData);  // Actualiza el contexto con la información del usuario
//       localStorage.setItem('user', JSON.stringify(userData));  // Guarda la información del usuario en localStorage

//       // Redirecciona al usuario según su rol
//       if (userData.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/inicio');
//       }

//       return userData;
//     } else {
//       throw new Error('Las credenciales no coinciden');
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.message || 'Error desconocido';
//       throw new Error(errorMessage);
//     } else {
//       throw new Error('No se pudo conectar con el servidor');
//     }
//   }
// };