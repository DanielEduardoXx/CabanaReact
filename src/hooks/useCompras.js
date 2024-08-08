// useCompras.js

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
  let compraStore = JSON.parse(localStorage.getItem(key));
  return compraStore || [];
}

export function setCompras(nuevaCompra, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  localStorage.setItem(key, JSON.stringify(nuevaCompra));
  return nuevaCompra;
}

export function addCompra(compra, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  let compraNueva = [];
  let compraStore = JSON.parse(localStorage.getItem(key));

  if (compraStore == null) {
    compraNueva.push(compra);
  } else {
    compraNueva = compraStore;
    if (existeProducto(compraStore, compra.id)) {
      compraNueva = compraStore.map((item) => {
        if (item.id === compra.id) {
          item.cantidad = compra.cantidad;
        }
        return item;
      });
    } else {
      compraNueva.push(compra);
    }
  }

  localStorage.setItem(key, JSON.stringify(compraNueva));
  return compraNueva;
}

export function updateCompra(objeto, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  let compraNueva = [];
  let compraStore = JSON.parse(localStorage.getItem(key));

  if (compraStore != null) {
    compraNueva = compraStore.map((item) => {
      if (item.id === objeto.id) {
        item.cantidad = objeto.cantidad;
      }
      return item;
    });
    localStorage.setItem(key, JSON.stringify(compraNueva));
    return compraNueva;
  }
  return "Error Actualizar Compra";
}

export function deleteCompras(compra, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  let compraStore = JSON.parse(localStorage.getItem(key));

  if (compraStore != null) {
    let nuevoCompra = compraStore.filter((c) => c.id !== compra.id);
    localStorage.setItem(key, JSON.stringify(nuevoCompra));
    return nuevoCompra;
  }
  return "Error Borrar Compra";
}

export function updateFront(filtro, userId = "guest") {
  const key = userId ? `cart_${userId}` : `cart_guest`;
  let nuevoFiltro = [];
  let compraStore = JSON.parse(localStorage.getItem(key));

  if (compraStore != null) {
    nuevoFiltro = filtro.map((objetoFiltro) => {
      if (existeProducto(compraStore, objetoFiltro.id)) {
        let valor = getNuevaCantidad(compraStore, objetoFiltro.id);
        objetoFiltro.cantidad = valor;
      } else {
        objetoFiltro.cantidad = 0;
      }
      return objetoFiltro;
    });
  } else {
    nuevoFiltro = filtro.map((objetoFiltro) => {
      objetoFiltro.cantidad = 0;
      return objetoFiltro;
    });
  }
  return nuevoFiltro;
}

export const mergeCarts = (userCart, guestCart) => {
  const cartMap = new Map();

  // Agregar productos del carrito del usuario al mapa
  userCart.forEach(item => {
    cartMap.set(item.id, item);
  });

  // Combinar con productos del carrito "guest"
  guestCart.forEach(item => {
    if (cartMap.has(item.id)) {
      const existingItem = cartMap.get(item.id);
      existingItem.cantidad += item.cantidad;
    } else {
      cartMap.set(item.id, item);
    }
  });

  // Convertir el mapa de vuelta a una lista
  return Array.from(cartMap.values());
};

export function getfiltro(productos, opcion) {
  return productos.filter((item) => item.idCategoria === opcion);
}
