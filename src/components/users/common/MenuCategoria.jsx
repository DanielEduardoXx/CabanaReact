import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { allCategorias } from "../../../services/categorias";
import get_imagenes_cat from '../../../services/get_imagenes_cat';
import { throttle } from 'lodash';
import LazyLoad from "react-lazyload";
import LoadingComponent from './LoadingComponent';

function MenuCategoria({ onCategoriaSelect, noCompras, openModal, getValor }) {
  const [data, setData] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fotosCategorias, setFotosCategorias] = useState({});

  const ruta = "../../../../public";

  const handleModal = () => {
    openModal(true);
  };

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      try {
        const categoriasResult = await allCategorias();
        if (isMounted) {
          setData(Array.isArray(categoriasResult) ? categoriasResult : []);
          setLoading(false);
        }
        cargarImagenesThrottledConCache(categoriasResult);
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

  const cargarImagenesConCache = async (categorias) => {
    const nuevasFotos = {};
    for (const categoria of categorias) {
      const cachedImage = sessionStorage.getItem(`imagen_cat_${categoria.id}`);
      if (cachedImage) {
        nuevasFotos[categoria.id] = cachedImage;
      } else if (!fotosCategorias[categoria.id]) {
        try {
          const imagenes = await get_imagenes_cat(categoria.id);
          if (imagenes && imagenes.path) {
            const imageUrl = `http://arcaweb.test/${imagenes.path}`;
            nuevasFotos[categoria.id] = imageUrl;
            sessionStorage.setItem(`imagen_cat_${categoria.id}`, imageUrl);
          }
        } catch (error) {
          console.error(`Error al obtener imágenes para categoría ${categoria.id}:`, error);
        }
      }
    }
    setFotosCategorias((prevFotos) => ({ ...prevFotos, ...nuevasFotos }));
  };

  const cargarImagenesThrottledConCache = throttle(cargarImagenesConCache, 2000);

  const handleCategoriaClick = (id) => {
    setSelectedCategoria(id);
    getValor(id);
  };

  if (loading) return <LoadingComponent loading={loading} />

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* Menú de categorías con scroll horizontal */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: {md:'center', sm:'start' }, // Alineación inicial
          overflowX: 'auto', 
          whiteSpace: 'nowrap', 
          padding: '1rem', 
          gap: '1rem',
          width: '100%',
          minWidth: '100%',  // Asegura que el contenedor ocupe todo el ancho necesario para el contenido
          boxSizing: 'border-box',  // Asegura que el padding no afecte el tamaño del contenedor
          scrollSnapType: 'x mandatory', // Permite que el scroll horizontal sea más fluido
        }}
      >
        {/* Categoría Todos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
          <LazyLoad height={200} offset={100} once>
            <img
              src={`../../../../public/plato.png`}
              alt={'imgTodos'}
              onClick={() => handleCategoriaClick(null)}
              style={{ width: '40px', height: '40px', cursor: 'pointer', objectFit: 'contain' }} // Ajuste de object-fit
            />
          </LazyLoad>
          <Typography>Menú</Typography>
        </Box>

        {/* Categorías dinámicas */}
        {data.map(item => (
          <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
            <LazyLoad height={200} offset={100} once>
              <img
                src={fotosCategorias[item.id] || `${ruta}/${item.nombre}.jpg`}
                alt={item.nombre}
                onClick={() => handleCategoriaClick(item.id)}
                style={{ width: '40px', height: '40px', cursor: 'pointer', objectFit: 'contain' }} // Ajuste de object-fit
              />
            </LazyLoad>
            <Typography>{item.nombre}</Typography>
          </Box>
        ))}
      </Box>

      {/* Botón de carrito flotante */}
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
