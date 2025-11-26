import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeToggle = ({ className = '', size = 'md' }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  
  console.log('DarkModeToggle render - isDarkMode:', isDarkMode);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Button clicked!');
        toggleDarkMode();
      }}
      style={{
        width: size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px',
        height: size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px',
        borderRadius: '50%',
        backgroundColor: isDarkMode ? '#e5e7eb' : '#374151',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = isDarkMode ? '#d1d5db' : '#4b5563';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = isDarkMode ? '#e5e7eb' : '#374151';
      }}
      className={className}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <FiSun className={`${iconSizes[size]}`} style={{ color: '#f59e0b' }} />
      ) : (
        <FiMoon className={`${iconSizes[size]}`} style={{ color: '#9ca3af' }} />
      )}
    </button>
  );
};

export default DarkModeToggle; 