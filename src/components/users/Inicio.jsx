import { Box, Typography, Paper } from "@mui/material";
import HeaderComponent from "./common/PicInicio";
import PicIndex from "./common/PicIndex";

function Inicio() {
  return (
    <Box sx={{ width: "100%" }}>
      <HeaderComponent />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
        <Box sx={{ flex: 1, p: 2 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Sobre Nosotros
            </Typography>
            <Typography variant="body1" textAlign="justify">
              Contamos con los mejores estándares de calidad para traer a sus
              casas la mejor comida rápida que ustedes pueden degustar. Nos
              aseguramos que nuestra materia prima sea de la mejor calidad para
              contar con su total confiabilidad y siempre seamos tu primera
              opción. Te invitamos a revisar nuestro menú en el siguiente link.
            </Typography>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Métodos de Pago
            </Typography>
            <Typography variant="body1" textAlign="justify">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Doloribus soluta minima odit possimus optio! Vitae corporis modi
              minima dolor delectus eum sint magnam beatae quaerat odit
              inventore iusto, dignissimos quis.
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, p: 2 }}>
          <PicIndex />
        </Box>
      </Box>
    </Box>
  );
}

export default Inicio;