import { } from 'react';
import { Box, Paper } from "@mui/material";
import CamposRegistro from "./Campospqr";
import PicRegistro from "./Picpqr";
const PaperWrapper = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    width: { md: '60%', sm: '100%', xs: '100%' },
    position: { md: 'absolute' },
    padding: '2rem',
    height: 'auto',
    maxHeight: '500px',
    overflowY: 'auto',
    overflowX: 'hidden',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '15px',
};

export default function CardRegistro() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <PicRegistro sx={{ position: 'relative' }} />
                <Paper elevation={4} sx={PaperWrapper}>
                    <h1>Sugerencias</h1>
                    <CamposRegistro />
                </Paper>
            </Box>
        </>
    );
}
