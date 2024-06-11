import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


import { Navigate, useNavigate } from 'react-router-dom';
import LoadingComponent from './LoadingComponent';
import {login} from '../../../services/login.js'
import { MyContext } from '../../../services/myContext.js';
import { useContext } from 'react';


                                                                                                                           
const StyledForm = styled('form')(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(1, 0),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));



export default function CamposLogin() {

  const navigate = useNavigate();
  const {setUser } = useContext(MyContext)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorInicio, setErrorInicio] = useState();
  const [CredencialesCorrectas, setCredencialesCorrectas] = useState()
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,

    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await login(formData);
      setUser(data)
      console.log(data)
      setCredencialesCorrectas('Haz Iniciado Sesion Correctamente');
      setLoading(false);
      setTimeout(() => {
        navigate('../inicio');
       
      }, 1000);
    } catch (error) {
      setErrorInicio(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (CredencialesCorrectas) {
      const timer = setTimeout(() => {
        setCredencialesCorrectas('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [CredencialesCorrectas]);

  useEffect(() => {
    if (errorInicio) {
      const timer = setTimeout(() => {
        setErrorInicio('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorInicio]);

  return (

    <Box
      sx={{
        marginTop: '1rem',
        flexDirection: 'column',
        width: '100%',
      }}

    >


      {errorInicio && (


        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="error">{errorInicio}</Alert>
        </Stack>


      )}


      <LoadingComponent loading={loading} />
      {CredencialesCorrectas && (

        <Stack sx={{ width: '100%',}} spacing={2}>
          <Alert severity="success">{CredencialesCorrectas}</Alert>
        </Stack>

      )}

      <StyledForm onSubmit={handleSubmit} noValidate autoComplete="off"
        sx={{
          width: '100%',
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop:'1rem'
          }}
        >

          <TextField
            sx={{
              width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' }
            }}
            id="email"
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}

          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}

        >
          <TextField
            sx={{
              width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' }
            }}
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Box>

        {/*Este es el campo del Boton*/}




        <Button type="submit" variant="contained" color="primary" sx={{ width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' } }}>
          Iniciar Sesion
        </Button>

      </StyledForm>
    </Box>

  );
}


