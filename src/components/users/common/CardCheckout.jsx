import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, TextField, Button, MenuItem, FormControl, Select, InputLabel, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
// import CardDetalleCarrito from "./CardDetalleCarrito";
import CardResumenCarrito from './CardResumenCarrito';
import { MyContext } from "../../../services/MyContext";
import { ventasUser } from '../../../services/ventasUser';

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {
        width: '100%',
    },
}));

function CardCheckout() {
    const [formData, setFormData] = useState({
        metodo_pago: '',
        estado: 1,
        total: 0,
        user_id: null
    });
    const [compra, setCompra] = useState([]);
    const [total, setTotal] = useState(0);

    const { user } = useContext(MyContext);

    useEffect(() => {
        if (user) {
            const storedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
            setCompra(storedCart);

            const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
            setTotal(newTotal);

            setFormData((prevData) => ({
                ...prevData,
                total: newTotal,
                user_id: user.id
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(`cart_${user.id}`, JSON.stringify(compra));
        }
    }, [compra, user]);

    const handleChangeMetodoPago = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            metodo_pago: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validar que metodo_pago no esté vacío
        if (!formData.metodo_pago) {
            console.error('El campo metodo_pago es obligatorio.');
            return;
        }
        
        // Verificar que los campos obligatorios no estén vacíos
        if (!formData.total || !formData.user_id) {
            console.error('Todos los campos son obligatorios.');
            return;
        }

        try {
            const ventaData = {
                ...formData,
                total: total,
                user_id: user.id
            };

            // Imprimir los datos que se van a enviar para depuración
            console.log('Datos enviados a la API:', ventaData);

            const response = await ventasUser(ventaData);
            console.log('Respuesta de la API:', response);
            // Puedes agregar lógica adicional aquí después de enviar los datos, como redirigir o mostrar un mensaje
        } catch (error) {
            console.error('Error al enviar la venta:', error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <Paper sx={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
                <StyledForm onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box>
                            <TextField
                                disabled
                                sx={{ margin: '5px 0', width: '100%' }}
                                label="Nombres"
                                variant="outlined"
                                defaultValue={user ? user.name : ''}
                            />
                            <TextField
                                disabled
                                sx={{ margin: '5px 0', width: '100%' }}
                                label="Telefono"
                                type="number"
                                variant="outlined"
                                defaultValue={user ? user.tel : ''}
                            />
                            <TextField
                                sx={{ margin: '5px 0', width: '100%' }}
                                label="Direccion"
                                type="text"
                                variant="outlined"
                                defaultValue={user ? user.direccion : ''}
                            />
                            <TextField
                                disabled
                                sx={{ margin: '5px 0', width: '100%' }}
                                id="id"
                                label="Identificacion"
                                type="number"
                                variant="outlined"
                                defaultValue={user ? user.id : ''}
                            />
                            <FormControl fullWidth sx={{ margin: '5px 0' }}>
                                <InputLabel id="metodo_pago">Metodo de Pago</InputLabel>
                                <Select
                                    labelId="metodo_pago"
                                    id="metodo_pago"
                                    value={formData.metodo_pago}
                                    label="Metodo de Pago"
                                    onChange={handleChangeMetodoPago}
                                >
                                    <MenuItem value={'efectivo'}>Efectivo</MenuItem>
                                    <MenuItem value={'nequi'}>Nequi</MenuItem>
                                    <MenuItem value={'daviplata'}>Daviplata</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            {compra.map((item) => (
                                <CardResumenCarrito
                                    key={item.id}
                                    id={item.id}
                                    titulo={item.producto.nombre}
                                    precio={item.producto.precio}
                                    foto={item.producto.foto || '/Hamburguesas.jpg'}
                                    noProductos={item.cantidad}
                                />
                            ))}
                        </Box>
                    </Box>
                    <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                        Valor Total: $ {total.toLocaleString('en-US')}
                    </Typography>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', marginTop: '1rem' }}>
                        Terminar Compra
                    </Button>
                </StyledForm>
            </Paper>
        </Box>
    );
}

export default CardCheckout;
