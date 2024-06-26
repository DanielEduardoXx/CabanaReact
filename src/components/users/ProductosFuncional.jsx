import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CardProducto from "./common/CardProducto";
import Button from "@mui/material/Button";
import CardDetalleCarrito from "./common/CardDetalleCarrito";
import CardTotal from "./common/CardTotal";
import MenuCategoria from "./common/MenuCategoria";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import { getProductos } from "../services/productos";
import {
  getMenu,
  getCompras,
  addCompra,
  updateCompra,
  deleteCompras,
  updateFront,
  getfiltro,
} from "../hooks/useCompras"; // Importar las funciones del hook

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  minHeight: "60vh",
  overflow: "auto",
};

const ProductosFuncional = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState([]);
  const [carrito, setCarrito] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const productos = await getProductos();
        setFiltro(productos);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const opcionMenu = async (opcion) => {
    setLoading(true);
    if (opcion === "00") {
      setFiltro(await getProductos()); // Asegúrate de esperar el resultado
    } else {
      const result = await getfiltro(await getProductos(), opcion); // Asegúrate de esperar el resultado
      setFiltro(result);
    }
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const generarCompra = (producto) => {
    const nuevaCompra = addCompra(producto);
    setCompra(nuevaCompra);
    actualizarFront(nuevaCompra);
  };

  const actualizarCompra = (producto) => {
    const nuevaCompra = updateCompra(producto);
    setCompra(nuevaCompra);
    actualizarFront(nuevaCompra);
  };

  const eliminarProducto = (idProducto) => {
    const nuevaCompra = deleteCompras(idProducto);
    setCompra(nuevaCompra);
    actualizarFront(nuevaCompra);
  };

  const actualizarFront = (nuevaCompra) => {
    const nuevoFiltro = updateFront(filtro);
    setFiltro(nuevoFiltro);

    localStorage.setItem("compras", JSON.stringify(nuevaCompra));
    setCarrito(nuevaCompra.length);

    let subTotal = nuevaCompra.reduce((total, item) => total + item.cantidad * item.precio, 0);
    setTotal(subTotal);
  };

  useEffect(() => {
    const comprasLocalStorage = getCompras();
    setCompra(comprasLocalStorage);
    setCarrito(comprasLocalStorage.length);

    let subTotal = comprasLocalStorage.reduce((total, item) => total + item.cantidad * item.precio, 0);
    setTotal(subTotal);
  }, []);

  useEffect(() => {
    const categorias = getMenu(getProductos());
    setMenu(categorias);
  }, []);

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <MenuCategoria
        objeto={menu}
        getValor={opcionMenu}
        noCompras={carrito}
        openModal={handleOpen}
      />

      {loading ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {filtro.map((item) => (
            <CardProducto
              key={item.id}
              id={item.id}
              titulo={item.nombre}
              precio={item.precio}
              descripcion={item.descripcion}
              noProductos={item.cantidad}
              foto={item.foto}
              compra={generarCompra}
              monitor={actualizarCompra}
              eliminar={eliminarProducto}
            />
          ))}
        </Box>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {compra.map((item) => (
            <CardDetalleCarrito
              key={item.id}
              id={item.id || ''}
              titulo={item.nom_producto || 'Sin título'}
              precio={item.precio_producto || 0}
              foto={item.foto || ''}
              noProductos={item.cantidad}
              monitor={actualizarCompra}
              eliminar={eliminarProducto}
            />
          ))}

          <CardTotal valor={total} />

          <Button onClick={handleClose}>Cerrar</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProductosFuncional;
