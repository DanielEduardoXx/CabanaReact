import axios from "axios";



const  END_POINT = "http://arcaweb.test/api/V1/productos"

export const getProductos = async () => {
    try {
    const response = await axios.get(END_POINT);
    // console.log ("datos servicio ... " + JSON.stringify(response.data))
    console.log(response)
    return(response.data.data);

} catch (error) {
    return ("error" + error)
}
};