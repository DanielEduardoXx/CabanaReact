import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Fade, Typography, Button, Box } from "@mui/material";

export const MyContext = createContext({
  user: null,
  setUser: () => {},
});

const INACTIVITY_TIMEOUT = 1000000; // 1 minuto de inactividad

export const MyProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleActivity = () => {
      resetInactivityTimer();
    };



    const resetInactivityTimer = () => {
      clearTimeout(window.inactivityTimer);
      window.inactivityTimer = setTimeout(() => {
        if (user) {
          // Mostrar modal primero
          setOpen(true);
        }
      }, INACTIVITY_TIMEOUT);
    };

    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      resetInactivityTimer();
    } else {
      sessionStorage.removeItem("user");
      setOpen(false); // Cierra el modal si no hay usuario
    };


    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);

    return () => {
      clearTimeout(window.inactivityTimer);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
    };
  }, [user]);

  const handleClose = () => {
    setOpen(false);
    setUser(null); // Limpiar datos del usuario después de la inactividad
    navigate("/iniciar-sesion"); // Redirige al login
  };

  return (
    <MyContext.Provider value={{ user, setUser }}>
      {children}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={open}>
          <Box
            sx={{
              width: 300,
              bgcolor: "background.paper",
              p: 3,
              borderRadius: 1,
              margin: "auto",
              mt: "20vh",
              textAlign: "center",
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" id="modal-modal-title">
              Tu sesión ha caducado
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Tu sesión ha caducado debido a inactividad. Por favor, inicia
              sesión nuevamente.
            </Typography>
            <Button
              onClick={handleClose}
              variant="contained"
              color="primary"
              sx={{ marginTop: "1rem" }}
            >
              Ir al Login
            </Button>
          </Box>
        </Fade>
      </Modal>
    </MyContext.Provider>
  );
};
