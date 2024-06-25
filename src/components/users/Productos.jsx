// import { useState, useEffect } from 'react';
// import MenuCategoria from './common/MenuCategoria';
// import CardProducto from './common/CardProducto';
// import { getProductos } from '../../services/productos';
// import { allProductosCat} from "../../services/productosxCat";

// function PaginaProductos() {
//   const [productos, setProductos] = useState([]);
//   const [noCompras, setNoCompras] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);

//   const fetchProductos = async (categoriaId) => {
//     try {
//       let productos;
//       if (categoriaId) {
//         productos = await allProductosCat(categoriaId);
//       } else {
//         productos = await getProductos();
//       }
//       setProductos(productos);
//     } catch (error) {
//       console.error('Error fetching productos:', error);
//       setProductos([]);
//     }
//   };

//   const handleCategoriaSelect = (categoriaId) => {
//     fetchProductos(categoriaId);
//   };

//   const handleOpenModal = (open) => {
//     setModalOpen(open);
//   };

//   return (
//     <div>
//       <MenuCategoria
//         onCategoriaSelect={handleCategoriaSelect}
//         noCompras={noCompras}
//         openModal={handleOpenModal}
//       />
//       <CardProducto productos={productos} />
//     </div>
//   );
// }

// export default PaginaProductos;


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
import { allProductosCat} from "../../services/productosxCat";
import { getProductos } from '../../services/productos';
import { addCompra, getCompras, updateFront, deleteCompras } from "../../hooks/useCompras";

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
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState([]);
  const [carrito, setCarrito] = useState(0);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [productoEditado, SetProductoEditado] = useState({});
  const [openDialog, setOpenDialog] = useState(false);


  const [compras, setCompras] = useState(getCompras()); 
  const [noCompras, setNoCompras] = useState(compras.length);

  const handleCantidadChange = (cantidad) => {
    setNoCompras(cantidad);
  };



  useEffect(() => {
    setCompras(getCompras());
  }, []);


  const agregarCompra = (compra) => {
    const nuevasCompras = addCompra(compra);
    setCompras(nuevasCompras);
    setNoCompras(nuevasCompras.length); // Actualizar el número de compras
  };

  useEffect(() => {
    let newTotal = 0;
    compra.forEach(item => {
      newTotal += item.precio * item.cantidad;
    });
    setTotal(newTotal);
  }, [compra]);

  const generarCompra = (item) => {
    setCompra(prevCompra => {
      const exist = prevCompra.find(p => p.id === item.id);
      if (exist) {
        return prevCompra.map(p =>
          p.id === item.id ? { ...p, cantidad: item.cantidad } : p
        );
      } else {
        const product = productos.find(p => p.id === item.id);
        return [...prevCompra, { ...product, cantidad: item.cantidad }];
      }
    });
    setNoCompras(prev => prev + item.cantidad);
  };


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    let nuevoFiltro = updateFront(filtro);
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
    generarCompra(productoEditado);
    setOpenDialog(false);
  };

  const handleCheckout = () => {
    navigate(user ? '/checkout' : '/continua compra');
  };

  useEffect(() => {
    let compras = getCompras();
    setCarrito(compras.length);
    setCompra(compras);
    let suma = compras.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);
    setTotal(suma);
  }, [filtro]);


  const actualizarCantidad = (objeto) => {
    SetProductoEditado(objeto);
    if (objeto.cantidad <= 0) {
      setOpenDialog(true);
    } else {
      if (objeto.fuente === 'CardDetalleCarrito') {
        let nuevaCompra = addCompra(objeto);
        setCompra(nuevaCompra);
        let nuevoFiltro = updateFront(filtro);
        setFiltro(nuevoFiltro);
      }
    }
  };

  const eliminarProducto = (objeto) => {
    let nuevaCompra = deleteCompras(objeto);
    setCompra(nuevaCompra);
    let nuevoFiltro = updateFront(filtro);
    setFiltro(nuevoFiltro);
    if (nuevaCompra.length === 0) setOpen(false);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <MenuCategoria getValor={handleCategoriaSelect} noCompras={noCompras} openModal={handleOpen} />
      {!loading ? (
        <CardProducto
          productos={productos}
          generarCompra={generarCompra}
          actualizarCantidad={actualizarCantidad}
          eliminarProducto={eliminarProducto}
          noProductos={noCompras}
        />
      ) : (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      <Modal style={{ zIndex: "20" }} open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Box>
            {compra.map((item) => (
              <CardDetalleCarrito
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                precio={item.precio}
                foto={item.foto}
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

      <Dialog style={{ zIndex: "100" }} open={openDialog} TransitionComponent={Transition} keepMounted onClose={handleCloseDialog} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>
          <PanToolIcon /> {"Desea eliminar este producto?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Al editar el valor de la cantidad en cero (0) puede eliminar el producto
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" endIcon={<DeleteForeverIcon />} onClick={handleBorrar}>Borrar</Button>
          <Button variant="contained" color="success" endIcon={<AddShoppingCartIcon />} onClick={handleCancelar}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Productos;
