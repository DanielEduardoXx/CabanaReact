export const existeProducto = (arreglo, id) => {
  return arreglo.some((item) => item.id === id);
};

export const getNuevaCantidad = (arreglo, id) => {
  const item = arreglo.find((item) => item.id === id);
  return item ? item.cantidad : 0;
};

export const existeCategoria = (arreglo, id) => {
  return arreglo.some((item) => item.idCategoria === id);
};

export function getMenu(productos) {
  let menuCategoria = [];
  productos.forEach((item) => {
    if (!existeCategoria(menuCategoria, item.idCategoria)) {
      let objeto = {
        idCategoria: item.idCategoria,
        nombreCategoria: item.nombreCategoria,
      };
      menuCategoria.push(objeto);
    }
  });
  return menuCategoria;
}

export function getCompras(userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  try {
    let compraStore = JSON.parse(localStorage.getItem(key));
    console.log("getCompras:", compraStore);
    return compraStore || [];
  } catch (error) {
    console.error('Error al leer desde localStorage:', error);
    return [];
  }
}

export function setCompras(nuevaCompra, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  try {
    console.log("setCompras:", nuevaCompra);
    localStorage.setItem(key, JSON.stringify(nuevaCompra));
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
}

export function addCompra(objeto, userId = "guest") {
  try {
    const compras = getCompras(userId);
    if (!existeProducto(compras, objeto.id)) {
      compras.push(objeto);
      setCompras(compras, userId);
      return compras;
    } else {
      let compraNueva = compras.map((item) => {
        if (item.id === objeto.id) {
          item.cantidad = objeto.cantidad;
        }
        return item;
      });
      setCompras(compraNueva, userId);
      return compraNueva;
    }
  } catch (error) {
    console.error('Error al actualizar en localStorage:', error);
    return [];
  }
}

export function deleteCompras(compra, userId = "guest") {
  try {
    const compras = getCompras(userId);
    const updatedCompras = compras.filter((item) => item.id !== compra.id);
    setCompras(updatedCompras, userId);
    return updatedCompras;
  } catch (error) {
    console.error('Error al eliminar en localStorage:', error);
    return [];
  }
}

export function updateFront(objeto, userId = "guest") {
  try {
    const compras = getCompras(userId);
    let comprasFront = [];
    compras.forEach((item) => {
      if (item.id === objeto.id && item.cantidad > 0) {
        item.cantidad = objeto.cantidad;
        comprasFront.push(item);
      } else if (item.id !== objeto.id) {
        comprasFront.push(item);
      }
    });
    setCompras(comprasFront, userId);
    return comprasFront;
  } catch (error) {
    console.error('Error al actualizar el frontend:', error);
    return [];
  }
}

export function mergeCarts(userId) {
  const guestCart = getCompras("guest");
  const userCart = getCompras(userId);

  const mergedCart = [...userCart];

  guestCart.forEach(guestItem => {
    const existingItem = mergedCart.find(item => item.id === guestItem.id);
    if (existingItem) {
      existingItem.cantidad += guestItem.cantidad;
    } else {
      mergedCart.push(guestItem);
    }
  });

  setCompras(mergedCart, userId);
  localStorage.removeItem("cart_guest"); // Limpiar el carrito de guest después de la fusión
}


// // useCompras.js

// export const existeProducto = (arreglo, id) => {
//   return arreglo.some((item) => item.id === id);
// };

// export const getNuevaCantidad = (arreglo, id) => {
//   const item = arreglo.find((item) => item.id === id);
//   return item ? item.cantidad : 0;
// };

// export const existeCategoria = (arreglo, id) => {
//   return arreglo.some((item) => item.idCategoria === id);
// };

// export function getMenu(productos) {
//   let menuCategoria = [];
//   productos.forEach((item) => {
//     if (!existeCategoria(menuCategoria, item.idCategoria)) {
//       let objeto = {
//         idCategoria: item.idCategoria,
//         nombreCategoria: item.nombreCategoria,
//       };
//       menuCategoria.push(objeto);
//     }
//   });
//   return menuCategoria;
// }

// export const setCompras = (compras, userKey) => {
//   localStorage.setItem(`cart_${userKey}`, JSON.stringify(compras));
// };

// export const getCompras = (userKey) => {
//   return JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];
// };

// export const addCompra = (compra, userKey) => {
//   const storedCart = getCompras(userKey) || [];
//   console.log('Carrito antes de agregar:', storedCart); // Log para depuración
//   const index = storedCart.findIndex(item => item.id === compra.id);
//   if (index !== -1) {
//       storedCart[index].cantidad += compra.cantidad;
//   } else {
//       storedCart.push(compra);
//   }
//   setCompras(storedCart, userKey);
//   console.log('Carrito después de agregar:', storedCart); // Log para depuración
//   return storedCart;
// };

// export function updateCompra(objeto, userId = "guest") {
//   const key = userId ? `cart_${userId}` : `cart_guest`;
//   let compraNueva = [];
//   let compraStore = JSON.parse(localStorage.getItem(key));

//   if (compraStore != null) {
//     compraNueva = compraStore.map((item) => {
//       if (item.id === objeto.id) {
//         item.cantidad = objeto.cantidad;
//       }
//       return item;
//     });
//     localStorage.setItem(key, JSON.stringify(compraNueva));
//     return compraNueva;
//   }
//   return "Error Actualizar Compra";
// }

// export function deleteCompras(compra, userId = "guest") {
//   const key = userId ? `cart_${userId}` : `cart_guest`;
//   let compraStore = JSON.parse(localStorage.getItem(key));

//   if (compraStore != null) {
//     let nuevoCompra = compraStore.filter((c) => c.id !== compra.id);
//     localStorage.setItem(key, JSON.stringify(nuevoCompra));
//     return nuevoCompra;
//   }
//   return "Error Borrar Compra";
// }

// export function updateFront(filtro, userId = "guest") {
//   const key = userId ? `cart_${userId}` : `cart_guest`;
//   let nuevoFiltro = [];
//   let compraStore = JSON.parse(localStorage.getItem(key));

//   if (compraStore != null) {
//     nuevoFiltro = filtro.map((objetoFiltro) => {
//       if (existeProducto(compraStore, objetoFiltro.id)) {
//         let valor = getNuevaCantidad(compraStore, objetoFiltro.id);
//         objetoFiltro.cantidad = valor;
//       } else {
//         objetoFiltro.cantidad = 0;
//       }
//       return objetoFiltro;
//     });
//   } else {
//     nuevoFiltro = filtro.map((objetoFiltro) => {
//       objetoFiltro.cantidad = 0;
//       return objetoFiltro;
//     });
//   }
//   return nuevoFiltro;
// }

// export function getfiltro(productos, opcion) {
//   return productos.filter((item) => item.idCategoria === opcion);
// }
