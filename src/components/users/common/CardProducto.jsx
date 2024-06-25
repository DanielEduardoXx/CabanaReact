import React, { useState } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CtrlCantidad from "./CtrlCantidad";

const ruta = "../../../../public";

function CardProducto({ productos, generarCompra, actualizarCantidad, eliminarProducto }) {
  const [cantidad, setCantidad] = useState({});

  const handleCantidadChange = (producto, valor) => {
    setCantidad(prevState => ({ ...prevState, [producto.id]: valor }));
  };

  const handleComprar = (producto) => () => {
    const compra = {
      id: producto.id,
      cantidad: cantidad[producto.id] || 0,
      producto: producto // Aquí podrías pasar más detalles del producto si es necesario
    };
    generarCompra(compra);
    setCantidad(prevState => ({ ...prevState, [producto.id]: 0 })); // Reinicia la cantidad después de la compra
  };

  return (
    <Box sx={{ padding: '2rem', margin: '1rem' }}>
      <Grid container spacing={2}>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map(producto => (
            <Grid item xs={12} md={6} key={producto.id}>
              <Paper sx={{ padding: '1rem' }}>
                <Typography>ID: {producto.id}</Typography>
                <Typography>Nombre: {producto.nom_producto}</Typography>
                <Typography>Precio: {producto.precio_producto}</Typography>
                <Typography>Detalle: {producto.detalle}</Typography>
                <Typography>Código: {producto.codigo}</Typography>
                <img src={`${ruta}/${producto.nom_producto}.jpg`} alt={producto.nom_producto} style={{ width: '100px', height: '100px' }} />
                <CtrlCantidad noProductos={cantidad[producto.id]} getCantidad={(valor) => handleCantidadChange(producto, valor)} />
                <Box sx={{ marginTop: '1rem' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!(cantidad[producto.id] > 0)}
                    onClick={handleComprar(producto)}
                    endIcon={<AddShoppingCartIcon />}
                  >
                    Comprar ({cantidad[producto.id] || 0})
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No hay productos disponibles</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default CardProducto;




// import { Box, Paper, Typography, Grid } from '@mui/material';
// import CtrlCantidad from "./CtrlCantidad";
// import Button from '@mui/material/Button';
// import { useState } from 'react';
// const ruta = "../../../../public";

// const getCantidadFuncion = (cantidad) => {
//   // Lógica para manejar la cantidad obtenida desde CtrlCantidad
//   console.log('Cantidad obtenida:', cantidad);
// };



// function CardProducto({ productos, generarCompra, actualizarCantidad, eliminarProducto }) {

//   const [cantidad, setCantidad] = useState(0);

//   const handleCantidadChange = (valor) => {
//     setCantidad(valor);
//   };

//   const handleComprar = () => {
//     // Lógica para realizar la compra con la cantidad seleccionada
//     const compra = {
//       id: producto.id,
//       cantidad: cantidad,
//       producto: producto // Aquí podrías pasar más detalles del producto si es necesario
//     };
//     generarCompra(compra);
//     setCantidad(0); // Reinicia la cantidad después de la compra
//   };


//   return (
//     <Box sx={{ padding: '2rem', margin: '1rem' }}>
//       <Grid container spacing={2}>
//         {Array.isArray(productos) && productos.length > 0 ? (
//           productos.map(producto => (
//             <Grid item xs={12} md={6} key={producto.id}>
//               <Paper sx={{ padding: '1rem' }}>
//                 <Typography>ID: {producto.id}</Typography>
//                 <Typography>Nombre: {producto.nom_producto}</Typography>
//                 <Typography>Precio: {producto.precio_producto}</Typography>
//                 <Typography>Detalle: {producto.detalle}</Typography>
//                 <Typography>Código: {producto.codigo}</Typography>
//                 <img src={`${ruta}/${producto.nom_producto}.jpg`} alt={producto.nom_producto} style={{ width: '100px', height: '100px' }} />
//                 <CtrlCantidad getCantidad={getCantidadFuncion} producto={producto} generarCompra={generarCompra} actualizarCantidad={actualizarCantidad} eliminarProducto={eliminarProducto} />
//                 <Box sx={{ marginTop: '1rem' }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 disabled={cantidad === 0}
//                 onClick={handleComprar}
//               >
//                 Comprar ({cantidad})
//               </Button>
//             </Box>
//               </Paper>
//             </Grid>
//           ))
//         ) : (
//           <Grid item xs={12}>
//             <Typography>No hay productos disponibles</Typography>
//           </Grid>
//         )}
//       </Grid>
//     </Box>
//   );
// }

// export default CardProducto;




// import { useEffect, useState } from "react";

// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Paper from "@mui/material/Paper";
// import PicProducto from "./PicProducto";
// import Button from "@mui/material/Button";
// import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
// import CtrlCantidad from "./CtrlCantidad";

// function CardProducto({ id, titulo, precio, descripcion, foto, compra, monitor, noProductos , eliminar }) {
// // se define la funcion con las props que la alimenta y que vienen del padre (PRODCUTO ) cuando se invoca 
//   const [cantidad, setCantidad] = useState(0);

//   const getCantidad=(valor) => {  // genero un objeto para enviar la padre (PRODCUCTO ) con la informacion
//     setCantidad(valor)
//     let objeto = {
//       id :id,
//       cantidad: valor,
//       fuente: "CardProducto"
//      }
//      monitor(objeto)
//   }




//   const handleComprar = ()=>{ // la hacer click en le boton compra genera un objeto para envair el padre (PRODCTOS )
//     let objetoCompra = {
//       id : id, 
//       titulo : titulo, 
//       precio: precio, 
//       descripcion: descripcion, 
//       foto: foto,
//       cantidad: cantidad
//     }
//     compra(objetoCompra)
//   }


//    const getBorrar = () => { // genero un objeto para enviar la padre  (PRODUCTO ) con la informacion 
//     let objeto = {
//       id :id,
//       cantidad: cantidad
//      }
//      eliminar(objeto)
//    }
  




//   return (
//     <Paper
//       elevation={3}
//       sx={{ margin: "1rem", maxWidth: { xs: "100%", md: "600px" } }}
//     >
//       <Typography fontSize={25} textAlign={"center"} fontWeight={"600"}>

//         {titulo}
//       </Typography>
//       <Box
//         sx={{
//           display: "flex",
//           width: "100%",
//           alignItems: { xs: "center", md: "flex-start" },
//           flexDirection: { xs: "column", md: "row" },
//         }}
//       >
//         <Box
//           sx={{
           
//             width: { xs: "100%", md: "55%" },
//             display: "flex",
//             justifyContent: "center",
//           }}
//         >
//         <PicProducto 
//           foto= {foto}
//           precio= {precio}
//         />
//         </Box>
//         <Box
//           sx={{
//             width: { xs: "80%", md: "40%" },
//             padding: "0.5rem",
//           }}
//         >
//           <Typography fontSize={18} textAlign={"justify"}>
//             {descripcion}
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "row", md: "column" },
//               justifyContent: { xs: "space-around", md: "center" },
//             }}
//           >
//             <Box
//               sx={{
//                 width: {
//                   xs: "40%",
//                   md: "100%",
                  
//                 },
//               }}
//             >
//              <CtrlCantidad 
//               noProductos = {noProductos}
//               getCantidad = {getCantidad}
//               borrar={getBorrar}
//              />
//             </Box>

//             <Box
//               sx={{
//                 width: { xs: "40%", md: "100%" },
//                 padding: "0.5rem",

//                 //margin: "0.5rem",
//               }}
//             >
//               <Button

//                 sx ={{ width: "100%"}}
//                 variant="contained"
//                 disabled={cantidad > 0? false: true }
//                 endIcon={<AddShoppingCartIcon />}
//                 onClick={handleComprar}
//               >
//                 Comprar
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Paper>
//   );
// }

// export default CardProducto;
