import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme state
  const [darkMode, setDarkMode] = useState(false);

  // Function to check if it's night time (between 7PM and 7AM)
  const isNightTime = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 19 || currentHour < 7;
  };

  // Function to toggle dark mode manually
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
    // Save preference to localStorage
    localStorage.setItem('prefersDarkMode', (!darkMode).toString());
  };

  // Effect to set initial theme and handle automatic switching
  useEffect(() => {
    // Check if user has a saved preference
    const savedPreference = localStorage.getItem('prefersDarkMode');
    
    if (savedPreference !== null) {
      // Use saved preference if available
      setDarkMode(savedPreference === 'true');
    } else {
      // Otherwise use time-based automatic switching
      setDarkMode(isNightTime());
    }

    // Set up interval to check time and update theme
    const intervalId = setInterval(() => {
      // Only update automatically if no user preference is saved
      if (localStorage.getItem('prefersDarkMode') === null) {
        setDarkMode(isNightTime());
      }
    }, 60000); // Check every minute

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Apply dark mode class to body when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Context value
  const themeContextValue = {
    darkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeProvider;
