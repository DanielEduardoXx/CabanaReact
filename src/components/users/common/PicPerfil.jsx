import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function PicPerfil() {


    return (
        <Box sx={{ width: "auto", padding: "0.5rem", position: 'relative' }}>
            <img src="../../../../public/user_1.svg" alt="Foto de perfil" style={{ width: '150px', height: '150px', borderRadius: '50%' }} />
        </Box>
    );
}

export default PicPerfil;
