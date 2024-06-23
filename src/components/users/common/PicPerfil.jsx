import { Box } from "@mui/material";

export default function PicPerfil() {
    return (
        <>
            <Box
                sx={{
                    display: { xs: 'none' },
                    flexDirection: { xs: 'column', md: 'row' },
                    width: '100%',
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: { xs: 'none', sm: 'flex', md: 'block' },
                        height: '100%',
                        zIndex: 1
                    }}

                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <img
                            src="../../../public/picPerfil.jpg"
                            alt="Perfil"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}