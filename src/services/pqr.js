// services/pqr.js
import axios from 'axios';

const sendSuggestion = async (data) => {
    const response = await axios.post('/api/suggestions', data);
    return response.data;
};

export default {
    sendSuggestion,
};
