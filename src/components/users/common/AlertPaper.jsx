import { Box } from "@mui/material";
import PicError from "./PicError";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

export default function AlertError() {
    const navigate = useNavigate();

    const handleIndex = () => {
        navigate('/inicio');
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
                    <Box sx={{ marginBottom: '1rem' }}>
                        <PicError />
                    </Box>

                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                        }}
                    >
                        <Stack sx={{ width: '100%', marginBottom: '1rem' }} spacing={2}>
                            <Alert severity="warning">Ops! Hay un problema, estamos trabajando en ello</Alert>
                        </Stack>
                        <Button variant="contained" onClick={handleIndex}>Ir al Inicio</Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
