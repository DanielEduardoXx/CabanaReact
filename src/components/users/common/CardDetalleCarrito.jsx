import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import CtrlCantidad from "./CtrlCantidad";
import CardProducto from "./CardProducto";

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
    <Paper elevation={3} sx={{ margin: "1rem", padding: "1rem" }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={2}>
          <Button
            color="error"
            fullWidth
            variant="contained"
            endIcon={<DeleteIcon />}
            onClick={getBorrar}
          >

          </Button>
        </Grid>

        <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
          <img
            src={foto}
            alt={titulo}
            style={{ width: "100%", borderRadius: "0.25rem" }}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Typography fontSize={18} textAlign="justify">
            {titulo}
          </Typography>
        </Grid>

        <Grid item xs={12} md={1}>
          <Typography fontSize={20} textAlign="center">
            v/u ${precioFormat}
          </Typography>
        </Grid>

        <Grid item xs={12} md={2}>
          <CtrlCantidad noProductos={cantidad} getCantidad={getCantidad} borrar={getBorrar} />
        </Grid>

        <Grid item xs={12} md={1}>
          <Typography fontSize={20} textAlign="center">
            ${subTotalFormat}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CardDetalleCarrito;
