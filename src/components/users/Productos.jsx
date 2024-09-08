import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";
import PanToolIcon from '@mui/icons-material/PanTool';
import { MyContext } from "../../services/MyContext.jsx";
import MenuCategoria from "./common/MenuCategoria";
import CardProducto from "./common/CardProducto";
import CardDetalleCarrito from "./common/CardDetalleCarrito";
import CardTotal from "./common/CardTotal";
import { allProductosCat } from "../../services/productosxCat";
import { getProductos } from '../../services/productos';
import { addCompra, getCompras, updateFront, deleteCompras, mergeCarts } from "../../hooks/useCompras";
import get_imagenes_produc from "../../services/get_imagenes_prod.js";
import { allPromociones } from "../../services/categorias.js";
import axios from 'axios';
import { throttle } from 'lodash';

// import { useImagenes } from "../../services/MyContext.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

function Productos() {
  const navigate = useNavigate();
  const { user } = useContext(MyContext);
  const userId = user && user.user ? String(user.user.id) : "guest"; // Asegurarse de que userId sea una cadena
  const [productos, setProductos] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState([]);
  const [carrito, setCarrito] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [productoEditado, setProductoEditado] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [fotosProductos, setFotosProductos] = useState({});
  const [loadedImages, setLoadedImages] = useState({}); // Estado para rastrear imágenes cargadas
  // const { cargarImagenes } = useImagenes();

  const [compras, setCompras] = useState(getCompras(userId));
  const [noCompras, setNoCompras] = useState(compras.length);

  const handleCantidadChange = (cantidad) => {
    setNoCompras(cantidad);
  };

  // Fusionar carritos de guest y user al iniciar sesión
  useEffect(() => {
    if (user) {
      const userId = String(user.user.id); // Asegurarse de que userId sea una cadena
      const comprasGuest = getCompras("guest");
      if (comprasGuest.length > 0) {
        const comprasUsuario = getCompras(userId);
        const nuevasCompras = mergeCarts(userId);

        setCompra(nuevasCompras);
        setCompras(nuevasCompras, user.user.id);
      }
    }
  }, [user]);

  useEffect(() => {
    setCompras(getCompras(userId));
  }, [userId]);

  useEffect(() => {
    let newTotal = 0;
    compra.forEach(item => {
      newTotal += item.producto.precio_producto * item.cantidad;
    });
    setTotal(newTotal);
  }, [compra]);

  const handleOpen = () => {
    const comprasActualizadas = getCompras(userId);
    setCompra(comprasActualizadas);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    let nuevoFiltro = updateFront(filtro, userId);
    setFiltro(nuevoFiltro);
  };

  const cargarImagenesConCache = async (productos) => {
    const nuevasFotos = {};
    for (const producto of productos) {
      const cachedImage = sessionStorage.getItem(`imagen_${producto.id}`);
      if (cachedImage) {
        nuevasFotos[producto.id] = cachedImage;
      } else if (!fotosProductos[producto.id]) {
        const imagenes = await get_imagenes_produc(producto.id);
        if (imagenes && imagenes.length > 0) {
          const imageUrl = `http://arcaweb.test/${imagenes[0].path}`;
          nuevasFotos[producto.id] = imageUrl;
          sessionStorage.setItem(`imagen_${producto.id}`, imageUrl);
        }
      }
    }
    setFotosProductos((prevFotos) => ({ ...prevFotos, ...nuevasFotos }));
  };

  const cargarImagenesThrottledConCache = throttle(cargarImagenesConCache, 2000); // Límite de 2 segundos entre solicitudes

  const handleCategoriaSelect = async (categoriaId) => {
    setLoading(true);
    const controller = new AbortController();
    const signal = controller.signal;

    try {
      let productos;
      if (categoriaId === 5) {
        // Si la categoría seleccionada es promociones, llama a la API de promociones
        productos = await allPromociones(signal);
      } else {
        productos = categoriaId
          ? await allProductosCat(categoriaId, signal)
          : await getProductos(signal);
      }

      setProductos(productos);
      cargarImagenesThrottledConCache(productos); // Usa la función con throttling

    } catch (error) {
      console.error('Error fetching productos:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setProductos([]);

    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  };

  // Cargar todos los productos al montar el componente
  useEffect(() => {
    handleCategoriaSelect(null);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleBorrar = () => {
    eliminarProducto(productoEditado);
    setOpenDialog(false);
  };

  const handleCancelar = () => {
    productoEditado.cantidad = 1;
    agregarCompra(productoEditado);
    setOpenDialog(false);
  };

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/continua compra');
  };

  useEffect(() => {
    let compras = getCompras(userId);
    setCarrito(compras.length);
    setCompra(compras);
  }, [filtro, userId]);

  useEffect(() => {
    let newTotal = 0;
    compra.forEach(item => {
      const precioProducto = item.producto.precio_producto ? parseFloat(item.producto.precio_producto) : 0;
      const precioPromo = item.producto.total_promo ? parseFloat(item.producto.total_promo) : 0;
      
      // Usamos precioPromo si está disponible, de lo contrario usamos precioProducto
      const precio = precioPromo > 0 ? precioPromo : precioProducto;
      
      const cantidad = parseInt(item.cantidad, 10);
      
      if (!isNaN(precio) && !isNaN(cantidad)) {
        newTotal += precio * cantidad;
      }
    });
    setTotal(newTotal);
  }, [compra]);

  const agregarCompra = (compra) => {
    const nuevasCompras = addCompra(compra, userId);
    setCompras(nuevasCompras);
    setNoCompras(nuevasCompras.reduce((acc, item) => acc + item.cantidad, 0)); // Actualizar el número de compras
  };

  const actualizarCantidad = (objeto) => {
    setProductoEditado(objeto);
    if (objeto.cantidad <= 0) {
      setOpenDialog(true);
    } else {
      const nuevasCompras = addCompra(objeto, userId);
      setCompra(nuevasCompras);
      let nuevoFiltro = updateFront(filtro, userId);
      setFiltro(nuevoFiltro);
    }
  };

  const eliminarProducto = (objeto) => {
    let nuevaCompra = deleteCompras(objeto, userId);
    setCompra(nuevaCompra);
    let nuevoFiltro = updateFront(filtro, userId);
    setFiltro(nuevoFiltro);
    setNoCompras(nuevaCompra.reduce((acc, item) => acc + item.cantidad, 0));
    if (nuevaCompra.length === 0) setOpen(false);
  };

  const ruta = "../../../../public";

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <MenuCategoria
        getValor={handleCategoriaSelect}
        noCompras={noCompras}
        openModal={handleOpen}
      />

      {!loading ? (
        <CardProducto
          productos={productos}
          agregarCompra={agregarCompra}
          actualizarCantidad={actualizarCantidad}
          eliminarProducto={eliminarProducto}
          noProductos={noCompras}
          fotosProductos={fotosProductos}  // Pasar las imágenes como prop
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      <Modal
        style={{ zIndex: "20" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box>
            {compra.map((item) => (
              <CardDetalleCarrito
                key={item.id}
                id={item.id}
                titulo={item.producto.nom_promo || item.producto.nom_producto || "Título no disponible"}
                precio={item.producto.precio_producto || item.producto.total_promo || 0}
                foto={loadedImages[item.id] || `${ruta}/Hamburguesas.jpg`}
                noProductos={item.cantidad || 0}
                monitor={actualizarCantidad}
                eliminar={eliminarProducto}
              />
            ))}
            <CardTotal valor={total} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button onClick={handleClose}>Cerrar</Button>
            <Button onClick={handleCheckout}>Continuar</Button>
          </Box>
        </Box>
      </Modal>

      <Dialog
        style={{ zIndex: "100" }}
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <PanToolIcon /> {"Desea eliminar este producto de su carrito?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Si presiona Aceptar, se eliminará este producto de su carrito de
            compras.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelar}>Cancelar</Button>
          <Button onClick={handleBorrar}>Aceptar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Productos;
