import React, { useEffect, useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from './LoadingComponent';
import { login } from '../../../services/login';
import { MyContext } from '../../../services/MyContext.jsx';

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
  const { setUser } = useContext(MyContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorInicio, setErrorInicio] = useState('');
  const [credencialesCorrectas, setCredencialesCorrectas] = useState('');
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
      const userData = await login(formData);
      setUser(userData); // Actualiza el contexto con la información del usuario
      localStorage.setItem('user', JSON.stringify(userData)); // Guarda la información del usuario en localStorage
      setCredencialesCorrectas('Haz Iniciado Sesion Correctamente');
      setLoading(false);
      setTimeout(() => {
        navigate('/');
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
    if (credencialesCorrectas) {
      const timer = setTimeout(() => {
        setCredencialesCorrectas('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [credencialesCorrectas]);

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
      {credencialesCorrectas && (
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="success">{credencialesCorrectas}</Alert>
        </Stack>
      )}

      <StyledForm onSubmit={handleSubmit} noValidate autoComplete="off">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '1rem',
          }}
        >
          <TextField
            sx={{
              width: '100%',
            }}
            id="email"
            label="Email"
            type="email"
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
              width: '100%',
            }}
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Box>

        <Button type="submit" variant="contained" color="primary" sx={{ width: '100%' }}>
          Iniciar Sesion
        </Button>
      </StyledForm>
    </Box>
  );
}
