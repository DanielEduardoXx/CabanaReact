import { Box } from "@mui/material";
import Paper from '@mui/material/Paper';
import CamposRegistro from "./CamposRegistro";
import PicRegistro from "./PicRegistro";
export default function CardRegistro() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent:'center'
                }}
            >
                    <PicRegistro
                    sx={{position:'relative'}}
                    ></PicRegistro>
                <Paper
                elevation={4}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignContent: 'center',
                        width:{md:'60%', sm:'100%', xs:'100%'},
                        position:{md:'absolute'},
                        padding:'2rem'
                    }}>

                    <h1>Registrate</h1>

                    <CamposRegistro/>

                </Paper>

            </Box>

        </>
    )
}