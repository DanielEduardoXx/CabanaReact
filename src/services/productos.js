import axios from "axios";



const  END_POINT = "http://127.0.0.1:8000/api/V1/productos"

export const getProductos = async () => {
    try {
    const response = await axios.get(END_POINT);
    // console.log ("datos servicio ... " + JSON.stringify(response.data))
    return(response.data);
} catch (error) {
    return ("error" + error)
}
};