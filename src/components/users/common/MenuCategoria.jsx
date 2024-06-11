import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function MenuCategoria({objeto, getValor, noCompras, openModal}) {
  
  const handleModal = () =>{
    openModal(true)
  }

    const handleOpcion= (myVal) => {
        getValor(myVal)
        
        //console.log (" valor " + myVal)
     
      };
 

    return (
        <Box color="primary" marginTop={'1rem'} sx={{ display: 'flex', justifyContent:'center'}}>
              <Stack  direction="row" spacing={4}>
            {/* -   pinta el icono menu para mostrar todos los producto scon la opcion 00-  */}
              <IconButton  key={0} size="large" 
             onClick={()=> handleOpcion(`00`)}>
             <Avatar  sx={{ width: 50, height: 50  , margin: '3px'}}
                alt={'Todos los productos'} src={`./icoMenuA.svg`} 
                /> 
           </IconButton>
         {/* -   pinta el resto de iconos de categoria iterando el vector objeto   */}
        {objeto.map((item)=>(
             <IconButton  key={item.idCategoria} size="large" 
             onClick={()=> handleOpcion(`${item.idCategoria}`)}>
             <Avatar  sx={{ width: 50, height: 50  , margin: '3px'}}
                alt={item.nombreCategoria} src={`./${item.idCategoria}.png`} 
                /> 
           </IconButton>
         
              
               

        ))}

         
         </Stack>

         <Box>
          {/* -   icono carrito que abre el modal y pinta la cantidad de productos   */}
          <IconButton
              aria-label="show 17 new notifications"
              color="inherit"
              onClick={handleModal}
              disabled={noCompras > 0? false: true }
            >
              <Badge badgeContent={noCompras} color="error">
                <AddShoppingCartIcon  sx={{ fontSize:"20"}} color="green" />
              </Badge>
            </IconButton>
          </Box>

      </Box>
    );
  }
  
  export default MenuCategoria;

  