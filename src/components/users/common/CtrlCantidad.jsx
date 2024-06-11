

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";




function CtrlCantidad({ noProductos, getCantidad  }) {

    const [cantidad, setCantidad] = useState(0);

   

      useEffect (()=>{ // cuando no de productos cambia actualiza el valor (cuado existe una compra del prodcto y se refleja en el front)
        if (noProductos != null) {
          setCantidad(noProductos)
        }
      } , [noProductos])

    const handleSumar =() =>{
        setCantidad(cantidad + 1)  // modica la cantidad 
        getCantidad(cantidad + 1) // optiene la cantidad para enviar al padre (Card_Producto CardDetalleCarrito)
      }
    
      const handleRestar =() =>{
        setCantidad(cantidad - 1) // modica la cantidad 
        getCantidad(cantidad - 1) // optiene la cantidad para enviar al padre (Card_Producto CardDetalleCarrito)
        if (cantidad <= 0 ) { // no deja numeros negativos 
         
          setCantidad(0)
          getCantidad(0)
        }
           
      }

    return ( <> 
<Box
sx={{
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
}}
>
<Button color="success" variant="contained" size="small" onClick={handleSumar}>
  <Typography fontSize={18} textAlign={"center"}>
    +
  </Typography>
</Button>

<Typography fontSize={18} textAlign={"center"} fontWeight={"600"} >
  {cantidad}
</Typography>
<Button color="error" variant="contained" size="small" onClick={handleRestar} >
  <Typography fontSize={18} textAlign={"center"}>
    -
  </Typography>
</Button>
</Box>





</>
 );
}

export default CtrlCantidad;