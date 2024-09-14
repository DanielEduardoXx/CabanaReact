import React, { useState, useContext, useEffect } from 'react';
import { Button, Box, Modal, Typography, Fade, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { styled } from '@mui/material/styles';
import { MyContext } from '../../../services/MyContext';
import { deleteVentaUser } from '../../../services/ventasUser';
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
    const { user } = useContext(MyContext);
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

            const newTotal = storedCompras.reduce(
                (acc, compra) => acc + compra.producto.precio_producto  || compra.producto.total_promo  * compra.cantidad,
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

    const handleConfirmOpen = (ventaId) => {
        setVentaToDelete(ventaId);
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

                // Filtrar la compra eliminada del array de compras
                const updatedCompras = compras.filter((compra, index) => ventaIds[index] !== ventaToDelete);

                // Actualizar el localStorage
                const comprasKey = `compras_${user.user.id}`;
                localStorage.setItem(comprasKey, JSON.stringify(updatedCompras));

                // Eliminar el ID de la venta de la lista de IDs en el localStorage
                const updatedVentaIds = ventaIds.filter(id => id !== ventaToDelete);
                const ventaKey = `venta_${user.user.id}`;
                localStorage.setItem(ventaKey, JSON.stringify(updatedVentaIds));

                // Actualizar el estado local
                setCompras(updatedCompras);
                setVentaIds(updatedVentaIds);

                // Recalcular el total
                const newTotal = updatedCompras.reduce(
                    (acc, compra) => acc + compra.producto.precio_producto * compra.cantidad,
                    0
                );
                setTotal(newTotal);
            } catch (error) {
                console.error('Error al eliminar la compra:', error.message);
            } finally {
                handleConfirmClose();
            }
        }
    };

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
                                        {compras.map((compra, index) => (
                                            <Paper key={index} sx={{ padding: '1rem', margin: '1rem 0', position: 'relative' }}>
                                                <Typography>
                                                    {compra.producto.nom_producto || compra.producto.nom_promo} - {compra.cantidad} x ${compra.producto.precio_producto || compra.producto.total_promo}
                                                </Typography>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => handleConfirmOpen(ventaIds[index])}
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
