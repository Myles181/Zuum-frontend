import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    console.log('Initial dark mode check - localStorage:', saved);
    
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      console.log('Using saved preference:', parsed);
      return parsed;
    }
    
    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('Using system preference:', systemPrefersDark);
    return systemPrefersDark;
  });

  const toggleDarkMode = () => {
    console.log('Toggle clicked, current state:', isDarkMode);
    setIsDarkMode(prev => {
      const newState = !prev;
      console.log('New state will be:', newState);
      return newState;
    });
  };

  const setDarkMode = (dark) => {
    setIsDarkMode(dark);
  };

  // Save to localStorage whenever dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      console.log('Dark mode enabled');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      console.log('Dark mode disabled');
    }
  }, [isDarkMode]);

  // Set initial dark mode class on mount
  useEffect(() => {
    console.log('Setting initial dark mode class, isDarkMode:', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
}; 