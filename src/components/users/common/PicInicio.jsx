import React from 'react';
import headerImage from '../../../../public/picInicio.jpg'; // Asegúrate de que la ruta sea correcta
import { MyContext } from '../../../services/MyContext';
import { useContext } from "react";

const headerStyle = {
  background: `linear-gradient(to right, rgba(33, 29, 29, 0.887), rgba(33, 29, 29, 0.887)), url(${headerImage})`,
  color: 'white',
  width: '100%',
  height: '20rem',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  fontSize: '5rem',
  fontFamily: "'Kaushan Script', cursive",
  boxShadow: '1px 14px 50px -2px rgba(59, 59, 59, 0.47)',
};


const HeaderComponent = () => {

  const { user, setUser } = useContext(MyContext);
  return (
    
    <div style={headerStyle}>
      {user ? (
        <div>
          <h1>Bienvenido, {user.user.name}</h1>
        </div>
      ) : (
        <div>
          <h1>Bienvenido</h1>
        </div>
      )}
    </div>
  );
};

export default HeaderComponent;