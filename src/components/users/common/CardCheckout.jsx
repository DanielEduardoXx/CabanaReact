import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, TextField, Button, MenuItem, FormControl, Select, InputLabel, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
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
            const storedCart = JSON.parse(localStorage.getItem(`cart_${user.user.id}`)) || [];
            console.log("Carrito almacenado:", storedCart); // Depuración
            setCompra(storedCart);

            const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio_producto * item.cantidad, 0);
            setTotal(newTotal);

            setFormData((prevData) => ({
                ...prevData,
                total: newTotal,
                user_id: user.user.id
            }));

            console.log("Usuario en el efecto:", user);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            if (compra.length > 0) {
                console.log('Actualizando localStorage con compra:', compra);
                localStorage.setItem(`cart_${user.user.id}`, JSON.stringify(compra));
            }
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

        if (!formData.metodo_pago) {
            console.error('El campo metodo_pago es obligatorio.');
            return;
        }

        if (!formData.total || !formData.user_id) {
            console.error('Todos los campos son obligatorios.');
            return;
        }

        try {
            const ventaData = {
                ...formData,
                total: total,
                user_id: user.user.id
            };

            console.log('Datos enviados a la API:', ventaData);

            const response = await ventasUser(ventaData);
            console.log('Respuesta de la API:', response);

            if (response && response.success) {
                localStorage.removeItem(`cart_${user.user.id}`);
                setCompra([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error al enviar la venta:', error.message);
        }
    };

    const ruta = "../../../../public";

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
                                defaultValue={user ? user.user.name : ''}
                            />
                            <TextField
                                disabled
                                sx={{ margin: '5px 0', width: '100%' }}
                                label="Telefono"
                                type="number"
                                variant="outlined"
                                defaultValue={user ? user.user.tel : ''}
                            />
                            <TextField
                                sx={{ margin: '5px 0', width: '100%' }}
                                label="Direccion"
                                type="text"
                                variant="outlined"
                                defaultValue={user ? user.user.direccion : ''}
                            />
                            <TextField
                                disabled
                                sx={{ margin: '5px 0', width: '100%' }}
                                id="id"
                                label="Identificacion"
                                type="number"
                                variant="outlined"
                                defaultValue={user ? user.user.id : ''}
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
                                    titulo={item.producto.nom_producto}
                                    precio={item.producto.precio_producto}
                                    foto={item.producto.foto || `${ruta}/Hamburguesas.jpg`}
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
