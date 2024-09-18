import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import registro from '../../../services/registro';


const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {
        margin: theme.spacing(2, 0),
        width: '100%',
        display: { md: 'flex', sm: 'flex' },
        alignItems: { xs: 'center', md: 'center', sm: 'center' },
        alignContent: { xs: 'center', md: 'center', sm: 'center' },
    },
}));

const validationSchema = yup.object({
    email: yup.string().email('Debe ser un correo válido').required('Campo requerido'),
    password: yup.string()
        .required('Campo requerido').min(6, 'Debe tener al menos 6 caracteres')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, 'Debe contener letras, números y un caracter especial'),
    password_confirmation: yup.string()
        .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Campo requerido'),
    id: yup.string().required('Campo requerido').nullable(),
    direccion: yup.string().required('Campo requerido').nullable(),
    name: yup.string().required('Nombre es Requerido'),
    tipo_doc: yup.string().required('Tipo de Documento es Requerido'),
    tel: yup.string().required('Teléfono es Requerido'),
    fecha_naci: yup.date().required('Fecha de Nacimiento es Requerido'),
    genero: yup.string().required('Género es Requerido'),
});

export default function CamposRegistro() {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        tipo_doc: '',
        email: '',
        tel: '',
        fecha_naci: dayjs('YYYY-MM-DD'),
        password: '',
        password_confirmation: '',
        direccion: '',
        genero: '',
        image: null,
        // role_id: '2'
    });

    const fechaActual = dayjs();
    const fechaNacimiento = formData.fecha_naci;
    const validacionEdad = fechaActual.diff(fechaNacimiento, 'year');

    const [errors, setErrors] = useState({});
    const [errorPasswords, setErrorPasswords] = useState();
    const [errorFechaNaci, setErrorFechaNaci] = useState();
    const [errorId, setErrorId] = useState();
    const [registroSatisfactorio, setRegistroSatisfactorio] = useState();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    // const handleImageChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         if (!file.type.startsWith('image/')) {
    //             setErrors('Please select a valid image file');
    //             return;
    //         }
    //         if (file.size > 2 * 1024 * 1024) { // 2MB
    //             setErrors('File size should be less than 2MB');
    //             return;
    //         }
    //         setErrors('');
    //         setFormData((prevData) => ({
    //             ...prevData,
    //             image: file,
    //         }));
    //     }
    // };

    const handleChangeGenero = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            genero: event.target.value,
        }));
    };

    const handleTipoDoc = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            tipo_doc: event.target.value,
        }));
    };

    const handleDateChange = (newValue) => {
        setFormData((prevData) => ({
            ...prevData,
            fecha_naci: newValue, // Actualizar con dayjs object
        }));
    };

    const validate = () => {
        let isValid = true;

        if (formData.password !== formData.password_confirmation) {
            isValid = false;
            setErrorPasswords('Las Contraseñas no coinciden');
            return false;
        }

        if (validacionEdad < 18 || fechaNacimiento > fechaActual || validacionEdad > 100) {
            setErrorFechaNaci('Imposible registrar esta Fecha de Nacimiento');
            return false;
        }

        try {
            validationSchema.validateSync(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const validationErrors = {};
            err.inner.forEach((error) => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
            return false;
        }
    };

    useEffect(() => {
        if (errorPasswords) {
            const timer = setTimeout(() => {
                setErrorPasswords('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorPasswords]);

    useEffect(() => {
        if (errorFechaNaci) {
            const timer = setTimeout(() => {
                setErrorFechaNaci('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorFechaNaci]);

    useEffect(() => {
        if (errorId) {
            const timer = setTimeout(() => {
                setErrorId('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            try {
                const response = await registro.registrarUsuario(formData);
                setTimeout(() => {
                    navigate('../iniciar-sesion');
                }, 5000);
                setRegistroSatisfactorio('¡Enhorabuena! Revisa tu correo para activar tu cuenta!');
                console.log('Success:', response);
            } catch (error) {
                console.error('Error:', error.response?.data.messages.email[0] || error.messages);

                setErrorId('Error: ', error.response?.data.messages.email[0]);

            }
        }
    };
    return (

        <Box>
            {errorPasswords && (

                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">{errorPasswords}</Alert>
                </Stack>

            )}

            {errorFechaNaci && (

                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">{errorFechaNaci}</Alert>
                </Stack>

            )}
            {errorId && (

                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="error">{errorId}</Alert>
                </Stack>

            )}

            {registroSatisfactorio && (
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="success">{registroSatisfactorio}</Alert>
                </Stack>
            )}
            <StyledForm onSubmit={handleSubmit} noValidate autoComplete="off">

                <Box
                    sx={{
                        display: 'grid',
                        gap: 4, // Espacio entre los elementos
                        gridTemplateColumns: { md: 'repeat(2 ,1fr)', xs: 'repeat(3)', sm: 'repeat(2,1fr)' }, // Dos columnas con igual ancho
                        width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible

                    }}
                >

                    <Box>
                        <h3>Datos Personales</h3>

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="id"
                            label="Cedula"
                            type="number"
                            variant="outlined"
                            value={formData.id}
                            onChange={handleChange}
                            error={!!errors.id}
                            helperText={errors.id}

                        />


                        <FormControl fullWidth>
                            <InputLabel id="genero">Tipo Documento</InputLabel>
                            <Select
                                sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                labelId="tipo doc"
                                id="tipo_doc"
                                value={formData.tipo_doc}
                                label="tipo doc"
                                onChange={handleTipoDoc}
                            >

                                <MenuItem value={'cedula'}>Cedula</MenuItem>
                                <MenuItem value={'cedula extrangeria'}>Cedula Extrangeria</MenuItem>
                                <MenuItem value={'documento id'}>Documento de Identidad</MenuItem>
                            </Select>

                            <FormHelperText>{errors.tipo_doc}</FormHelperText>

                        </FormControl>

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="name"
                            label="Nombre Completo"
                            variant="outlined"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}

                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                id='fecha_naci'
                                label="Fecha de Nacimiento"
                                value={formData.fecha_naci}
                                onChange={handleDateChange}
                                format="YYYY-MM-DD"
                                error={!!errors.fecha_naci}
                                helperText={errors.fecha_naci}

                            />
                        </LocalizationProvider>

                        <FormControl fullWidth>
                            <InputLabel id="genero">Genero</InputLabel>
                            <Select
                                sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                labelId="genero"
                                id="genero"
                                value={formData.genero}
                                label="Genero"
                                onChange={handleChangeGenero}
                            >

                                <MenuItem value={'Masculino'}>Masculino</MenuItem>
                                <MenuItem value={'Femenino'}>Femenino</MenuItem>
                                <MenuItem value={'Otro'}>Otro</MenuItem>
                            </Select>

                            <FormHelperText>{errors.genero}</FormHelperText>

                        </FormControl>

                    </Box>

                    <Box>

                        <h3>Datos de Cuenta</h3>

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="direccion"
                            label="Direccion"
                            variant="outlined"
                            value={formData.direccion}
                            onChange={handleChange}
                            error={!!errors.direccion}
                            helperText={errors.direccion}

                        />

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="email"
                            label="Email"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}

                        />

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="tel"
                            label="Telefono"
                            variant="outlined"
                            value={formData.tel}
                            onChange={handleChange}
                            error={!!errors.tel}
                            helperText={errors.tel}

                        />
                        {/* 
                        <TextField

                            sx={{ display: 'none' }}
                            id="rol_id"
                            label="Rol"
                            variant="outlined"
                            type="password"
                            value={formData.role_id}
                            onChange={handleChange}

                        /> */}

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="password"
                            label="Password"
                            variant="outlined"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}

                        />

                        <TextField
                            sx={{ margin: '5px 0', width: { xs: '100%' } }}
                            id="password_confirmation"
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}

                        />
                    </Box>
                    {/* 
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </Box> */}
                </Box >



                <Box>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: { xs: '100%', sm: '100%', md: '100%', lg: '100%' } }}>
                        Registrarse
                    </Button>
                </Box>

            </StyledForm >
        </Box >


    );
}
