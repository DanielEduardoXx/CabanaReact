
import { useEffect, useState } from "react";
import {getUsuarios} from '../services/usuarios.js'

export function useUsuarios () {
    console.log ("Ejecuntado hooks .....")
    const [users, setUsers] = useState([])

    useEffect (() => {
        /*
        const newUsers = getUsuarios()
        console.log ("newUsers " + JSON.stringify(newUsers))
        setUsers(newUsers)
       */
        getUsuarios().then((response) => {
            setUsers(response)
           // console.log("datos hooks ... " + JSON.stringify(response));
          })
          .catch((error) => {
            console.log(error);
          });
         
      }, [])

  return {users}
}