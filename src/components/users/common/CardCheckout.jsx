import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, TextField, Button, MenuItem, FormControl, Select, InputLabel, Typography, Modal, Fade } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../../services/MyContext";
import { ventasUser, detVentasUser } from '../../../services/ventasUser';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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
        address_ventas: '',
        tipo_de_entrega: '',
        estado: 1,
        total: 0,
        user_id: null
    });
    const [compra, setCompra] = useState([]);
    const [total, setTotal] = useState(0);
    const [open, setOpen] = useState(false);
    const [ventaId, setVentaId] = useState(null);
    const [address, setAddress] = useState(null);
    const [error, setError] = useState(null);
    const [isDireccionEnabled, setIsDireccionEnabled] = useState(false);

    const { user } = useContext(MyContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const storedCart = JSON.parse(localStorage.getItem(`cart_${user.user.id}`)) || [];
            setCompra(storedCart);

            const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio_producto * item.cantidad, 0);
            setTotal(newTotal);

            setFormData(prevData => ({
                ...prevData,
                total: newTotal,
                user_id: user.user.id,
                address_ventas: address
            }));
        }
    }, [user]);

    useEffect(() => {
        if (user && user.user.direccion) {
            setAddress(user.user.direccion);
        }
    }, [user]);

    useEffect(() => {
        if (user && compra.length > 0) {
            localStorage.setItem(`cart_${user.user.id}`, JSON.stringify(compra));
        }
    }, [compra, user]);

    const handleChangeMetodoPago = (event) => {
        setFormData(prevData => ({ ...prevData, metodo_pago: event.target.value }));
    };

    const handleChangeTipoDeEntrega = (event) => {
        const value = event.target.value;
        setFormData(prevData => ({ ...prevData, tipo_de_entrega: value }));
        setIsDireccionEnabled(value === 'entrega_en_domicilio');
    };

    const handleChangeDireccion = (event) => {
        const { value } = event.target;
    
        setFormData(prevData => ({
            ...prevData,
            address_ventas: formData.tipo_de_entrega === 'recoger_en_sucursal' ? null : value
        }));
    };

    const handleClose = () => {
        setOpen(false);
        navigate('/inicio');
        window.location.reload();
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validación de campos
        if (!formData.metodo_pago || !formData.tipo_de_entrega) {
            setError('El metodo de Pago y Tipo de Entrega Son Obligatorios')
            console.error('El campo metodo_pago y tipo_de_entrega son obligatorios.');
            return;
        }

        if (formData.tipo_de_entrega === 'entrega_en_domicilio' && !formData.address_ventas) {
            setError('La dirección de entrega es obligatoria')

            console.error('La dirección es obligatoria para la entrega en domicilio.');
            return;
        }

        if (formData.tipo_de_entrega === 'recoger_en_sucursal') {
            formData.address_ventas = null; // Asignar null si es recoger en sucursal
        }

        // Aquí puedes manejar el envío de los datos
        console.log('Datos del formulario:', formData);

        if (!formData.total || !formData.user_id) {
            console.error('Todos los campos son obligatorios.');
            return;
        }

        try {
            // Paso 1: Enviar datos de la venta
            const ventaData = { ...formData, user_id: user.user.id };
            const ventaResponse = await ventasUser(ventaData);

            if (ventaResponse && ventaResponse.data) {
                const ventaId = ventaResponse.data.id;
                setVentaId(ventaId);

                // Guardar ID de venta en localStorage
                const key = `venta_${user.user.id}`;
                const storedVentas = JSON.parse(localStorage.getItem(key)) || [];
                const updatedVentas = [...storedVentas, ventaId];
                localStorage.setItem(key, JSON.stringify(updatedVentas));

                // Paso 2: Enviar detalles de la venta
                const detVentaData = {
                    detalles: compra.map(item => ({
                        nom_producto: item.producto.nom_producto,
                        pre_producto: item.producto.precio_producto,
                        cantidad: item.cantidad,
                        subtotal: item.producto.precio_producto * item.cantidad,
                        venta_id: ventaId
                    })),
                    total: total
                };
                await detVentasUser(detVentaData);

                // Actualizar carrito y almacenar compras
                const cartKey = `cart_${user.user.id}`;
                const comprasKey = `compras_${user.user.id}`;
                const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
                const storedCompras = JSON.parse(localStorage.getItem(comprasKey)) || [];
                const updatedCompras = [...storedCompras, ...storedCart];
                localStorage.setItem(comprasKey, JSON.stringify(updatedCompras));

                // Eliminar el carrito actual
                localStorage.removeItem(cartKey);
                localStorage.removeItem(`cantidades_${user.user.id}`);

                setCompra([]);
                setTotal(0);
                setOpen(true);  // Abrir el modal
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
                        <Box sx = {{ display: 'flex'}}>
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
                                    onChange={handleChangeDireccion}
                                    disabled={!isDireccionEnabled}
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
                                    <InputLabel>Metodo de Pago</InputLabel>
                                    <Select
                                        label="Metodo de Pago"
                                        value={formData.metodo_pago}
                                        onChange={handleChangeMetodoPago}
                                    >
                                        <MenuItem value="tarjeta">Tarjeta</MenuItem>
                                        <MenuItem value="efectivo">Efectivo</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth sx={{ margin: '5px 0' }}>
                                    <InputLabel>Tipo de Entrega</InputLabel>
                                    <Select
                                        label="Tipo de Entrega"
                                        value={formData.tipo_de_entrega}
                                        onChange={handleChangeTipoDeEntrega}
                                    >
                                        <MenuItem value="recoger_en_sucursal">Recoger en Sucursal</MenuItem>
                                        <MenuItem value="entrega_en_domicilio">Entrega en Domicilio</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx = {{display:'flex', flexDirection:'column'}}>
                                <Typography variant="h6" sx={{
                                    fontWeight: 'bold', marginBottom: '0.5rem',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}> Productos:</Typography>
                                {compra.length > 0 ? (
                                    <>
                                        {compra.map((item) => (
                                            <Paper key={item.id} sx={{ padding: '1rem', margin: '1rem 0' }}>
                                                <Typography>
                                                    {item.producto.nom_producto} - {item.cantidad} x ${item.producto.precio_producto}
                                                </Typography>
                                            </Paper>
                                        ))}
                                        <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                                            Valor Total: $ {total.toLocaleString('en-US')}
                                        </Typography>
                                    </>
                                ) : (
                                    <Typography variant="body1" align="center">
                                        El carrito está vacío.
                                    </Typography>
                                )}
                            </Box>



               
                        </Box>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" sx={{ margin: '10px 0' }}>
                                Finalizar Compra
                            </Button>
                </StyledForm>

                {error && (

                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="error">{error}</Alert>
                    </Stack>

                )}
            </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropProps={{ timeout: 500 }}
            >
                <Fade in={open}>
                    <ModalContent>
                        <Typography variant="h6" gutterBottom>
                            ¡Compra realizada con éxito!
                        </Typography>
                        <Typography variant="body1">
                            Tu ID de venta es: {ventaId}
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleClose} sx={{ marginTop: '1rem' }}>
                            Volver al Inicio
                        </Button>
                    </ModalContent>
                </Fade>
            </Modal>
        </Box>
    );
}

export default CardCheckout;