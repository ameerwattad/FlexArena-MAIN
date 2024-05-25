import React, { createContext, useState } from 'react';

const DarkMode = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkMode.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkMode.Provider>
  );
};

export default DarkMode;
