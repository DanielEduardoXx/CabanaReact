import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { allCategorias } from "../../../services/categorias";

function MenuCategoria({ onCategoriaSelect, noCompras, openModal, getValor }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const ruta = "../../../../public";

  const handleModal = () => {
    openModal(true);
  };

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const result = await allCategorias();
        if (isMounted) {
          if (Array.isArray(result)) {
            setData(result);
          } else {
            setData([]);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };
    getData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoriaClick = (id) => {
    getValor(id);
  };

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography>Error al cargar categorías</Typography>;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
        <img src={`../../../../public/Hamburguesas.jpg`} alt={'imgTodos'} onClick={() => handleCategoriaClick(null)} style={{ width: '30px', height: '30px' }} />
        <Typography>Todos</Typography>
      </Box>
      {data.map(item => (
        <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>
          <img src={`${ruta}/${item.nombre}.jpg`} alt={item.nombre} onClick={() => handleCategoriaClick(item.id)} style={{ width: '30px', height: '30px' }} />
          <Typography>{item.nombre}</Typography>
        </Box>
      ))}
      <IconButton aria-label="show cart items" color="inherit" onClick={handleModal} disabled={noCompras <= 0}>
        <Badge badgeContent={noCompras} color="error">
          <AddShoppingCartIcon sx={{ fontSize: 20 }} color="green" />
        </Badge>
      </IconButton>
    </Box>
  );
}

export default MenuCategoria;
