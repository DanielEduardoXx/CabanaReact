import { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, Grid, IconButton,  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CtrlCantidad from "./CtrlCantidad";

function CardDetalleCarrito({
  id,
  titulo,
  precio,
  foto,
  monitor,
  noProductos,
  detalle,
  eliminar,
}) {
  const [cantidad, setCantidad] = useState(noProductos);

  useEffect(() => {
    setCantidad(noProductos);
  }, [noProductos]);

  const getCantidad = (valor) => {
    setCantidad(valor);
    let objeto = { id, cantidad: valor, fuente: "CardDetalleCarrito" };
    monitor(objeto);
  };

  const getBorrar = () => {
    let objeto = { id, cantidad };
    eliminar(objeto);
  };

  let nf = new Intl.NumberFormat("en-US");
  let subTotal = precio * cantidad;
  let precioFormat = nf.format(precio);
  let subTotalFormat = nf.format(subTotal);
  
  return (
    <Paper elevation={4} sx={{ margin: "1rem 0", padding: "1.5rem", borderRadius: "10px" }}>
      <Grid container spacing={2} alignItems="center">
        
        <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton color="error" onClick={getBorrar}>
            <DeleteIcon />
          </IconButton>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={foto}
            alt={titulo}
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold' }}>
            {titulo}
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ color: 'text.secondary' }}>
            {detalle}
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <Typography variant="body1" textAlign="center">
            v/u ${precioFormat}
          </Typography>
        </Grid>

        <Grid item xs={12} md={3} sx={{display:'flex', justifyContent:'center'}}>
          <CtrlCantidad noProductos={cantidad} getCantidad={getCantidad} borrar={getBorrar} />
        </Grid>

        <Grid item xs={12} md={1}>
          <Typography variant="h6" textAlign="center" sx={{ fontWeight: 'bold' }}>
            ${subTotalFormat}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CardDetalleCarrito;