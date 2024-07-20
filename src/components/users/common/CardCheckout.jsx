import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, TextField, Button, MenuItem, FormControl, Select, InputLabel, Typography, Modal, Fade } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import CardResumenCarrito from './CardResumenCarrito';
import { MyContext } from "../../../services/MyContext";
import { ventasUser } from '../../../services/ventasUser';
import { detVentasUser } from '../../../services/ventasUser';  // Asegúrate de importar esto

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {
        width: '100%',
    },
}));

const ModalContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'white',
    padding: theme.spacing(4),
    boxShadow: theme.shadows[5],
    borderRadius: theme.shape.borderRadius,
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
    const [open, setOpen] = useState(false);  // Estado para controlar el modal

    const { user } = useContext(MyContext);
    const navigate = useNavigate();  // Hook para redirección

    useEffect(() => {
        if (user) {
            const storedCart = JSON.parse(localStorage.getItem(`cart_${user.user.id}`)) || [];
            setCompra(storedCart);

            const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio_producto * item.cantidad, 0);
            setTotal(newTotal);

            setFormData((prevData) => ({
                ...prevData,
                total: newTotal,
                user_id: user.user.id
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            if (compra.length > 0) {
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

    const handleClose = () => {
        setOpen(false);
        navigate('/inicio');  // Redirige a la ruta deseada
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

            const ventaResponse = await ventasUser(ventaData);

            if (ventaResponse && ventaResponse.data) {
                const ventaId = ventaResponse.data.id;
                const detVentaData = {
                    detalles: compra.map(item => ({
                        nom_producto: item.producto.nom_producto,
                        pre_producto: item.producto.precio_producto,
                        cantidad: item.cantidad,
                        subtotal: item.producto.precio_producto * item.cantidad,
                        venta_id: ventaId
                    }))
                };

                const detResponse = await detVentasUser(detVentaData);

                if (detResponse && detResponse.message === 'Registros creados exitosamente') {
                    localStorage.removeItem(`cart_${user.user.id}`);
                    setCompra([]);
                    setTotal(0);
                    setOpen(true);  // Abrir el modal
                }
            }
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
                                    foto={item.producto.foto || '/path/to/default/image.jpg'}
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

            <Modal
                style={{ zIndex: "20" }} 
                open={open} 
                onClose={handleClose} 
                aria-labelledby="modal-modal-title" 
                aria-describedby="modal-modal-description"
            >
                <Fade in={open}>
                    <ModalContent>
                        <Typography variant="h6" align="center">
                            ¡Compra realizada correctamente!
                        </Typography>
                        <Button onClick={handleClose} variant="contained" color="primary" fullWidth sx={{ marginTop: '1rem' }}>
                            Cerrar
                        </Button>
                    </ModalContent>
                </Fade>
            </Modal>
        </Box>
    );
}

export default CardCheckout;
