import React, { useState, useContext, useEffect } from 'react';
import { Button, Box, Modal, Typography, Fade, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { styled } from '@mui/material/styles';
import { MyContext } from '../../../services/MyContext';
import { deleteVentaUser } from '../../../services/ventasUser'; // Asegúrate de que esta función elimine correctamente la venta
import DeleteIcon from '@mui/icons-material/Delete';

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

function BtnCarrito() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [ventaToDelete, setVentaToDelete] = useState(null);
    const { user } = useContext(MyContext); // Asegúrate de que 'user' esté bien proporcionado
    const [compras, setCompras] = useState([]);
    const [ventaIds, setVentaIds] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchCartData = () => {
        if (user && user.user.id) {
            const comprasKey = `compras_${user.user.id}`;
            const ventaKey = `venta_${user.user.id}`;
            
            const storedCompras = JSON.parse(localStorage.getItem(comprasKey)) || [];
            const storedVentaIds = JSON.parse(localStorage.getItem(ventaKey)) || [];

            setCompras(storedCompras);
            setVentaIds(storedVentaIds);

            // Calcula el total sumando los precios de los productos
            const newTotal = storedCompras.reduce(
                (acc, compra) => acc + (compra.producto.precio_producto || compra.producto.total_promo) * compra.cantidad,
                0
            );
            setTotal(newTotal);
        } else {
            setCompras([]);
            setVentaIds([]);
            setTotal(0);
        }
    };

    useEffect(() => {
        fetchCartData();
    }, [user]);

    useEffect(() => {
        const handleStorageChange = fetchCartData;
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [user]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleConfirmOpen = (compraId) => {
        setVentaToDelete(compraId); // Asegúrate de que compraId sea correcto
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        setVentaToDelete(null);
        setConfirmOpen(false);
    };

    const handleEliminarCompra = async () => {
        if (ventaToDelete) {
            try {
                // Eliminar la venta desde el backend
                await deleteVentaUser(ventaToDelete);
    
                // Recuperar compras del localStorage
                const compras = JSON.parse(localStorage.getItem(`compras_${user.user.id}`)) || [];
    
                // Filtrar las compras para eliminar las que tienen el `venta_id` que coincide con `ventaToDelete`
                const updatedCompras = compras.filter(compra => compra.venta_id !== ventaToDelete);
    
                // Actualizar el localStorage con las compras filtradas
                localStorage.setItem(`compras_${user.user.id}`, JSON.stringify(updatedCompras));
    
                // Verifica si el ID de la venta está almacenado en otro lugar del `localStorage`
                const ventas = JSON.parse(localStorage.getItem(`venta_${user.user.id}`)) || [];
                const updatedVentas = ventas.filter(id => id !== ventaToDelete);
    
                // Actualizar el localStorage con las ventas filtradas
                localStorage.setItem(`venta_${user.user.id}`, JSON.stringify(updatedVentas));
    
                // Actualizar el estado local para reflejar los cambios
                setCompras(updatedCompras);
    
                // Recalcular el total después de eliminar la compra
                const newTotal = updatedCompras.reduce((acc, item) => {
                    if (item.producto.detpromociones && item.producto.detpromociones.length > 0) {
                        const totalPromocion = item.producto.detpromociones.reduce((subAcc, promo) => {
                            return subAcc + parseFloat(promo.subtotal || 0);
                        }, 0);
                        return acc + totalPromocion;
                    }
    
                    const precioProducto = parseFloat(item.producto.precio_producto) || 0;
                    const cantidad = parseInt(item.cantidad, 10) || 0;
                    return acc + (precioProducto * cantidad);
                }, 0);
    
                setTotal(newTotal);
    
            } catch (error) {
                console.error('Error al eliminar la compra:', error.message);
            } finally {
                // Cerrar el modal de confirmación
                handleConfirmClose();
            }
        }
    };
    

        // Agrupar las compras por `venta_id`
        const comprasPorVenta = compras.reduce((acumulador, compra) => {
            const { venta_id } = compra;
            if (!acumulador[venta_id]) {
                acumulador[venta_id] = [];
            }
            acumulador[venta_id].push(compra);
            return acumulador;
        }, {});
    
        const ventaIdss = Object.keys(comprasPorVenta);
    
      
    

        return (
            <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1000 }}>
                {user && compras.length > 0 && (
                    <>
                        <Button variant="contained" color="primary" onClick={handleOpen}>
                            Carrito
                        </Button>
    
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Fade in={open}>
                                <ModalContent>
                                    <Typography variant="h6" align="center">
                                        Carrito de Compras
                                    </Typography>
    
                                    {compras.length > 0 ? (
                                        <>
                                            {ventaIds.map((ventaId) => (
                                                <Paper key={ventaId} sx={{ padding: '1rem', margin: '1rem 0', position: 'relative' }}>
                                                    <Typography variant="h6">
                                                        Venta ID: {ventaId}
                                                    </Typography>
    
                                                    {comprasPorVenta[ventaId].map((compra, index) => (
                                                        <Typography key={index}>
                                                            {compra.producto.nom_producto || compra.producto.nom_promo} - {compra.cantidad} x ${compra.producto.precio_producto || compra.producto.total_promo}
                                                        </Typography>
                                                    ))}
    
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleConfirmOpen(ventaId)} // Eliminar por `venta_id`
                                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Paper>
                                            ))}
    
                                            <Typography variant="h6" sx={{ marginTop: '1rem' }}>
                                                Valor Total: ${total.toLocaleString('en-US')}
                                            </Typography>
                                        </>
                                    ) : (
                                        <Typography variant="body1" align="center">
                                            El carrito está vacío.
                                        </Typography>
                                    )}
    
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                        <Button onClick={handleClose} variant="contained" color="success">
                                            OK!
                                        </Button>
                                    </Box>
                                </ModalContent>
                            </Fade>
                        </Modal>
    
                        <Dialog
                            open={confirmOpen}
                            onClose={handleConfirmClose}
                            aria-labelledby="confirm-dialog-title"
                            aria-describedby="confirm-dialog-description"
                        >
                            <DialogTitle id="confirm-dialog-title">¿Eliminar Compra?</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="confirm-dialog-description">
                                    ¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleConfirmClose} color="primary">
                                    Cancelar
                                </Button>
                                <Button onClick={handleEliminarCompra} color="error">
                                    Eliminar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Box>
        );
    }

export default BtnCarrito;
