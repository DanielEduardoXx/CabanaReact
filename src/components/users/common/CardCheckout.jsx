import { Box } from "@mui/material"
import React, { useState, useEffect, useContext } from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Paper from "@mui/material/Paper";


import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';

import { MyContext } from "../../../services/MyContext";


const StyledForm = styled('form')(({ theme }) => ({
    '& > *': {


    },
}));


function CardCheckout() {


    const { user } = useContext(MyContext);

    if (user) {
        console.log('User connected:', user);
    } else {
        console.log('User disconnected');
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <Box>
                    <Paper>

                        <StyledForm noValidate autoComplete="off"
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}

                            >
                                <TextField
                                    disabled
                                    sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                    id="id"
                                    label="Identificacion"
                                    type="number"
                                    variant="outlined"
                                    defaultValue={user ? user.user.id : ''}

                                />

                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}

                            >
                                <TextField
                                    disabled
                                    sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                    id="id"
                                    label="Nombres"
                                    variant="outlined"
                                    defaultValue={user ? user.name : ''}

                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}

                            >
                                <TextField
                                    disabled
                                    sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                    id="id"
                                    label="Telefono"
                                    type="number"
                                    variant="outlined"
                                    defaultValue={user ? user.tel : ''}

                                />
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}

                            >
                                <TextField
                                    disabled
                                    sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                    id="id"
                                    label="Telefono"
                                    type="number"
                                    variant="outlined"
                                    defaultValue={user ? user.user.tel : ''}

                                />
                            </Box>

                            <FormControl fullWidth>
                                <InputLabel id="genero">Metodo de Pago</InputLabel>
                                <Select
                                    sx={{ margin: '5px 0', width: { xs: '100%' } }}
                                    labelId="metodo_pago"
                                    id="metodo_pago"
                                    // value={user.tipo_doc}
                                    label="metodo_pago"
                                    // onChange={handleTipoDoc}
                                >

                                    <MenuItem value={'efectivo'}>Efectivo</MenuItem>
                                    <MenuItem value={'nequi'}>Nequi</MenuItem>
                                    <MenuItem value={'daviplata'}>Daviplata</MenuItem>
                                </Select>

                                <FormHelperText>{ }</FormHelperText>

                            </FormControl> 

                        </StyledForm>


                    </Paper>

                </Box>

                <Box>
                    <Paper>


                    </Paper>


                </Box>
            </Box>
        </>
    )
}

export default CardCheckout