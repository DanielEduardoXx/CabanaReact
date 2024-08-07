import { useState } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import * as yup from 'yup';
import { useFormik } from 'formik';

// Estilo para los campos
const FieldWrapper = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2), // Ajusta el margen inferior
    width: '100%', // Asegura que los campos ocupen todo el ancho disponible
    boxSizing: 'border-box', // Incluye padding y border en el ancho total
}));

// Estilo para el contenedor del botón
const ButtonWrapper = styled('div')({
    display: 'flex',
    justifyContent: 'center', // Centra el botón horizontalmente
    marginTop: '1rem', // Espacio superior del botón
});

// Esquema de validación
const validationSchema = yup.object({
    tipo_sugerencia: yup.string().required('Tipo de Sugerencia es Requerido'),
    sugerencia: yup.string().required('Sugerencia es Requerido'),
});

const CamposRegistro = () => {
    const [submitted, setSubmitted] = useState(false); // Estado para manejar si el formulario ha sido enviado

    const formik = useFormik({
        initialValues: {
            tipo_sugerencia: '',
            sugerencia: '',
        },
        validationSchema: validationSchema,
        validateOnChange: false, // No valida en cada cambio
        validateOnBlur: false, // No valida en cada desenfoque
        onSubmit: (values) => {
            console.log(values);
            // Aquí puedes agregar la lógica para enviar los datos a la API
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true); // Marca el formulario como enviado
        formik.handleSubmit(); // Envía el formulario si es válido
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Campo Tipo de Sugerencia */}
            <FieldWrapper>
                <FormControl
                    fullWidth
                    error={submitted && formik.errors.tipo_sugerencia}
                    variant="outlined"
                    sx={{ boxSizing: 'border-box' }} // Evita el desbordamiento
                >
                    <InputLabel id="tipo_sugerencia-label">Tipo de Sugerencia</InputLabel>
                    <Select
                        labelId="tipo_sugerencia-label"
                        id="tipo_sugerencia"
                        name="tipo_sugerencia"
                        value={formik.values.tipo_sugerencia}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        label="Tipo de Sugerencia"
                        sx={{ boxSizing: 'border-box' }} // Evita el desbordamiento
                    >
                        <MenuItem value=""><em>Ninguno</em></MenuItem>
                        <MenuItem value="tipo1">Queja</MenuItem>
                        <MenuItem value="tipo2">Reclamo</MenuItem>
                        <MenuItem value="tipo3">Sugerencia</MenuItem>
                    </Select>
                    {submitted && formik.errors.tipo_sugerencia ? (
                        <FormHelperText>{formik.errors.tipo_sugerencia}</FormHelperText>
                    ) : null}
                </FormControl>
            </FieldWrapper>

            {/* Campo Sugerencia */}
            <FieldWrapper>
                <TextField
                    id="sugerencia"
                    name="sugerencia"
                    label="Sugerencia"
                    multiline
                    rows={4}
                    value={formik.values.sugerencia}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={submitted && formik.errors.sugerencia}
                    helperText={submitted && formik.errors.sugerencia}
                    fullWidth
                    variant="outlined"
                />
            </FieldWrapper>

            {/* Botón Enviar */}
            <ButtonWrapper>
                <Button color="primary" variant="contained" type="submit">
                    Enviar
                </Button>
            </ButtonWrapper>
        </form>
    );
};

export default CamposRegistro;
