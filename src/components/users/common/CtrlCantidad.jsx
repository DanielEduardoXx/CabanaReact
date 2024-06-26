import { Box, IconButton, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect } from "react";

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
    if (getCantidad) {
      getCantidad(nuevaCantidad);
    }
  };

  const handleRestar = () => {
    const nuevaCantidad = cantidad - 1 >= 0 ? cantidad - 1 : 0;
    setCantidad(nuevaCantidad);
    if (getCantidad) {
      getCantidad(nuevaCantidad);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handleRestar}>
        <RemoveIcon />
      </IconButton>
      <TextField
        type="number"
        value={cantidad}
        onChange={(e) => {
          const nuevaCantidad = parseInt(e.target.value) || 0;
          setCantidad(nuevaCantidad);
          if (getCantidad) {
            getCantidad(nuevaCantidad);
          }
        }}
        InputProps={{ inputProps: { min: 0 } }}
        sx={{ width: "4rem", textAlign: "center" }}
      />
      <IconButton onClick={handleSumar}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}

export default CtrlCantidad;
