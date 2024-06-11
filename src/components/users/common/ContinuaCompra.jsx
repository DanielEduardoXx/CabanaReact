import { Box } from "@mui/material";
import Paper from '@mui/material/Paper';
import CamposLogin from "./CamposLogin";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

function ContinuaCompra() {
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                <Paper sx={{ display: 'flex', width: '80%', padding: '2rem' }}>
                    <Box sx={{ width: { sm: '40%', md: '40%' }, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5rem', marginRight: { md: '1rem' }, justifyContent: 'space-between' }}>
                        <AccountCircleIcon
                            sx={{
                                width: '3rem',
                                height: '3rem',
                            }} />

                        <h2>Sing In</h2>
                        <CamposLogin />

                    </Box>
                    <Box sx={{ width: { sm: '60%', md: '60%' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>

                        <h2>Compra como invitado</h2>

                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non qui quas voluptatem esse odio vero provident illum laboriosam architecto repellat ducimus nisi ad, fugit magnam atque error molestiae itaque ipsum!</p>     

                        <Link to='/checkout'>
                            <Button variant="contained" color="primary" sx={{ width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' } }}>
                                checkout
                            </Button>
                        </Link>

                    </Box>
                </Paper>

            </Box >
        </>

    )
}

export default ContinuaCompra