import { Box } from "@mui/material";

export default function PicRegistro() {
    return (
        <>
            <Box
                sx={{
                    display: { xs: 'none', sm: 'none', md: 'block' },
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
                            src="../../../public/picRegistro.jpg"
                            alt="Login"
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