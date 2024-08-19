import React, { useState, useContext } from 'react';
import { Box, Typography, Button, Avatar, Paper, Grid } from '@mui/material';
import { Edit, Email, Phone, Home, Person } from '@mui/icons-material';
import axios from 'axios';
import { MyContext } from '../../services/MyContext';
import ImgRegistro from './ImgRegistro';
import AdminEditProfile from './AdminEditProfile';
import AdminPanel from './AdminPanel';

const Profile = () => {
    const { user, setUser } = useContext(MyContext);
    const [isEditing, setIsEditing] = useState(false);

    const END_POINT = "http://arcaweb.test/api/V1"; 

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleClose = () => {
        setIsEditing(false);
    };

    return (
        <Box sx={{ padding: '0.5rem', textAlign: 'center' }}>
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 400, margin: 'auto', mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
                    <Avatar 
                        src={user.user.avatar || '/default-avatar.png'} 
                        sx={{ width: 100, height: 100, marginRight: '1rem' }} 
                        alt={user.user.name}
                    />
                    <Typography variant="h5" fontWeight="bold">Perfil</Typography>
                </Box>
                
                <ImgRegistro profileData={user.user} setProfileData={setUser} />
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Person sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>ID:</strong> {user?.user?.id}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Email sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Email:</strong> {user.user.email}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Phone sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Teléfono:</strong> {user.user.tel}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <Home sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography variant="body1"><strong>Dirección:</strong> {user.user.direccion}</Typography>
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