import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import CtrlCantidad from "./CtrlCantidad";
import { useState, useEffect } from "react";

function CardProducto({ productos, agregarCompra }) {
  const [cantidades, setCantidades] = useState(() => {
    const savedCantidades = localStorage.getItem("cantidades");
    return savedCantidades ? JSON.parse(savedCantidades) : {};
  });

  useEffect(() => {
    localStorage.setItem("cantidades", JSON.stringify(cantidades));
  }, [cantidades]);

  const handleCantidadChange = (id, valor) => {
    setCantidades(prevCantidades => ({
      ...prevCantidades,
      [id]: valor
    }));
  };

  const handleComprar = (producto) => {
    if (!producto.id) {
      console.error('Producto sin id:', producto);
      return;
    }
    const compra = {
      id: producto.id,
      cantidad: cantidades[producto.id] || 0,
      producto: producto,
    };
    agregarCompra(compra);
  };

  const ruta = "../../../../../public";

  return (
    <Box sx={{ padding: "2rem", margin: "1rem" }}>
      <Grid container spacing={2}>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((producto) => {
            if (!producto.id) {
              console.error('Producto sin id:', producto);
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <Paper elevation={3} sx={{ padding: "1rem" }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{producto.nombre || producto.nom_producto}</Typography>
                      <img
                        src={`${ruta}/Hamburguesas.jpg`}
                        alt={producto.nombre}
                        style={{ width: "100px", height: "100px" }}
                      />
                      <Typography variant="body1">
                        Precio: {producto.precio || producto.precio_producto}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box>
                        <CtrlCantidad
                          noProductos={cantidades[producto.id] || 0}
                          getCantidad={(valor) => handleCantidadChange(producto.id, valor)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleComprar(producto)}
                          disabled={!(cantidades[producto.id] > 0)}
                        >
                          Comprar
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body1">Elige una Categoria</Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}

export default CardProducto;