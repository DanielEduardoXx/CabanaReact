import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function CtrlCantidad({ noProductos, getCantidad }) {
  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    if (noProductos != null) {
      setCantidad(noProductos);
    }
  }, [noProductos]);

  const handleSumar = () => {
    const nuevaCantidad = cantidad + 1;
    setCantidad(nuevaCantidad);
    getCantidad(nuevaCantidad);
  };

  const handleRestar = () => {
    const nuevaCantidad = cantidad - 1 >= 0 ? cantidad - 1 : 0;
    setCantidad(nuevaCantidad);
    getCantidad(nuevaCantidad);
  };

  return (
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

      <Typography fontSize={18} textAlign={"center"} fontWeight={"600"}>
        {cantidad}
      </Typography>
        
      <Button color="error" variant="contained" size="small" onClick={handleRestar}>
        <Typography fontSize={18} textAlign={"center"}>
          -
        </Typography>
      </Button>
    </Box>
  );
}

export default CtrlCantidad;

