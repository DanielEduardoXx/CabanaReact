import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function Ubicacion() {

    // URL de Google Maps Embed con la ubicación del negocio
    const mapaUrl = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d418.018432280895!2d-74.10918305525745!3d4.61478099959152!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9945a966b951%3A0xa94fd2687d6926e1!2sPIZZER%C3%8DA%20BROASTER%20LA%20CABA%C3%91A!5e0!3m2!1ses!2sco!4v1717128468955!5m2!1ses!2sco';

    // URL de la imagen
    const imageUrl = '../../public/img/nature-2813487_1920.jpg'; // Cambia esta URL por la URL de tu imagen

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>

                {/* Agregar el iframe del mapa aquí */}
                <Box sx={{
                    mb: 1,
                    width: { xs: "100%", md: "100%" },
                    display: "flex",
                    justifyContent: "center",
                }}
                >
                    <img
                        title="imagen header"
                        src={imageUrl}
                        width="100%"
                        height="450"
                        loading="lazy"
                        style={{ border: 0 }} // Quitar el borde del iframe
                    ></img>
                </Box>

                <Box>
                    <Typography
                        variant="h2"
                        justifyContent="center"
                        sx={{
                            mb: 1,
                            width: { xs: "100%", md: "100%" },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'white',
                            background: "#FD2626",
                            display: "flex",
                        }}
                    >
                        NUESTRA UBICACION
                    </Typography>
                </Box>

                <Box>
                    <Typography
                        variant="h2"
                        justifyContent="center"
                        sx={{
                            mb: 1,
                            width: { xs: "100%", md: "100%" },
                            display: "flex",
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'white',
                            background: "#FD2626",
                        }}
                    >
                        NUESTRO ESTABLECIMIENTO ESTA UBICADO EN EL CORAZON DE LA CIUDAD
                    </Typography>

                    <Box>
                    {/* Agregar el iframe del mapa aquí */}
                    <iframe
                        title="Ubicación del Negocio"
                        src={mapaUrl}
                        width="100%"
                        height="250"
                        loading="lazy"
                        style={{ border: 0 }} // Quitar el borde del iframe
                    ></iframe>
                    </Box>
                    
                </Box>

            </CardContent>

            {/*
            <CardActions>
                <Button size="small">Learn More</Button>
                    </CardActions>*/}
        </Card>
    );
}

export default Ubicacion;