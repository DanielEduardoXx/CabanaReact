import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Footer from './Footer'; // Asegúrate de que la ruta sea correcta

// Importa la imagen que deseas usar como fondo

// Importa el video que deseas usar como fondo
import videoBackground from '../../../public/vid/vid1.mp4';

const Sugerencias = () => {

  //suggestion: Para manejar el valor seleccionado del campo Select.
  const [suggestion, setSuggestion] = React.useState('');
  //comment: Para manejar el texto ingresado en el campo de comentarios.
  const [comment, setComment] = React.useState('');

  //handleSuggestionChange: Actualiza el estado suggestion con el valor seleccionado del Select.
  const handleSuggestionChange = (event) => {
    setSuggestion(event.target.value);
  };
  //handleCommentChange: Actualiza el estado comment con el valor escrito en el TextField.
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    //Box: Contenedor principal que usa flexbox para centrar el contenido tanto horizontal como verticalmente.
    <Box sx={{
      height: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      //minHeight: '100vh': Asegura que el contenedor ocupe al menos la altura completa de la ventana del navegador.
      //minHeight: '70vh',
      overflow: 'hidden', // Para asegurar que el video no se desborde
      
    }}>


      {/* Card: Contenedor de la tarjeta con estilos de ancho mínimo, 
      adaptativo según el tamaño de la pantalla, y con flexbox para organizar su contenido en una columna. */}
      <Card sx={{
        marginTop: '2rem',
        minWidth: 275,
        width: { xs: "70%", md: "30%" },
        display: "flex",
        justifyContent: "center",
        //En el estilo del Card (sx), se agrega textAlign: "center" para asegurar que todo el contenido
        //dentro de la tarjeta esté centrado horizontalmente.
        textAlign: "center", // Alineación centrada para todo el contenido
        backgroundSize: 'cover', // Ajusta el tamaño de la imagen para cubrir toda la tarjeta
        backdropFilter: 'blur(5px)', // Aplicamos un filtro de desenfoque para mejorar la legibilidad sobre el fondo
        borderRadius: 16, // Añadimos bordes redondeados a la card
        border: '3px solid white', // Agregar borde blanco
        marginBottom: '50px', // Espacio para el footer
      }}>


        <video autoPlay muted loop
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover', // Ajusta el tamaño del video para cubrir el contenedor
            zIndex: -1, // Coloca el video detrás del contenido de la tarjeta
            borderRadius: 16, // Añadir bordes redondeados al video
            overflow: 'hidden', // Para asegurar que el borde redondeado se vea correctamente
          }}
        >
          <source src={videoBackground} type="video/mp4" />
          Tu navegador no soporta el elemento de video.
        </video>

        <CardContent>

          <Box>
            <Typography variant="h2" component="div" sx={{
              color: 'white',
            }} >
              SUGERENCIAS
            </Typography>
          </Box>


          {/* Box con Select: Contiene el menú desplegable para seleccionar una sugerencia. */}
          <Box sx={{
            mt: 2,
          }}>
            {/* Select: Menú desplegable para seleccionar una sugerencia. */}
            <Select
              value={suggestion}
              onChange={handleSuggestionChange}
              displayEmpty
              fullWidth
              sx={{
                color: 'white',
              }}
            >
              <MenuItem value="" disabled>
                Tipo  de Sugerencia
              </MenuItem>
              <MenuItem value="option1">1 SUGERENCIA </MenuItem>
              <MenuItem value="option2">2 QUEJA </MenuItem>
              <MenuItem value="option3">3 RECLAMO </MenuItem>
            </Select>
          </Box>


          {/* Box con TextField: Contiene el campo de texto para comentarios. 
          El TextField es multilinea con cuatro filas por defecto. */}
          <Box sx={{
            mt: 2,
          }}>
            {/* TextField: Campo de texto multilinea para ingresar comentarios. */}
            <TextField
              label="Comentario:"
              multiline
              rows={5}
              variant="outlined"
              fullWidth
              value={comment}
              onChange={handleCommentChange}

              InputLabelProps={{ // Establece los estilos para el label del TextField
                sx: { color: 'white' } // Color de texto blanco para el label
              }}

              InputProps={{ // Establece los estilos para el texto dentro del TextField
                sx: {
                  color: 'white', // Color de texto blanco para el texto dentro del TextField
                }
              }}
            />
          </Box>


          <Box sx={{ mt: 2 }}>
            {/* CardActions: Contenedor para las acciones de la tarjeta. 
          Aquí, el botón "Enviar Sugerencia" está centrado usando justifyContent: 'center'. */}
            <CardActions sx={{
              justifyContent: 'center',
            }}>
              <Button size="large" sx={{
                /* fontSize: '1.25rem': Aumenta el tamaño de la fuente del texto del botón. */
                fontSize: '1.45rem',
                /* padding: '10px 20px': Ajusta el relleno (padding) 
                dentro del botón para hacerlo más grande y cómodo de presionar. */
                padding: '20px 20px',
                color: 'white',

                /* :hover: Define los estilos que se aplicarán cuando el puntero del mouse esté sobre el botón. */
                ':hover': {
                  fontSize: '1.45rem',
                  /* backgroundColor: 'red': Cambia el color de fondo del botón a rojo. */
                  backgroundColor: '#FD2626',
                  /* color: 'white': Cambia el color del texto del botón a blanco
                   para que el texto sea visible sobre el fondo rojo. */
                  color: 'white',
                }
              }}>REGISTRAR</Button>
            </CardActions>
          </Box>


        </CardContent>
      </Card>
      
      {/* Aquí colocamos el footer */}
      <Footer />
    </Box>
  );
}

export default Sugerencias;