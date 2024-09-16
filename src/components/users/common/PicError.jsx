import { Box } from "@mui/material";

export default function PicError() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'center',
                    margin: '10px 0 0 0 '
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display:'flex',
                        justifyContent: 'center',
                        height: '100%',
                        zIndex: 1
                    }}

                >
                    <Box
                        sx={{
                            width: '20%',
                            height: '20%',
                        }}
                    >
                        <img
                            src="../../../public/error/PicError.png"
                            alt="Login"
                            style={{
                                width: '100%',
                                height: '50%',
                                objectFit: 'cover',
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </>
    )
}