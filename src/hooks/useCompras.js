const existeProducto = (arreglo, id) => { // valida si al arrelgo existe el id  para prodcutos 
  let existe = false;
  arreglo.map((item) => {
    if (item.id === id) existe = true;
    return existe;
  });
  return existe;
};

const getNuevaCantidad = (arreglo, id) => {  // del arreglo enviado busca el item con el id enviado y toma la cantidad 
  let nuevaCantidad = 0;
  arreglo.map((item) => {
    if (item.id === id) nuevaCantidad = item.cantidad;
    return nuevaCantidad;
  });
  return nuevaCantidad;
};

const existeCategoria = (arreglo, id) => { // valida si al arrelgo existe el id  para categoria  
  let existe = false;
  arreglo.forEach((item) => {
    if (item.idCategoria === id) existe = true;
    return existe;
  });
  return existe;
};

export function getMenu(productos) {  // de la lista de productos genera un menu dinamico con las categorias exsitente 
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
 
export function getCompras() { // obtiene las compras del local storage
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) return compraStore;
  else return [];
}

export function setCompras(nuevaCompra) { //  graba los compras en el local Storate
  let compras = JSON.stringify(nuevaCompra);
  localStorage.setItem("compras", compras);
  return nuevaCompra;
}

export function addCompra(compra) {  // agrega una nueva compra
  let compraNueva = [];
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore == null) { // si compras vacias es la primera compra .....
    compraNueva.push(compra);
  } else {
    compraNueva = compraStore;
    if (existeProducto(compraStore, compra.id)) {  // si compras no vacias valida si al nueva compra exsite 
      compraNueva = compraStore.map((item) => {   // si existe genera objeto nuevo actualizando la cantidad 
        if (item.id === compra.id) {    
          item.cantidad = compra.cantidad;
          return item;
        } else {
          return item;
        }
      });
    } else { 
      compraNueva.push(compra); // si no existe la agrega 
    }
  }
  let compras = JSON.stringify(compraNueva);  // actualiza compras en el local storage
  localStorage.setItem("compras", compras);
  return compraNueva;  // retorna compras con su actualizaciones .....
}

export function updateCompra(objeto) {

   // actializa la cantidad de compra para esta funcion parte del hecho que el objeto ya exsite solo es actualziar la cantidad 
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
  return "Error Actualizar  Compra";

}

export function deleteCompras(compra) {  // borra el producto ... genera un filtro donde ignora el que estamos enviando .....
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) {
    let nuevoCompra = compraStore.filter((c) => c.id != compra.id);
    let compras = JSON.stringify(nuevoCompra);
    localStorage.setItem("compras", compras);
    return nuevoCompra;
  }
  return "Error Borrar  Compra";
}

export function updateFront(filtro) {  // fucnion para actulaizar el front 
  //console.log ( " function updateFront " + JSON.stringify(filtro))
  let nuevoFiltro = [];
  let compraStore = JSON.parse(localStorage.getItem("compras"));
  if (compraStore != null) {
    nuevoFiltro = filtro.map((objetoFiltro) => {
      if (existeProducto(compraStore, objetoFiltro.id)) { // valida si existe el producto  .......
        //console.log ( " function updateFront valor " + existeProducto(compraStore, objetoFiltro.id))
        let valor = getNuevaCantidad(compraStore, objetoFiltro.id); // si existe ek asigna  la nueva catidad con la funcion mostrada
        //console.log ( " function updateFront valor " + JSON.stringify(valor))
        objetoFiltro.cantidad = valor;
        return objetoFiltro;
      } else {
        objetoFiltro.cantidad = 0;
        return objetoFiltro;
      }
    });
    //console.log ( " function updateFront nuevoFiltro " + JSON.stringify(nuevoFiltro))
    return nuevoFiltro;
  } else {
    return filtro;
  }
}

export function getfiltro(productos, opcion) { // filtra el vector productos segun la opcion enviada .....
  let result = productos.filter((item) => item.idCategoria == opcion);
  return result;
}
