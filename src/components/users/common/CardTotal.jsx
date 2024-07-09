

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";


function CardTotal({ valor }) {


  // Formato de numeros en punto de miles 
  let nf = new Intl.NumberFormat("en-US");
  let valorFormat = nf.format(valor);


  console.log('valor total', { valor })

  return (
    <Paper
      elevation={3}
      sx={{ margin: "1rem", maxWidth: { xs: "100%", md: "100%" } }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: 'center',
          background: "#48C9B0",

        }}
      >
        <Box sx={{ padding: "0.5rem", marginRight: "2rem" }}>

          <Typography fontSize={22} textAlign={"left"}>
            Valor Total  $ {valorFormat}
          </Typography>


        </Box>
      </Box>

    </Paper>
  );
}

export default CardTotal;
