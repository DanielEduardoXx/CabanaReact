import axios from "axios";



const  END_POINT = "https://randomuser.me/api/"

export const getUsuarios = async () => {
    try {
    const response = await axios.get(END_POINT);
    // console.log ("datos servicio ... " + JSON.stringify(response.data))
    return(response.data);
} catch (error) {
    return ("error" + error)
}
};


