import Box from '@mui/material/Box';


export default function PicDesconectado() {
    return (
        <>
            <Box>
                <img
                    src="../../../public/desconectado.png"
                    alt="Login"
                    style={{
                        width: '5rem',
                        maxHeight: '5rem',
                        objectFit: 'cover',
                    }}
                />
            </Box>
        </>
    )
}