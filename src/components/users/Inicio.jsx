

import HeaderComponent from "./common/PicInicio";
import { allCategorias } from "../../services/categorias";
import { useEffect, useState } from 'react';
import { Box, Paper, Grid, Avatar, Modal, Button, TextField, Typography } from "@mui/material";
import { allProductosCat } from "../../services/productosxCat";
import { getProductos } from "../../services/productos";
import { Card } from "react-bootstrap";
import CtrlCantidad from "./common/CtrlCantidad";

function Inicio() {

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [productos, setProductos] = useState([]);
  const [allProducts, setAllProducts] = useState([]);


  const handleCategoriaClick = (id) => {
    console.log('Categoria Clicked:', id);
    const fetchProductos = async () => {
      try {
        const productos = await allProductosCat(id);
        console.log('Productos fetched:', productos);
        setProductos(productos);
      } catch (error) {
        console.error('Error fetching productos:', error);
        setProductos([]);
      }
    };
    fetchProductos();
  };

  const handleAllProducts = () => {

    console.log('CLicksksk')
    const setAllProducts = async () => {
      try {
        const allProducts = await getProductos();
        setAllProducts(allProducts);
        console.log('Data fetched in component:', allProducts);

      } catch (error) {
        console.error('Error producst productos:', error);
        setAllProducts([]);
      }
    };
    setAllProducts();
  };

  useEffect(() => {

    let isMounted = true; // Bandera para verificar si el componente está montado
    const getData = async () => {
      try {
        const result = await allCategorias();
        if (isMounted) { // Solo actualizar el estado si el componente está montado
          console.log('Data fetched in component:', result);
          if (Array.isArray(result)) {
            setData(result);
          } else {
            console.error('Data is not an array:', result);
            setData([]);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) { // Solo actualizar el estado si el componente está montado
          console.log('no se estan obteniendo', err)
          setError(error);
          setLoading(false);
        }
      }
    };
    getData();
    return () => {
      isMounted = false; // Marcar el componente como desmontado en la limpieza
    };
  }, []);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  //Rutas para las imagenes
  const ruta = "../../../../public";
  return (
    <Box sx={{ width: '100%' }}>

      <Box>
        <HeaderComponent></HeaderComponent>

      </Box>

      <Paper>

        <Box sx={{ minWidth: { md: '50%' }, display: 'flex', justifyContent: 'center' }}>

        <img src={`${ruta}/Hamburguesas.jpg`} alt={'imgTodos'} onClick={() => handleAllProducts()} style={{ width: '30px', height: '30px' }} />
        
        <Typography>Todos</Typography>
          {data.map(item => (
            <Box key={item.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '1rem' }}>

      

              <img src={`${ruta}/${item.nombre}.jpg`} alt={item.nombre} onClick={() => handleCategoriaClick(item.id)} style={{ width: '30px', height: '30px' }} />

              <Typography>{item.nombre}</Typography>

            </Box>

          ))}
        </Box>
        <Box sx={{ minWidth: { md: '50%' } }}>{data ? data.nombre : ''}</Box>
      </Paper>

      <Box sx={{ padding: '2rem' }}>
      <Grid container spacing={2}>
        {Array.isArray(productos) && productos.length > 0 ? (
          productos.map(producto => (
            <Grid item xs={12} md={6} key={producto.id}>
              <Paper sx={{ padding: '1rem' }}>
                <p>ID: {producto.id}</p>
                <p>Nombre: {producto.nom_producto}</p>
                <p>Precio: {producto.precio_producto}</p>
                <p>Detalle: {producto.detalle}</p>
                <p>Código: {producto.codigo}</p>
                <img 
                  src={`${ruta}/${producto.nom_producto}.jpg`} 
                  alt={producto.nom_producto} 
                  style={{ width: '100px', height: '100px' }} 
                  
                />
                <CtrlCantidad/>
                
              </Paper>

            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <p>No hay productos disponibles</p>
          </Grid>
        )}
      </Grid>
    </Box>


    </Box>

  );
}

export default Inicio;