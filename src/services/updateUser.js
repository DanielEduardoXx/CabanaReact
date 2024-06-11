import axios from 'axios';

export const updateUser = async (userId, formData) => {
    try {
        const token = localStorage.getItem('access_token');
        const API_URL = 'http://127.0.0.1:8000/api/V1';


        if (!token) {
            throw new Error('Token de acceso no encontrado');
        }

        console.log(`PUT request to: ${API_URL}/users/${userId}`);
        console.log('Headers:', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        });
        console.log('Form Data:', formData);

        const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } else {
            throw new Error('No se pudo actualizar el usuario');
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




// const API_URL = 'http://127.0.0.1:8000/api/V1';

//   try {
//     const token = localStorage.getItem('access_token');

//     if (!token) {
//       throw new Error('Token de acceso no encontrado');
//     }

//     const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.status === 200) {
//       localStorage.setItem('user', JSON.stringify(response.data));
//       return response.data;
//     } else {
//       throw new Error('No se pudo actualizar el usuario');
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const errorMessage = error.response?.data?.message || 'Error desconocido';
//       throw new Error(errorMessage);
//     } else {
//       throw new Error('Error: No se pudo conectar con el servidor');
//     }
//   }
// };