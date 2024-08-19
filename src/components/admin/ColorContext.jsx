import React, { createContext, useState, useContext } from 'react';

const ColorContext = createContext();

export const useColorContext = () => useContext(ColorContext);

export const ColorProvider = ({ children }) => {
  const [colors, setColors] = useState({
    main: '#263491',
    header: '#263491',
    footer: '#263491',
    sidebar: '#263491'
  });

  const updateColors = (newColor) => {
    setColors({
      main: newColor,
      header: newColor,
      footer: newColor,
      sidebar: newColor
    });
  };

  return (
    <ColorContext.Provider value={{ colors, updateColors }}>
      {children}
    </ColorContext.Provider>
  );
};