// useCompras.js

export const existeProducto = (arreglo, id) => {
  let existe = false;
  arreglo.map((item) => {
    if (item.id === id) existe = true;
    return existe;
  });
  return existe;
};

export const getNuevaCantidad = (arreglo, id) => {
  let nuevaCantidad = 0;
  arreglo.map((item) => {
    if (item.id === id) nuevaCantidad = item.cantidad;
    return nuevaCantidad;
  });
  return nuevaCantidad;
};

export const existeCategoria = (arreglo, id) => {
  let existe = false;
  arreglo.forEach((item) => {
    if (item.idCategoria === id) existe = true;
    return existe;
  });
  return existe;
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

export function getCompras() {
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) return compraStore;
  else return [];
}

export function setCompras(nuevaCompra) {
  let compras = JSON.stringify(nuevaCompra);
  localStorage.setItem("compras", compras);
  return nuevaCompra;
}

export function addCompra(compra) {
  let compraNueva = [];
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore == null) {
    compraNueva.push(compra);
  } else {
    compraNueva = compraStore;
    if (existeProducto(compraStore, compra.id)) {
      compraNueva = compraStore.map((item) => {
        if (item.id === compra.id) {
          item.cantidad = compra.cantidad;
          return item;
        } else {
          return item;
        }
      });
    } else {
      compraNueva.push(compra);
    }
  }
  let compras = JSON.stringify(compraNueva);
  localStorage.setItem("compras", compras);
  return compraNueva;
}

export function updateCompra(objeto) {
  let compraNueva = [];
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) {
    compraNueva = compraStore.map((item) => {
      if (item.id === objeto.id) {
        item.cantidad = objeto.cantidad;
        return item;
      } else {
        return item;
      }
    });
    let compras = JSON.stringify(compraNueva);
    localStorage.setItem("compras", compras);
    return compraNueva;
  }
  return "Error Actualizar Compra";
}

export function deleteCompras(compra) {
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) {
    let nuevoCompra = compraStore.filter((c) => c.id !== compra.id);
    let compras = JSON.stringify(nuevoCompra);
    localStorage.setItem("compras", compras);
    return nuevoCompra;
  }
  return "Error Borrar Compra";
}

export function updateFront(filtro) {
  let nuevoFiltro = [];
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) {
    nuevoFiltro = filtro.map((objetoFiltro) => {
      if (existeProducto(compraStore, objetoFiltro.id)) {
        let valor = getNuevaCantidad(compraStore, objetoFiltro.id);
        objetoFiltro.cantidad = valor;
        return objetoFiltro;
      } else {
        objetoFiltro.cantidad = 0;
        return objetoFiltro;
      }
    });
    return nuevoFiltro;
  } else {
    return filtro;
  }
}

export function getfiltro(productos, opcion) {
  let result = productos.filter((item) => item.idCategoria === opcion);
  return result;
}
