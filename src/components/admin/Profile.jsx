import React, { useContext, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Avatar } from '@mui/material';
import { Edit, Email, Phone, Home, Person } from '@mui/icons-material';
import { MyContext } from '../../services/MyContext';
import AdminEditProfile from './AdminEditProfile';
import AdminPanel from './AdminPanel';

export const BASE_URL = "http://localhost/";

const Profile = () => {
    const { user } = useContext(MyContext);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        console.log('Editando perfil...');
        setIsEditing(true);
    };

    const handleClose = () => {
        console.log('Cerrando el editor de perfil...');
        setIsEditing(false);
    };

    const defaultImagePath = "/public/pollo.png";

    const imagePath = user?.user?.images?.path
        ? `${BASE_URL}${user.user.images.path}?t=${new Date().getTime()}`
        : defaultImagePath;

    console.log('Ruta de la imagen del perfil:', imagePath);
    console.log('Datos del usuario:', user);

    return (
        <Box sx={{ padding: '0.5rem', textAlign: 'center' }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: 'auto', mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <Avatar
                        src={imagePath}
                        alt={user?.user?.name || 'usuario'}
                        sx={{ width: 100, height: 100, marginRight: '1rem' }}
                    />
                    <Typography variant="h5" fontWeight="bold">Perfil</Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Person sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>ID:</strong> {user?.user?.id || "N/A"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Email sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Email:</strong> {user?.user?.email || "N/A"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Phone sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Teléfono:</strong> {user?.user?.tel || "N/A"}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Home sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Dirección:</strong> {user?.user?.direccion || "N/A"}</Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ marginTop: '1rem' }}>
                    <Button onClick={handleEdit} color="primary" variant="contained">
                        Editar Perfil <Edit sx={{ marginLeft: 1 }} />
                    </Button>
                </Box>
            </Paper>

            <Box sx={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AdminPanel />
            </Box>

            <AdminEditProfile open={isEditing} handleClose={handleClose} />
        </Box>
    );
};

export default Profile;
