import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel } from '@mui/material';
import { DescargarPDF } from '../../../services/descargarPDF';

const TablaInformacion = ({ rows, idKey }) => {
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('created_at');
    const [page, setPage] = useState(0);

    const rowsPerPage = 5; // Número fijo de filas por página

    const handleDownloadPDF = async (id) => {
        try {
            await DescargarPDF(id);
        } catch (error) {
            console.error('Error al descargar el PDF:', error);
        }
    };

    // Función para manejar el cambio de orden
    const handleRequestSort = (property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Función para manejar el cambio de página
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Ordenar los datos
    const sortedRows = [...rows].sort((a, b) => {
        if (order === 'asc') {
            return new Date(a[orderBy]) - new Date(b[orderBy]);
        } else {
            return new Date(b[orderBy]) - new Date(a[orderBy]);
        }
    });

    // Obtener los registros para la página actual
    const paginatedRows = sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Producto</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'created_at'}
                                    direction={orderBy === 'created_at' ? order : 'asc'}
                                    onClick={() => handleRequestSort('created_at')}
                                >
                                    Fecha
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Monto</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedRows.map((row, index) => {
                            console.log('Fila:', row); // Depuración
                            return (
                                <TableRow key={row[idKey] || index}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.producto}</TableCell>
                                    <TableCell>{formatDate(row.created_at)}</TableCell>
                                    <TableCell>{row.total}</TableCell>
                                    <TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleDownloadPDF(row.id)}>
                                                Descargar PDF
                                            </Button>
                                        </TableCell>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
        </Paper>
    );
};

export default TablaInformacion;
