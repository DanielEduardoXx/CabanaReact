import axios from 'axios';

const API_URL = 'http://arcaweb.test/api/V1/images';
const API_URL_UPDATE = 'http://arcaweb.test/api/V1/images';  // Asegúrate de que '2' sea el ID correcto o ajústalo según sea necesario

const getToken = () => {
    const userSession = JSON.parse(sessionStorage.getItem('user'));
    return userSession?.token?.access_token;
};

const updateFoto = async (userId, image) => {
    const formData = new FormData();  // Corrección aquí: instancia FormData
    formData.append('imageable_type', 'users');
    formData.append('imageable_id', userId);
    formData.append('image', image);

    const token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        const response = await axios.post(API_URL_UPDATE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar la imagen', error.response?.data || error.message);
        throw error;
    }
};

const fotoPerfil = async (userId, image) => {
    const formData = new FormData();
    formData.append('imageable_type', 'users');
    formData.append('imageable_id', userId);
    formData.append('image', image);

    const token = getToken();

    if (!token) {
        console.error('No se encontró un token de autenticación');
        return;
    }

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error en subir img', error.response?.data || error.message);

        if (error.response?.data?.message === 'Ya hay una imagen asignada, por favor actualícela o elimínela') {
            console.log('ya hay una imagen, intentando actualizar...');
            try {
                const updateResponse = await updateFoto(userId, image);
                return updateResponse;
            } catch (updateError) {
                console.error('Error al intentar actualizar la imagen', updateError.response?.data || updateError.message);
                throw updateError;
            }
        } else {
            setMessage('Error al subir la imagen: ' + (error.response?.data?.message || error.message));
        }
    }
};

export default fotoPerfil;
