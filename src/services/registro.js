import axios from 'axios';

const registro = {
    registrarUsuario: async (formData) => {
        const formattedFechaNaci = formData.fecha_naci.format('YYYY-MM-DD');
        const response = await axios.post('http://127.0.0.1:8000/api/V1/registro', {
            ...formData,
            fecha_naci: formattedFechaNaci,
            headers: {
                'Content-Type': 'multipart/form-data',
                'enctype': "multipart/form-data",
            },
        });
        return response.data;
    },
};

export default registro;
