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
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PanToolIcon from '@mui/icons-material/PanTool';
import { MyContext } from "../../services/MyContext.jsx";
import MenuCategoria from "./common/MenuCategoria";
import CardProducto from "./common/CardProducto";
import CardDetalleCarrito from "./common/CardDetalleCarrito";
import CardTotal from "./common/CardTotal";
import { allProductosCat } from "../../services/productosxCat";
import { getProductos } from '../../services/productos';
import { addCompra, getCompras, updateFront, deleteCompras, mergeCarts } from "../../hooks/useCompras";

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
  const [filtro, setFiltro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState([]);
  const [carrito, setCarrito] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [productoEditado, setProductoEditado] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

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
      // setNoCompras(nuevasCompras.reduce((acc, item) => acc + item.cantidad, 0)); // Asegúrate de actualizar el número de compras
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


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    let nuevoFiltro = updateFront(filtro, userId);
    setFiltro(nuevoFiltro);
  };

  const handleCategoriaSelect = async (categoriaId) => {
    setLoading(true);
    try {
      const productos = categoriaId ? await allProductosCat(categoriaId) : await getProductos();
      setProductos(productos);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setProductos([]);
    }
    setLoading(false);
  };

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

    // Calcular el total del carrito
  useEffect(() => {
    let newTotal = 0;
    compra.forEach(item => {
      const precio = parseFloat(item.producto.precio_producto);
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

    // Actualizar cantidad de un producto en el carrito
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
                titulo={item.producto.nom_producto}
                precio={item.producto.precio_producto}
                foto={item.producto.foto || `${ruta}/Hamburguesas.jpg`}
                noProductos={item.cantidad}
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


// import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Slide from '@mui/material/Slide';
// import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
// import LinearProgress from "@mui/material/LinearProgress";
// import Modal from "@mui/material/Modal";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import PanToolIcon from '@mui/icons-material/PanTool';
// import { MyContext } from "../../services/MyContext.jsx";
// import MenuCategoria from "./common/MenuCategoria";
// import CardProducto from "./common/CardProducto";
// import CardDetalleCarrito from "./common/CardDetalleCarrito";
// import CardTotal from "./common/CardTotal";
// import { allProductosCat } from "../../services/productosxCat";
// import { getProductos } from '../../services/productos';
// import { addCompra, getCompras, setCompras, updateFront, deleteCompras } from "../../hooks/useCompras"; // Asegúrate de importar correctamente setCompras

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "80%",
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   maxHeight: "90vh",
//   minHeight: "60vh",
//   overflow: "auto",
// };

// function Productos() {
//   const navigate = useNavigate();
//   const { user } = useContext(MyContext);
//   const [productos, setProductos] = useState([]);
//   const [filtro, setFiltro] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [compra, setCompra] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [productoEditado, setProductoEditado] = useState({});
//   const [openDialog, setOpenDialog] = useState(false);

//   const userId = user ? user.user.id : "guest";

//   // Cargar carrito desde localStorage al iniciar
//   useEffect(() => {
//     const storedCart = getCompras(userId);
//     setCompra(storedCart);
//   }, [userId]);

//   // Guardar carrito en localStorage cuando cambia
//   useEffect(() => {
//     setCompras(compra, userId);
//   }, [compra, userId]);

//   // Fusionar carritos de guest y user al iniciar sesión
//   const fusionarCarritos = () => {
//     if (user) {
//       const comprasGuest = getCompras("guest");
//       if (comprasGuest.length > 0) {
//         const comprasUsuario = getCompras(user.user.id);
//         const nuevasCompras = [...comprasGuest, ...comprasUsuario];

//         const comprasUnicas = nuevasCompras.reduce((acc, current) => {
//           const x = acc.find(item => item.id === current.id);
//           if (!x) {
//             return acc.concat([current]);
//           } else {
//             x.cantidad += current.cantidad;
//             return acc;
//           }
//         }, []);

//         setCompra(comprasUnicas);
//         setCompras(comprasUnicas, user.user.id);
//         localStorage.removeItem("cart_guest");
//       }
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fusionarCarritos();
//     }
//   }, [user]);

//   // Cargar productos al seleccionar una categoría
//   const handleCategoriaSelect = async (categoriaId) => {
//     setLoading(true);
//     try {
//       const productos = categoriaId ? await allProductosCat(categoriaId) : await getProductos();
//       setProductos(productos);
//     } catch (error) {
//       console.error('Error fetching productos:', error);
//       setProductos([]);
//     }
//     setLoading(false);
//   };

//   // Manejar apertura y cierre del modal de carrito
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => {
//     setOpen(false);
//     let nuevoFiltro = updateFront(filtro, userId);
//     setFiltro(nuevoFiltro);
//   };

//   // Manejar apertura y cierre del diálogo de confirmación
//   const handleOpenDialog = () => setOpenDialog(true);
//   const handleCloseDialog = () => setOpenDialog(false);

//   // Borrar producto del carrito
//   const handleBorrar = () => {
//     eliminarProducto(productoEditado);
//     setOpenDialog(false);
//   };

//   // Cancelar eliminación de producto del carrito
//   const handleCancelar = () => {
//     productoEditado.cantidad = 1;
//     agregarCompra(productoEditado);
//     setOpenDialog(false);
//   };

//   // Proceder al checkout
//   const handleCheckout = () => {
//     navigate(user ? '/checkout' : '/continua compra');
//   };

//   // Actualizar cantidad de un producto en el carrito
//   const actualizarCantidad = (objeto) => {
//     setProductoEditado(objeto);
//     if (objeto.cantidad <= 0) {
//       setOpenDialog(true);
//     } else {
//       const nuevasCompras = addCompra(objeto, userId);
//       setCompra(nuevasCompras);
//       let nuevoFiltro = updateFront(filtro, userId);
//       setFiltro(nuevoFiltro);
//     }
//   };

//   // Eliminar producto del carrito
//   const eliminarProducto = (objeto) => {
//     const nuevasCompras = deleteCompras(objeto, userId);
//     setCompra(nuevasCompras);
//     let nuevoFiltro = updateFront(filtro, userId);
//     setFiltro(nuevoFiltro);
//     if (nuevasCompras.length === 0) setOpen(false);
//   };

//   // Agregar compra al carrito
//   const agregarCompra = (compra) => {
//     const nuevasCompras = addCompra(compra, userId);
//     setCompra(nuevasCompras);
//   };

//   // Calcular el total del carrito
//   useEffect(() => {
//     let newTotal = 0;
//     compra.forEach(item => {
//       const precio = parseFloat(item.producto.precio_producto);
//       const cantidad = parseInt(item.cantidad, 10);
//       if (!isNaN(precio) && !isNaN(cantidad)) {
//         newTotal += precio * cantidad;
//       }
//     });
//     setTotal(newTotal);
//   }, [compra]);

//   const ruta = "../../../../public";

//   console.log('Estado de compra:', compra); // Verifica el estado de compra

//   return (
//     <Box sx={{ bgcolor: "#ffffff" }}>
//       <MenuCategoria getValor={handleCategoriaSelect} noCompras={compra.length} openModal={handleOpen} />
//       {!loading ? (
//         <CardProducto
//           productos={productos}
//           agregarCompra={agregarCompra}
//           actualizarCantidad={actualizarCantidad}
//           eliminarProducto={eliminarProducto}
//           noProductos={compra.length}
//         />
//       ) : (
//         <Box sx={{ width: "100%" }}>
//           <LinearProgress />
//         </Box>
//       )}

//       <Modal style={{ zIndex: "20" }} open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
//         <Box sx={style}>
//           <Box>
//             {compra.map((item) => (
//               <CardDetalleCarrito
//                 key={item.id}
//                 id={item.id}
//                 titulo={item.producto.nom_producto}
//                 precio={item.producto.precio_producto}
//                 detalle={item.producto.detalle}
//                 foto={item.producto.foto || `${ruta}/Hamburguesas.jpg`}
//                 noProductos={item.cantidad}
//                 monitor={actualizarCantidad}
//                 eliminar={eliminarProducto}
//               />
//             ))}
//             <CardTotal valor={total} />
//           </Box>
//           <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
//             <Button onClick={handleClose}>Cerrar</Button>
//             <Button onClick={handleCheckout}>Continuar</Button>
//           </Box>
//         </Box>
//       </Modal>

//       <Dialog style={{ zIndex: "100" }} open={openDialog} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} aria-describedby="alert-dialog-slide-description">
//         <DialogTitle>
//           <PanToolIcon /> {"Desea eliminar este producto?"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-slide-description">
//             Al editar el valor de la cantidad en cero (0) puede eliminar el producto
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button variant="contained" color="error" endIcon={<DeleteForeverIcon />} onClick={handleBorrar}>Borrar</Button>
//           <Button variant="contained" color="success" endIcon={<AddShoppingCartIcon />} onClick={handleCancelar}>Cancelar</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// export default Productos;

