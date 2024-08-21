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
          setData(Array.isArray(result) ? result : []);
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
    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
      <Box sx={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', padding: '1rem', gap: '1rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={`../../../../public/Hamburguesas.jpg`} 
            alt={'imgTodos'} 
            onClick={() => handleCategoriaClick(null)} 
            style={{ width: '40px', height: '40px', cursor: 'pointer' }} 
          />
          <Typography>Todos</Typography>
        </Box>
        {data.map(item => (
          <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
              src={`${ruta}/${item.nombre}.jpg`} 
              alt={item.nombre} 
              onClick={() => handleCategoriaClick(item.id)} 
              style={{ width: '40px', height: '40px', cursor: 'pointer' }} 
            />
            <Typography>{item.nombre}</Typography>
          </Box>
        ))}
      </Box>
      <IconButton 
        aria-label="show cart items" 
        color="inherit" 
        onClick={handleModal} 
        disabled={noCompras <= 0}
        sx={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          boxShadow: 3,
          zIndex: 1000,
        }}
      >
        <Badge badgeContent={noCompras} color="error">
          <AddShoppingCartIcon sx={{ fontSize: 24, color: 'white' }} />
        </Badge>
      </IconButton>
    </Box>
  );
}

export default MenuCategoria;