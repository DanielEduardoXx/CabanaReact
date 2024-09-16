import { Box } from "@mui/material";
import PicDesconectado from "./PicDesconectado";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

export default function AlertDesconectado() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/iniciar-sesion');
    };

    return (
        <>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh', // Ocupa toda la pantalla
                width: '100%', 
                backgroundColor: '#f0f0f0' // O puedes usar un color de fondo si lo deseas
            }}>
                <Card sx={{ 
                    padding: '2rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    boxShadow: 3 // Agrega una sombra al card si lo deseas
                }}>
                    <Box>
                        <PicDesconectado />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="warning">¡Ops! Parece que estás desconectado.</Alert>
                        </Stack>
                        <Button onClick={handleLogin} variant="contained" sx={{ marginTop: '1rem' }}>
                            Iniciar sesión
                        </Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}
