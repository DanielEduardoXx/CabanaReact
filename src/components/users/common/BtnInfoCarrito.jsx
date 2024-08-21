import React, { useState, useContext, useEffect } from 'react';
import { Button, Box, Modal, Typography, Fade, Paper } from "@mui/material";
import { styled } from '@mui/material/styles';
import { MyContext } from '../../../services/MyContext'; // Asegúrate de importar el contexto
import { deleteVentaUser } from '../../../services/ventasUser';

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

function BtnCarrito() {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false); // Estado para el modal de confirmación
    const { user } = useContext(MyContext);
    const [compra, setCompra] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (user && user.user.id) {
            const cartKey = `compras_${user.user.id}`;
            const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
            setCompra(storedCart);

            const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio_producto * item.cantidad, 0);
            setTotal(newTotal);
        } else {
            setCompra([]);
            setTotal(0);
        }
    }, [user]);

    useEffect(() => {
        const handleStorageChange = () => {
            if (user && user.user.id) {
                const cartKey = `compras_${user.user.id}`;
                const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
                setCompra(storedCart);

                const newTotal = storedCart.reduce((acc, item) => acc + item.producto.precio_producto * item.cantidad, 0);
                setTotal(newTotal);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [user]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Función para manejar la confirmación de la cancelación
    const handleConfirmCancel = () => {
        setConfirmOpen(true);
    };

    // Función para manejar la eliminación de una compra
    const handleEliminarCompra = async () => {
        setConfirmOpen(false); // Cerrar el modal de confirmación

        // Leer el ID de venta desde localStorage
        const ventaId = JSON.parse(localStorage.getItem(`venta_${user.user.id}`));
        console.log(`venta_${user.user.id}`)
        if (!ventaId) {
            console.error('ID de venta no disponible');
            return;
        }

        try {
            await deleteVentaUser(ventaId);

            // Eliminar la compra del localStorage y actualizar el estado
            const cartKey = `compras_${user.user.id}`;
            localStorage.removeItem(cartKey);
            localStorage.removeItem(`venta_${user.user.id}`);

            setCompra([]);
            setTotal(0);
            handleClose();
        } catch (error) {
            console.error('Error al eliminar la compra:', error.message);
        }
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: 1000 }}>
            {user && compra.length > 0 && ( // Mostrar el botón solo si hay productos en el carrito y el usuario está autenticado
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

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <Button onClick={handleConfirmCancel} variant="contained" color="error" fullWidth>
                                        Cancelar Pedido
                                    </Button>
                                    <Button onClick={handleClose} variant="contained" color="success" fullWidth>
                                        OK!
                                    </Button>
                                </Box>
                            </ModalContent>
                        </Fade>
                    </Modal>

                    {/* Modal de confirmación de cancelación */}
                    <Modal
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        aria-labelledby="confirm-cancel-title"
                        aria-describedby="confirm-cancel-description"
                    >
                        <Fade in={confirmOpen}>
                            <ModalContent>
                                <Typography variant="h6" align="center">
                                    ¿Estás seguro de que deseas cancelar el pedido?
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                    <Button onClick={handleEliminarCompra} variant="contained" color="error" fullWidth>
                                        Cancelar Pedido
                                    </Button>
                                    <Button onClick={() => setConfirmOpen(false)} variant="contained" color="success" fullWidth>
                                        No, Continuar
                                    </Button>
                                </Box>
                            </ModalContent>
                        </Fade>
                    </Modal>
                </>
            )}
        </Box>
    );
}

export default BtnCarrito;