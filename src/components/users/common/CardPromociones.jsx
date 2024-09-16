import { Box, Paper, Typography, Grid, Button, CircularProgress } from "@mui/material";
import CtrlCantidad from "./CtrlCantidad";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../../services/MyContext";
import LazyLoad from "react-lazyload";
import LoadingComponent from "./LoadingComponent";

function CardProducto({ productos, fotosProductos, agregarCompra, actualizarCantidad, eliminarProducto, noProductos }) {
  const { user } = useContext(MyContext);
  const userId = user && user.user ? String(user.user.id) : "guest"; // Usa 'guest' como valor predeterminado si el usuario no está definido
  const storageKey = `cantidades_${userId}`;

  const [cantidades, setCantidades] = useState(() => {
    const savedCantidades = localStorage.getItem(storageKey);
    return savedCantidades ? JSON.parse(savedCantidades) : {};
  });

  const [loading, setLoading] = useState(true); // Estado de carga
  const [loadedImages, setLoadedImages] = useState({}); // Estado para rastrear imágenes cargadas

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cantidades));
  }, [cantidades, storageKey]);

  useEffect(() => {
    if (productos && Array.isArray(productos)) {
      const imagePromises = productos.map(async (producto) => {
        if (fotosProductos[producto.id]) {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = fotosProductos[producto.id];
            img.onload = () => resolve(producto.id);
            img.onerror = () => resolve(null);
          });
        }
        return Promise.resolve(null);
      });

      Promise.all(imagePromises).then((loadedImageIds) => {
        setLoadedImages((prev) => {
          const images = {};
          loadedImageIds.forEach((id) => {
            if (id) images[id] = fotosProductos[id];
          });
          return images;
        });
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [productos, fotosProductos]);

  const handleCantidadChange = (id, valor) => {
    setCantidades(prevCantidades => ({
      ...prevCantidades,
      [id]: valor
    }));
    actualizarCantidad({ id, cantidad: valor, producto: productos.find(p => p.id === id) });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingComponent />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", margin: "1rem" }}>
      <Grid container spacing={3}>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((producto) => {
            if (!producto.id) {
              console.error('Producto sin id:', producto);
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <Paper elevation={5} sx={{ padding: "1.5rem", borderRadius: "10px", height: "100%" }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%" }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {producto.nom_producto}
                      </Typography>
                      <LazyLoad height={200} offset={100} once>
                        <img
                          src={loadedImages[producto.id] || 'placeholder.jpg'}
                          alt={producto.nom_producto}
                          style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                        />
                      </LazyLoad>
                      <Typography variant="body1" sx={{ marginTop: '0.5rem' }}>
                        Precio: ${producto.precio_producto.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '0.3rem' }}>
                        {producto.detalle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                      <CtrlCantidad
                        noProductos={cantidades[producto.id] || 0}
                        getCantidad={(valor) => handleCantidadChange(producto.id, valor)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleComprar(producto)}
                        disabled={!(cantidades[producto.id] > 0)}
                        sx={{ marginTop: '1rem', width: '100%' }}
                      >
                        Comprar
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
              Elige una categoría para ver los productos.
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
}

export default CardProducto;
