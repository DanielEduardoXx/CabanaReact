import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Paper, TextField, Button, MenuItem, FormControl, Select, InputLabel, Typography, Modal, Fade, Alert, Stack
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { MyContext } from "../../../services/MyContext";
import { ventasUser, detVentasUser } from '../../../services/ventasUser';
import AlertDesconectado from './AlertDesconectado';

const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
}));

const ModalContent = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.background.paper,
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
        user_id: null,
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

            const newTotal = storedCart.reduce((acc, item) => {
                // Si el producto tiene una promoción
                if (item.producto.detpromociones && item.producto.detpromociones.length > 0) {
                    // Sumar los subtotales de las promociones
                    const totalPromocion = item.producto.detpromociones.reduce((subAcc, promo) => {
                        return subAcc + parseFloat(promo.subtotal);
                    }, 0);
                    return acc + totalPromocion;
                }

                // Si es un producto regular
                const precioProducto = item.producto.precio_producto ? parseFloat(item.producto.precio_producto) : 0;
                const cantidad = item.cantidad ? parseInt(item.cantidad, 10) : 0;
                return acc + (precioProducto * cantidad);
            }, 0);

            setTotal(newTotal);  // Asigna el nuevo total

            // Verifica si el carrito contiene promociones
            let descuentoTotal = 0;
            let porcentajeTotal = 0;
            let promocioneId = null;

            storedCart.forEach(item => {
                if (item.producto.detpromociones && item.producto.detpromociones.length > 0) {
                    const promo = item.producto.detpromociones[0];  // Esto podría necesitar ajustes si hay múltiples promociones
                    descuentoTotal += parseFloat(promo.descuento);
                    porcentajeTotal += parseFloat(promo.porcentaje);  // Corrige aquí para usar porcentaje en lugar de descuento
                    promocioneId = promo.promocione_id;  // Esto podría necesitar ajustes si hay múltiples promociones
                }
            });

            setFormData(prevData => ({
                ...prevData,
                total: newTotal,
                user_id: user.user.id,
                address_ventas: address,
                descuento: descuentoTotal > 0 ? descuentoTotal : null,
                porcentaje: porcentajeTotal > 0 ? porcentajeTotal : null,
                promocione_id: promocioneId,
            }));
        }
    }, [user, address]);


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
            setError('El método de Pago y Tipo de Entrega son obligatorios');
            return;
        }

        if (formData.tipo_de_entrega === 'entrega_en_domicilio' && !formData.address_ventas) {
            setError('La dirección de entrega es obligatoria');
            return;
        }

        if (formData.tipo_de_entrega === 'recoger_en_sucursal') {
            formData.address_ventas = null;
        }

        try {
            // Enviar la venta principal
            const ventaData = { ...formData, user_id: user.user.id };
            const ventaResponse = await ventasUser(ventaData);

            if (ventaResponse && ventaResponse.data) {
                const ventaId = ventaResponse.data.id;  // Obtén el ID de la venta
                setVentaId(ventaId);  // Actualiza el estado del ID de la venta

                // Guardar el ID de la venta en localStorage
                const key = `venta_${user.user.id}`;
                const storedVentas = JSON.parse(localStorage.getItem(key)) || [];
                const updatedVentas = [...storedVentas, ventaId];
                localStorage.setItem(key, JSON.stringify(updatedVentas));

                // Preparar los detalles de la venta
                const detVentaData = {
                    detalles: compra.flatMap(item => {
                        if (item.producto.detpromociones && item.producto.detpromociones.length > 0) {
                            // Si el producto tiene promociones
                            return item.producto.detpromociones.map(promo => ({
                                nom_producto: promo.producto.nom_producto,
                                pre_producto: promo.producto.precio_producto,
                                cantidad: promo.cantidad,
                                subtotal: promo.subtotal,
                                descuento: promo.descuento,
                                porcentaje: promo.porcentaje || 18,
                                promocione_id: promo.promocione_id,
                                venta_id: ventaId
                            }));
                        } else {
                            // Si es un producto normal
                            const nomProducto = item.producto.nom_producto || '';
                            const preProducto = item.producto.precio_producto || 0;
                            const cantidad = parseInt(item.cantidad, 10);
                            const subtotal = parseFloat(preProducto) * cantidad;

                            return [{
                                nom_producto: nomProducto,
                                pre_producto: preProducto,
                                cantidad: cantidad,
                                subtotal: subtotal,
                                venta_id: ventaId
                            }];
                        }
                    }),
                    total: total // Total de la venta
                };

                // Validar los datos de los detalles
                if (detVentaData.detalles.some(detalle => !detalle.nom_producto || isNaN(detalle.pre_producto) || isNaN(detalle.cantidad) || isNaN(detalle.subtotal))) {
                    throw new Error('Datos inválidos en los detalles de la venta');
                }

                // Enviar los detalles de la venta
                console.log('Datos enviados:', detVentaData);
                await detVentasUser(detVentaData);  // Llama a la API de detalles de ventas

                // Actualizar localStorage y limpiar el carrito
                const cartKey = `cart_${user.user.id}`;
                const comprasKey = `compras_${user.user.id}`;
                const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
                const storedCompras = JSON.parse(localStorage.getItem(comprasKey)) || [];

                // Agregar el ventaId a cada compra antes de almacenarla
                const updatedCompras = storedCart.map(item => ({
                    ...item,
                    venta_id: ventaId  // Añadir el ID de la venta al objeto de la compra
                }));

                // Combinar las compras actuales con las nuevas
                const finalCompras = [...storedCompras, ...updatedCompras];
                localStorage.setItem(comprasKey, JSON.stringify(finalCompras));

                // Limpiar el carrito y el localStorage
                localStorage.removeItem(cartKey);
                localStorage.removeItem(`cantidades_${user.user.id}`);

                // Limpiar estado
                setCompra([]);
                setTotal(0);
                setOpen(true);  // Abre el modal de confirmación
            }
        } catch (error) {
            console.error('Error al enviar los detalles de la venta:', error.message);
        }
    };

    if (!user) {
        return <AlertDesconectado />;
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
            <Paper sx={{ padding: '2rem', width: '100%', maxWidth: '800px' }}>
                <StyledForm onSubmit={handleSubmit}>
                    <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
                        Información de la Compra
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <TextField
                            disabled
                            label="Nombres"
                            variant="outlined"
                            defaultValue={user ? user.user.name : ''}
                        />
                        <TextField
                            disabled
                            label="Teléfono"
                            type="number"
                            variant="outlined"
                            defaultValue={user ? user.user.tel : ''}
                        />
                        <TextField
                            label="Dirección"
                            type="text"
                            variant="outlined"
                            onChange={handleChangeDireccion}
                            disabled={!isDireccionEnabled}
                            value={formData.address_ventas || ''}
                        />
                        <TextField
                            disabled
                            label="Identificación"
                            type="number"
                            variant="outlined"
                            defaultValue={user ? user.user.id : ''}
                        />
                        <FormControl fullWidth>
                            <InputLabel>Método de Pago</InputLabel>
                            <Select
                                label="Método de Pago"
                                value={formData.metodo_pago}
                                onChange={handleChangeMetodoPago}
                            >
                                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                                <MenuItem value="efectivo">Efectivo</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
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
                    <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '2rem' }}>
                        Finalizar Compra
                    </Button>
                </StyledForm>

                {error && (
                    <Stack sx={{ width: '100%', marginTop: '1rem' }} spacing={2}>
                        <Alert severity="error">{error}</Alert>
                    </Stack>
                )}
            </Paper>

            <Paper sx={{ padding: '2rem', width: '100%', maxWidth: '800px', marginTop: '2rem' }}>
                <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                    Productos en el Carrito
                </Typography>
                {compra.length > 0 ? (
                    <>
                        {compra.map((item, index) => {
                            // Define los precios con valores predeterminados si no están disponibles
                            const precioProducto = item.producto.precio_producto ? parseFloat(item.producto.precio_producto) : 0;
                            const precioPromo = item.producto.total_promo ? parseFloat(item.producto.total_promo) : 0;

                            // Usa el precio de la promoción si está disponible, de lo contrario usa el precio del producto
                            const precio = precioPromo > 0 ? precioPromo : precioProducto;

                            // Calcula el subtotal
                            const subtotal = precio * (item.cantidad ? parseInt(item.cantidad, 10) : 0);

                            return (
                                <Paper key={index} sx={{ padding: '1rem', margin: '0.5rem 0' }}>
                                    <Typography>
                                        {item.producto.nom_producto || item.producto.nom_promo} - {item.cantidad} x ${precio.toFixed(2)}
                                    </Typography>
                                    <Typography>
                                        Subtotal: ${subtotal.toFixed(2)}
                                    </Typography>
                                </Paper>
                            );
                        })}
                        <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                            Total: ${!isNaN(total) ? total.toFixed(2) : '0.00'}
                        </Typography>
                    </>
                ) : (
                    <Typography>No hay productos en el carrito.</Typography>
                )}
            </Paper>

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <ModalContent>
                        <Typography variant="h6" gutterBottom>
                            Compra Realizada con Éxito
                        </Typography>
                        <Typography variant="body1">
                            ¡Gracias por tu compra! Recuerda que en tu Perfil podras decargar el Comprobante.
                        </Typography>
                        <Button onClick={handleClose} variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
                            Cerrar
                        </Button>
                    </ModalContent>
                </Fade>
            </Modal>
        </Box>
    );
}

export default CardCheckout;

