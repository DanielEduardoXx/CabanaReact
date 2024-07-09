import { Box } from "@mui/material";
import { Typography,Link } from '@mui/material';
export default function Footer() {
    return (
      <Box sx={{ backgroundColor: '#f8f8f8', padding: '1rem', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 Arca. Todos los derechos reservados.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
          <Link href="#" sx={{ margin: '0 1rem' }}>
            Términos de Servicio
          </Link>
          <Link href="#" sx={{ margin: '0 1rem' }}>
            Política de Privacidad
          </Link>
          <Link href="#" sx={{ margin: '0 1rem' }}>
            Contáctanos
          </Link>
        </Box>
      </Box>
    );
  }