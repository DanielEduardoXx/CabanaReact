

import HeaderComponent from "./common/PicInicio";
import { Box, Typography } from "@mui/material";
import PicIndex from "./common/PicIndex";



function Inicio() {

  return (
    <Box sx={{ width: '100%' }}>

      <Box>
        <HeaderComponent>

        </HeaderComponent>

      </Box>

      <Box sx={{ display: 'flex' }}>

        <Box sx={{ minWidth: '50%' }}>

          <h3>Sobre Nosotros</h3>
          <Typography>Contamos con los mejores estandares de calidad para traer a sus casas la mejor comida rapida que ustedes pueden degustar.
            Nos aseguramos que nuestra materia prima sea de la mejor calidad para contar con su total confiabilidad y siempre seamos tu primera opcion. Te invitamos a Revisar nuestro menú en el siguiente link</Typography>
            <h3>Metodos De Pago</h3>
            <Typography>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus soluta minima odit possimus optio! Vitae corporis modi minima dolor delectus eum sint magnam beatae quaerat odit inventore iusto, dignissimos quis.</Typography>

        </Box>

        <Box sx={{ minWidth: '50%' }}>
          <PicIndex />
        </Box>

      </Box>
    </Box>

  );

}
export default Inicio;