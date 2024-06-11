import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function PicProducto({ foto, precio }) {

  // fomato de nuemeros en miles .....
  let nf = new Intl.NumberFormat("en-US");
  let precioFormat = nf.format(precio);

  return (
    <Box sx={{ width: "auto", padding: "0.5rem"  , position: 'relative' }}>
      <img style={{ width: "100%", borderRadius: "1rem" }} src={foto} />
      <Box
        sx={{
          padding: "0.5rem",
          borderRadius: "5px",
          bgcolor: "#ffffff",
          zIndex: "10",
          position: "absolute",
          top:"1rem",
          right: "2rem"
        }}
      >
        <Typography fontSize={25}> $ {precioFormat} </Typography>
      </Box>
    </Box>
  );
}

export default PicProducto;
