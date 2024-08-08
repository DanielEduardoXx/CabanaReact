import { Box } from "@mui/material";
import PicDesconectado from "./PicDesconectado";
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { Navigate, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";



export default function AlertDesconectado() {
    const navigate = useNavigate();






    const handleLogin = () => {
        navigate('/iniciar-sesion');
    }
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth:'100%'}}>
                <Card sx={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

                    <Box >
                        <PicDesconectado />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="warning"> Ops! Parece que estas desconectado</Alert>
                        </Stack>
                        <Button onClick={handleLogin}>Iniciar sesion
                        </Button>

                    </Box>
                </Card>

            </Box>


        </>
    )
}