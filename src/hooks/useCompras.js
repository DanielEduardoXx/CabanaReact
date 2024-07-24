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
  const key = `cart_${String(userId)}`;
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
  const key = `cart_${String(userId)}`;
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
  const userCart = getCompras(String(userId)); // Asegurarse de que userId sea una cadena

  const mergedCart = [...userCart];

  guestCart.forEach(guestItem => {
    const existingItem = mergedCart.find(item => item.id === guestItem.id);
    if (existingItem) {
      existingItem.cantidad += guestItem.cantidad;
    } else {
      mergedCart.push(guestItem);
    }
  });

  setCompras(mergedCart, String(userId)); // Asegurarse de que userId sea una cadena
  localStorage.removeItem("cart_guest"); // Limpiar el carrito de guest después de la fusión
  localStorage.removeItem("cantidades_guest"); // Limpiar el carrito de guest después de la fusión
}
