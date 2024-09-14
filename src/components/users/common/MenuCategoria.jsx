import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Badge } from '@mui/material';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { allCategorias } from "../../../services/categorias";
import get_imagenes_cat from '../../../services/get_imagenes_cat';
import { throttle } from 'lodash';
import LazyLoad from "react-lazyload";

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
        console.log("Categorias Result:", categoriasResult);  // Verificar el resultado
        if (isMounted) {
          setData(Array.isArray(categoriasResult) ? categoriasResult : []);
          setLoading(false);
        }
        cargarImagenesThrottledConCache(categoriasResult);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
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
  console.log(`Uso del sessionStorage: ${JSON.stringify(sessionStorage).length / 1024} KB`);
  
  const cargarImagenesConCache = async (categorias) => {
    const nuevasFotos = {};
    for (const categoria of categorias) {
      const cachedImage = sessionStorage.getItem(`imagen_cat_${categoria.id}`);
  
      if (cachedImage) {
        console.log(`Imagen recuperada del cache para categoría ${categoria.id}: ${cachedImage}`);
        nuevasFotos[categoria.id] = cachedImage;
      } else if (!fotosCategorias[categoria.id]) {
        try {
          const imagenes = await get_imagenes_cat(categoria.id);
          console.log(`id categoria: imagen_cat_${categoria.id}  ${imagenes.path}`);
  
          // Si imagenes es un objeto en lugar de un array
          if (imagenes && imagenes.path) {
            const imageUrl = `http://arcaweb.test/${imagenes.path}`;
            console.log(`URL generada para la imagen de categoría ${categoria.id}: ${imageUrl}`);
            nuevasFotos[categoria.id] = imageUrl;
            sessionStorage.setItem(`imagen_cat_${categoria.id}`, imageUrl);
            console.log(`Imagen almacenada en sessionStorage para categoría ${categoria.id}`);
          } else {
            console.warn(`No se encontraron imágenes para la categoría ${categoria.id}`);
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

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography>Error al cargar datos</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <Box sx={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap', padding: '1rem', gap: '1rem' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LazyLoad height={200} offset={100} once>
            <img
              src={`../../../../public/Hamburguesas.jpg`}
              alt={'imgTodos'}
              onClick={() => handleCategoriaClick(null)}
              style={{ width: '40px', height: '40px', cursor: 'pointer' }}
            />
          </LazyLoad>
          <Typography>Todos</Typography>
        </Box>
        {data.map(item => (
          <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LazyLoad height={200} offset={100} once>
              <img
                src={fotosCategorias[item.id] || `${ruta}/${item.nombre}.jpg`}
                alt={item.nombre}
                onClick={() => handleCategoriaClick(item.id)}
                style={{ width: '40px', height: '40px', cursor: 'pointer' }}
              />
            </LazyLoad>
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
