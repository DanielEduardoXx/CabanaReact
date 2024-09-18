import { Box } from "@mui/material";
import PicError from "./PicError";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { Title } from "@mui/icons-material";

export default function VerificacionCuenta() {
    const navigate = useNavigate();

    const handleIndex = () => {
        navigate('/iniciar-sesion');
    };

    return (
        <>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100vh', // Asegura que el Box ocupe el 100% del alto de la pantalla
                    width: '100vw', // Asegura que el Box ocupe el 100% del ancho de la pantalla
                }}
            >
                <Card 
                    sx={{ 
                        padding: '2rem', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        boxShadow: 3 
                    }}
                >
                    <h1 sx={{ marginBottom: '1rem' }}>
                        ¡Gracias!
                    </h1>
                    <h4 sx={{ marginBottom: '1rem' }}>
                        Te Damos la Bienvenida
                    </h4>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}
                    >
                        <Stack sx={{ width: '100%', marginBottom: '1rem' }} spacing={2}>
                            <Alert severity="success">Haz verificado tu correo correctamente, ahora podras completar tus compras, descargar tus comprobantes y mucho más!</Alert>
                        </Stack>
                        <Button variant="contained" onClick={handleIndex}>Iniciar Sesion</Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
