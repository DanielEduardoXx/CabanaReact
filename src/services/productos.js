import { useEffect, useState } from "react";

export function  getProductos () {
    const [todoDatos, setTodoDatos] = useState([]);
  
    useEffect(() => {
      fetch("json/productos.json")
        .then(response => response.json())
        .then(response => {
          // console.log ( " servicio .... "  + JSON.stringify(response))
          setTodoDatos(response.productos)
        })
    }, [])
  
    return todoDatos
  }
  