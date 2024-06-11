import { useEffect, useState } from "react";

import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import Box from "@mui/material/Box";
import CardProducto from "./common/CardProducto";
import Button from "@mui/material/Button";
import CardDetalleCarrito from "./common/CardDetalleCarrito";
import CardTotal from "./common/CardTotal";
import MenuCategoria from "./common/MenuCategoria.jsx";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PanToolIcon from '@mui/icons-material/PanTool';

import { MyContext } from "../../services/myContext.js";
import { useContext } from "react";

import { Navigate, useNavigate } from 'react-router-dom';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Estilos para el Modal

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


import { getProductos } from "../../services/productos.js";
import {
  getMenu,
  getfiltro,
  addCompra,
  getCompras,
  updateFront,
  updateCompra,
  deleteCompras
} from "../../hooks/useCompras.js";

function Productos() {

  
  const navigate = useNavigate();
  const {user, setUser} = useContext(MyContext);
  const [filtro, setFiltro] = useState([]);  // Variable de estado arrelgo con los productos a pintar
  const [loadign, setLoading] = useState(false); // variable de estado controlar el loadig (mientras carga ....)
  const [compra, setCompra] = useState([]); // variable de estado compra
  const [carrito, setCarrito] = useState(0); // varialbe de estado numero de compras
  const [total, setTotal] = useState(0); // variable de estado total de la compra
  const [menu, setMenu] = useState([
    {
      idCategoria: "",
      nombreCategoria: "",
    },
  ]); // variable de estado para cargar el menu dinamico 

  const [open, setOpen] = useState(false); //variable de estado para controlar el Modal 
  const handleOpen = () => setOpen(true); // funcion para abrir el modal 
  const handleClose = () => { // funcion para cerrar el modal 
    setOpen(false)
    let nuevoFiltro = updateFront(filtro);  // actualiza el front con los cambios en productos 
    setFiltro(nuevoFiltro);
    //console.log ( " .... handleCloseModal " + JSON.stringify(nuevoFiltro))

  };

  const [productoEditado, SetProductoEditado] = useState({}); // variable de estado que toma el producto cuando cambia la cantidad
  const [openDialog, setOpenDialog] = useState(false); // variable de estado que controla el Dialog
  const handleClickOpenDialog = () => { // funcion para abrir el dialogo 
    setOpenDialog(true);
  };
  const handleCloseDialog = () => { // funcion para cerrar el Dialog 
    setOpenDialog(false);
  };


  // funcion que borra un producto al darle click el borrar del Dialog 
  const handleBorrar = () => {
    eliminarProducto(productoEditado)
    setOpenDialog(false);
  };

  // funcion para cambiar la compra de un prodcuto a 1 al darle click al boton cancelar del Dialog
  const handleCancelar = () => {
    productoEditado.cantidad = 1
    generarCompra(productoEditado)
    setOpenDialog(false);
  };

  const handleCheckout = () => {
    if (user != null){
      navigate('/checkout')
      
      console.log('sesion abierta')
      
    }else{
      console.log('la sesion esta cerrada')
      navigate('/continua compra')
    }
  }



  let listaProductos = [];      //cargamos los productos a lista de productos 
  const datos = getProductos();
  if (datos.length > 0) {
    listaProductos = datos;
  }



  useEffect(() => {
    //console.log ( " listaProductos "  + JSON.stringify(listaProductos))
    let nuevoFiltro = updateFront(listaProductos);
    setFiltro(nuevoFiltro);

    let MenuCategoria = getMenu(listaProductos);
    if (MenuCategoria.length > 0) {
      setMenu(MenuCategoria);
    }

    setTimeout(() => {
      setLoading(true);
    }, 500);

  }, [listaProductos]);  // cada vez qye lista de productos cambie actualiza  el filtro (que es el objeto que pinta  las card) y carga el menuCategoria (menu dinamico)

  useEffect(() => {
    let compras = getCompras();
    setCarrito(0)
    //console.log ( " filtro  compra"  + JSON.stringify(compras))
    if (compras.length > 0) {
      setCarrito(compras.length)
      setCompra(compras)
      let suma = 0
      compras.map((item) => {
        suma = suma + (item.cantidad * item.precio)
      })
      setTotal(suma)
    }
  }, [filtro]); // cuando cambua filtro actualiza  los valores del carrito (numero de compra) / total valor total de la compra / y las mismas compras

  const opcionMenu = (opcion) => { // funcion para  actualizar cada vez que hacemos click en un icono del boton de categoria 

    setLoading(false)
    //console.log ( " opcionMenu " + opcion)
    let nuevoFiltro = getfiltro(listaProductos, opcion);
    //console.log ( "nuevoFiltro " + JSON.stringify(nuevoFiltro))
    if (opcion == "00") { // si es 00 carga toda la lusta de producto s
      let updateFiltro = updateFront(listaProductos);
      setFiltro(updateFiltro);
      // console.log ( " updateFiltro opcionMenu " + updateFiltro)
    } else {  // carga la lista de prodcutos segun la opcion del menu 
      let updateFiltro = updateFront(nuevoFiltro);
      setFiltro(updateFiltro);
      // console.log ( " updateFiltro opcionMenu " + JSON.stringify(updateFiltro))
    }

    setTimeout(() => {
      setLoading(true);  // espera medio segundo y actuva el loadign ... se hizo para ver en pantalla cuando espera la carga de datos
    }, 500);

  };

  const generarCompra = (objeto) => {  // se hace una nueva compra  y actualiza el front
    // console.log ( "generarCompra " + JSON.stringify(objeto))
    let nuevaCompra = addCompra(objeto);
    //  console.log ( "nuevaCompra " + JSON.stringify(nuevaCompra))
    setCompra(nuevaCompra);
    let nuevoFiltro = updateFront(filtro);
    setFiltro(nuevoFiltro);
    //  console.log ( " updateFiltro generarCompra " + JSON.stringify(nuevoFiltro))
  };

  const actualizarCantidad = (objeto) => { // cada vez que cambia la caantida ejecuta esta funcion 
    //console.log("actualizarCantidad  " + JSON.stringify(objeto));
    SetProductoEditado(objeto)  // guarda el objeto editado bien sea para borrar o para actualizar la cantidad 

    if (objeto.cantidad <= 0) {  // si el valor el CERO o menor activa el Dialog 
      setOpenDialog(true)

    } else {

      if (objeto.fuente == 'CardDetalleCarrito') { //si el cambio viene del Detalle carrito (Modal) con el cambio genera la compra o la actualizacion de la compra
        let compras = getCompras();
        if (compras.length > 0) {
          let nuevaCompra = addCompra(objeto);
          setCompra(nuevaCompra); // actualiza las compras 
          let nuevoFiltro = updateFront(filtro);
          setFiltro(nuevoFiltro); // actualiza el front con los cambios 
          //console.log ( " updateFiltro actualizarCantidad " + JSON.stringify(nuevoFiltro))
        }
      }
    }

  };

  const eliminarProducto = (objeto) => { // elimina un prodcuto y actualiza el fron 
    //console.log("eliminarProducto  " + JSON.stringify(objeto));
    let nuevaCompra = deleteCompras(objeto)
    setCompra(nuevaCompra);
    let nuevoFiltro = updateFront(filtro);
    setFiltro(nuevoFiltro);

    if (nuevaCompra.length == 0) // si la borrar no hay mas compras cierra el Modal del carrito 
      setOpen(false)
  };



  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      {/* - SE INSERTA EL MENU CON SUS PROPS .... - */}
      <MenuCategoria
        objeto={menu}
        getValor={opcionMenu}
        noCompras={carrito}
        openModal={handleOpen}
      />
      {/* - MIETRAS EL LOADIG SEA FALSO MUESTRA EL COMPONETE DE CARGA DE LO CONTRARIO MUESTRA LOS PRODUCTOS .... - */}
      {!loadign ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
          {filtro.map((item) => ( // ITERA EL VECTOR FILTRO POR CADA ITEM PINTA UNA CARD 

            <CardProducto

              key={item.id}
              id={item.id}
              titulo={item.nombre}
              precio={item.precio}
              descripcion={item.descripcion}
              noProductos={item.cantidad}
              foto={item.foto}
              compra={generarCompra}
              monitor={actualizarCantidad}
              eliminar={eliminarProducto}
            />
          ))}
        </Box>
      )}

      {/* MODAL */}
      <Modal style={{ zIndex: "20" }}
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

          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}   >
            <Box>
              <Button onClick={handleClose}> Cerrar </Button>

            </Box>
            <Box>
            
            <Button onClick={handleCheckout}> Continuar </Button>
            </Box>

          </Box>
        </Box>
      </Modal>
      {/* DIALOG  */}
      <Dialog style={{ zIndex: "100" }}
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle> <PanToolIcon /> {"Desea eliminar este prodcuto?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Al editar  el valor de la cantidad en cero (0) puede elimniar el producto
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained" color="error"
            endIcon={<DeleteForeverIcon />}
            onClick={handleBorrar}>Borrar</Button>
          <Button variant="contained" color="success"
            endIcon={<AddShoppingCartIcon />}
            onClick={handleCancelar}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL */}
    </Box>
  );
}
export default Productos;
