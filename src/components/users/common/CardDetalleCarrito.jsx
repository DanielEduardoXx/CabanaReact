import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CtrlCantidad from "./CtrlCantidad";
import DeleteIcon from "@mui/icons-material/Delete";

function CardDetalleCarrito({
  id,
  titulo,
  precio,
  foto,
  monitor,
  noProductos,
  eliminar,
}) {
  const [cantidad, setCantidad] = useState(noProductos);

  useEffect(() => {
    setCantidad(noProductos);
  }, [noProductos]);

  const getCantidad = (valor) => {
    setCantidad(valor);

    let objeto = {
      id: id,
      cantidad: valor,
      fuente: "CardDetalleCarrito",
    };
    monitor(objeto);
  };

  const getBorrar = () => {
    let objeto = {
      id: id,
      cantidad: cantidad,
    };
    eliminar(objeto);
  };

  // formatear los valores con punto de miles
  let nf = new Intl.NumberFormat("en-US");
  let subTotal = precio * cantidad;

  let precioFormat = nf.format(precio);
  let subTotalFormat = nf.format(subTotal);

  console.log('Props in CardDetalleCarrito:', { id, titulo, precio, foto, noProductos, cantidad, subTotal }); // Verifica los props y valores calculados

  return (
    <Paper elevation={3} sx={{ margin: "1rem", width: "95%" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ width: { xs: "30%", md: "30%" }, padding: "0.5rem" }}>
            <Button
              color="error"
              sx={{ width: "100%" }}
              variant="contained"
              endIcon={<DeleteIcon />}
              onClick={getBorrar}
            >
              Borrar
            </Button>
          </Box>

          <Box
            sx={{
              width: { xs: "0%", md: "20%" },
              margin: "0.5rem",
              visibility: { xs: "hidden", md: "visible" },
            }}
          >
            <img
              style={{ width: "100%", borderRadius: "0.25rem" }}
              src={foto}
              alt={titulo}
            />
          </Box>

          <Box sx={{ width: { xs: "70%", md: "50%" }, padding: "0.5rem" }}>
            <Typography fontSize={18} textAlign={"justify"}>
              {titulo}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ width: "30%", padding: "0.5rem" }}>
            <Typography fontSize={20} textAlign={"justify"}>
              v/u $ {precioFormat}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "45%",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <CtrlCantidad
              noProductos={cantidad}
              getCantidad={getCantidad}
              borrar={getBorrar}
            />
          </Box>

          <Box sx={{ width: "25%", padding: "0.5rem" }}>
            <Typography fontSize={20} textAlign={"justify"}>
              $ {subTotalFormat}
            </Typography>
          </Box>

        </Box>
      </Box>
    </Paper>
  );
}

export default CardDetalleCarrito;
