import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import CtrlCantidad from "./CtrlCantidad";
import { useState, useEffect, useContext } from "react";
import { MyContext } from "../../../services/MyContext";
import LazyLoad from "react-lazyload";
import LoadingComponent from "./LoadingComponent";
import AlertError from "./AlertPaper";

function CardProducto({ productos, fotosProductos, agregarCompra, actualizarCantidad, eliminarProducto, noProductos }) {
  const { user } = useContext(MyContext);
  const userId = user && user.user ? String(user.user.id) : "guest"; // Usa 'guest' como valor predeterminado si el usuario no está definido
  const storageKey = `cantidades_${userId}`; // Clave para almacenar las cantidades

  // Estado para manejar las cantidades seleccionadas
  const [cantidades, setCantidades] = useState(() => {
    const savedCantidades = localStorage.getItem(storageKey);
    return savedCantidades ? JSON.parse(savedCantidades) : {};
  });

  const [loading, setLoading] = useState(true); // Estado de carga
  const [loadedImages, setLoadedImages] = useState({}); // Estado para rastrear imágenes cargadas

  // Guardar las cantidades actualizadas en localStorage solo cuando se haga clic en Comprar
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cantidades));
  }, [cantidades, storageKey]);

  // Manejo de la carga de imágenes
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

  // Función para manejar cambios en la cantidad del producto
  const handleCantidadChange = (id, valor) => {
    // Solo actualiza el estado de cantidades
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id]: valor,
    }));
  };
  

// Función para agregar el producto al carrito al hacer clic en "Comprar"
const handleComprar = (producto) => {
  if (!producto.id) {
    console.error("Producto sin id:", producto);
    return;
  }

  const cantidadSeleccionada = cantidades[producto.id] || 0;

  // Solo agrega al carrito si la cantidad seleccionada es mayor a 0
  if (cantidadSeleccionada > 0) {
    const compra = {
      id: producto.id,
      cantidad: cantidadSeleccionada, // Usamos la cantidad seleccionada
      producto: producto,
    };

    // Recupera el carrito actual del localStorage
    const compras = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

    // Verifica si el producto ya está en el carrito
    const productoExistente = compras.find((p) => p.id === producto.id);

    if (productoExistente) {
      // Si el producto ya existe, actualiza la cantidad
      productoExistente.cantidad += cantidadSeleccionada;
    } else {
      // Si el producto no existe, agrégalo al carrito
      compras.push(compra);
    }

    // Guarda el carrito actualizado en el localStorage
    localStorage.setItem(`cart_${userId}`, JSON.stringify(compras));

    // Llama a la función para agregar al carrito en el estado de la aplicación
    agregarCompra(compra);


  } else {
    console.warn("No se puede comprar sin seleccionar una cantidad válida.");
  }
};


  // Renderizado de carga
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <LoadingComponent />
      </Box>
    );
  }

  // Renderizado del componente principal
  return (
    <Box sx={{ padding: "2rem", margin: "1rem" }}>
      <Grid container spacing={3}>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map((item) => {
            if (!item.id) {
              console.error("Elemento sin id:", item);
              return null;
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Paper elevation={5} sx={{ padding: "1.5rem", borderRadius: "10px", height: "100%" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                        {item.nom_promo ? item.nom_promo : item.nom_producto}
                      </Typography>
                      <LazyLoad height={200} offset={100} once>
                        <img
                          src={loadedImages[item.id] || "default_image.jpg"}
                          alt={item.nom_promo ? item.nom_promo : item.nom_producto}
                          style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                        />
                      </LazyLoad>
                      {item.precio_producto ? (
                        <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                          Precio: ${item.precio_producto.toFixed(2)}
                        </Typography>
                      ) : (
                        <Typography variant="body1" sx={{ marginTop: "0.5rem" }}>
                          Total: ${item.total_promo.toFixed(2)}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: "text.secondary", marginTop: "0.3rem" }}>
                        {item.detpromociones && item.detpromociones.length > 0
                          ? item.detpromociones.map((promo, index) => (
                              <span key={index}>
                                *{promo.cantidad + " " + promo.producto.detalle}
                                {index < item.detpromociones.length - 1 && <br />}
                              </span>
                            ))
                          : item.detalle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "1rem" }}>
                      <CtrlCantidad
                        noProductos={cantidades[item.id] || 0}
                        getCantidad={(valor) => handleCantidadChange(item.id, valor)}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleComprar(item)}
                        disabled={!(cantidades[item.id] > 0)} // Solo habilitar si la cantidad es mayor que 0
                        sx={{ marginTop: "1rem", width: "100%" }}
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
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <AlertError />
          </Box>
        )}
      </Grid>
    </Box>
  );
}

export default CardProducto;


