import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import PicProducto from "./PicProducto";
import Button from "@mui/material/Button";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CtrlCantidad from "./CtrlCantidad";

function CardProducto({ id, titulo, precio, descripcion, foto, compra, monitor, noProductos , eliminar }) {
// se define la funcion con las props que la alimenta y que vienen del padre (PRODCUTO ) cuando se invoca 
  const [cantidad, setCantidad] = useState(0);

  const getCantidad=(valor) => {  // genero un objeto para enviar la padre (PRODCUCTO ) con la informacion
    setCantidad(valor)
    let objeto = {
      id :id,
      cantidad: valor,
      fuente: "CardProducto"
     }
     monitor(objeto)
  }




  const handleComprar = ()=>{ // la hacer click en le boton compra genera un objeto para envair el padre (PRODCTOS )
    let objetoCompra = {
      id : id, 
      titulo : titulo, 
      precio: precio, 
      descripcion: descripcion, 
      foto: foto,
      cantidad: cantidad
    }
    compra(objetoCompra)
  }


   const getBorrar = () => { // genero un objeto para enviar la padre  (PRODUCTO ) con la informacion 
    let objeto = {
      id :id,
      cantidad: cantidad
     }
     eliminar(objeto)
   }
  




  return (
    <Paper
      elevation={3}
      sx={{ margin: "1rem", maxWidth: { xs: "100%", md: "600px" } }}
    >
      <Typography fontSize={25} textAlign={"center"} fontWeight={"600"}>

        {titulo}
      </Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: { xs: "center", md: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
           
            width: { xs: "100%", md: "55%" },
            display: "flex",
            justifyContent: "center",
          }}
        >
        <PicProducto 
          foto= {foto}
          precio= {precio}
        />
        </Box>
        <Box
          sx={{
            width: { xs: "80%", md: "40%" },
            padding: "0.5rem",
          }}
        >
          <Typography fontSize={18} textAlign={"justify"}>
            {descripcion}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", md: "column" },
              justifyContent: { xs: "space-around", md: "center" },
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "40%",
                  md: "100%",
                  
                },
              }}
            >
             <CtrlCantidad 
              noProductos = {noProductos}
              getCantidad = {getCantidad}
              borrar={getBorrar}
             />
            </Box>

            <Box
              sx={{
                width: { xs: "40%", md: "100%" },
                padding: "0.5rem",

                //margin: "0.5rem",
              }}
            >
              <Button

                sx ={{ width: "100%"}}
                variant="contained"
                disabled={cantidad > 0? false: true }
                endIcon={<AddShoppingCartIcon />}
                onClick={handleComprar}
              >
                Comprar
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default CardProducto;
