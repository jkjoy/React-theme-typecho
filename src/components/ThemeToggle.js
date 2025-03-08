import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button 
      className="theme-toggle-button" 
      onClick={toggleDarkMode}
      aria-label={darkMode ? "切换到亮色模式" : "切换到暗色模式"}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;
