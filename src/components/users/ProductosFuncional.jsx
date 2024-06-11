

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CardProducto from "./common/CardProducto";
import Button from "@mui/material/Button";
import CardDetalleCarrito from "./common/CardDetalleCarrito";
import CardTotal from "./common/CardTotal";

/*
 function  useDatos () {
  const [todoDatos, setTodoDatos] = useState([]);

  useEffect(() => {
    fetch("json/productos.json")
      .then(response => response.json())
      .then(response => {
        console.log ( " response "  + JSON.stringify(response.productos))
        setTodoDatos(response.productos)
      })
  }, [])

  return todoDatos
}
*/

import { getProductos } from "../services/productos.js";
import MenuCategoria from "./common/MenuCategoria.jsx";
import LinearProgress from "@mui/material/LinearProgress";





import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
  minHeight: "60vh",
  overflow: "auto",
};




function Productos() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [menu, setMenu] = useState([
    {
      idCategoria: "",
      nombreCategoria: "",
    },
  ]);

  const [filtro, setFiltro] = useState([]);
  const [loadign, setLoading] = useState(false);
  const [compra, setCompra] = useState([]);
  const [carrito, setCarrito] = useState(0);
  const [total, setTotal] = useState(0);

  // CODIGO NUEVO DE COMPRAS

  // FUNCION VALIDAR SI EXISTE UN PRODUCTO

  const existeProducto = (arreglo, id) => {
    let existe = false;
    arreglo.map((item) => {
      if (item.id === id) existe = true;
      return existe;
    });
    return existe;
  };

  const actualizarFront = () => {
    let compraStore = JSON.parse(localStorage.getItem("compras"));
    if (compraStore != null) {
      setCompra(compraStore);
      compraStore.map((c) => {
        if (existeProducto(filtro, c.id)) {
          let nuevoFiltro = [];
          nuevoFiltro = filtro.map((f) => {
            if (f.id === c.id) {
              f.cantidad = c.cantidad;
              return f;
            } else {
              return f;
            }
          });
          setFiltro(nuevoFiltro);
        }
      });
    }
  };

  useEffect(()=> {
    
  },[])


  const eliminarProducto = (objeto) => {
    console.log("eliminar producto " + JSON.stringify(objeto));

    let nuevoCompra = compra.filter(c => c.id != objeto.idProducto);
  
    setCompra(nuevoCompra);

    let compras = JSON.stringify(nuevoCompra);
    localStorage.setItem("compras", compras);

    actualizarFront();


  }


  const actualizarCantidad = (objeto) => {
      console.log("Cambios en el producto " + JSON.stringify(objeto));
      if (objeto.cantidad == 0) { 
        console.log(" OPEN DIALOG")
        setOpenDialog(true)
      }
    actualizarFront();
  };

  const actualizarCompra = (objeto) => {
    console.log("Cambios en el producto comprado  " + JSON.stringify(objeto));

    let nuevoCompra = [];
    nuevoCompra = compra.map((c) => {
      if (c.id === objeto.idProducto) {
        c.cantidad = objeto.cantidad;
        return c;
      } else {
        return c;
      }
    });
    setCompra(nuevoCompra);

    let compras = JSON.stringify(nuevoCompra);
    localStorage.setItem("compras", compras);

    actualizarFront();
  };

  const generarCompra = (objeto) => {
    //console.log ( "COMPRA " + JSON.stringify(objeto))

    let compraStore = JSON.parse(localStorage.getItem("compras"));

    if (compraStore == null) {
      console.log("PRIMERA COMPRA ");
      let compraNueva = [];
      compraNueva.push(objeto);
      let compras = JSON.stringify(compraNueva);
      localStorage.setItem("compras", compras);
    } else {
      //console.log ("EXISTEN COMPRAS  "  + JSON.stringify(compraStore))

      let nuevaCompra = compraStore;

      if (existeProducto(compraStore, objeto.id)) {
        console.log(` si existe ${objeto.id}`);

        nuevaCompra = compraStore.map((item) => {
          if (item.id === objeto.id) {
            item.cantidad = objeto.cantidad;
            return item;
          } else {
            return item;
          }
        });
      } else {
        console.log("compra nueva ");
        nuevaCompra.push(objeto);
      }

      let compras = JSON.stringify(nuevaCompra);
      localStorage.setItem("compras", compras);

      setCompra(compras);
      actualizarFront();
    }
  };

  useEffect(() => {
    setCarrito(compra.length);

    let subTotal = 0;
    compra.map((c) => {
      subTotal = subTotal + c.cantidad * c.precio;
    });
    setTotal(subTotal);
  }, [compra]);

  const existeCategoria = (arreglo, id) => {
    let existe = false;
    arreglo.forEach((item) => {
      if (item.idCategoria === id) existe = true;
      return existe;
    });
    return existe;
  };

  let products = [];
  const datos = getProductos();

  if (datos.length > 0) {
    //console.log ("tamano del vector " + datos.length)
    products = datos;

    //console.log ( " products "  + JSON.stringify(datos))
  }

  const opcionMenu = (opcion) => {
    
    setLoading(false);
    console.log(" Opcion ----> " + opcion);

    if (opcion == "00") {
      setFiltro(products);
    } else {
      let result = products.filter((item) => item.idCategoria == opcion);
      //console.log (" result " + JSON.stringify(result))
      setFiltro(result);
      
    }
    setTimeout(() => {
      setLoading(true);
      
      
    }, 500);
  };

  useEffect(() => {
    
    let menuCategoria = []; //verifico que la categoria no existe en el Menu Categorias y la inserto
    products.forEach((item) => {
      //console.log(item.nombreCategoria + "  " + existeCategoria(menuCategoria, item.idCategoria));
      if (!existeCategoria(menuCategoria, item.idCategoria)) {
        let objeto = {
          idCategoria: item.idCategoria,
          nombreCategoria: item.nombreCategoria,
        };
        menuCategoria.push(objeto);
      }
      setMenu(menuCategoria);
    });
    //console.log(" menuCategoria " + JSON.stringify(menuCategoria))
    setFiltro(products);

    setTimeout(() => {
      setLoading(true);
      
    }, 500);
  }, [products]);

  return (
    <Box sx={{ bgcolor: "#ffffff" }}>
      <MenuCategoria
        objeto={menu}
        getValor={opcionMenu}
        noCompras={carrito}
        openModal={handleOpen}
      />

      {!loadign ? (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
        >
          {filtro.map((item) => (
            <CardProducto
              key={item.id}
              id={item.id}
              titulo={item.nombre}
              precio={item.precio}
              descripcion={item.descripcion}
              noProductos={item.cantidad}
              foto={item.foto}
              compra={generarCompra}
              monitor={actualizarCantidad}
              eliminar={eliminarProducto}
            />
          ))}
        </Box>
      )}

      {/* MODAL */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        
        <Box sx={style}>
          <Box>
            {compra.map((item) => (
              <CardDetalleCarrito
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                precio={item.precio}
                foto={item.foto}
                noProductos={item.cantidad}
                monitor={actualizarCantidad}
                confirmar={actualizarCompra}
                eliminar={eliminarProducto}
              />
            ))}

            <CardTotal valor={total} />
          </Box>
          <Button onClick={handleClose}> Cerrar </Button>
  
        </Box>


      </Modal>

    

      {/* MODAL */}
    </Box>
  );
}

export default Productos;
