import React from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useDarkMode } from '../contexts/DarkModeContext';

const DarkModeSettings = () => {
  const { isDarkMode, setDarkMode } = useDarkMode();

  const options = [
    {
      id: 'light',
      label: 'Light Mode',
      icon: FiSun,
      description: 'Use light theme',
      active: !isDarkMode
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      icon: FiMoon,
      description: 'Use dark theme',
      active: isDarkMode
    },
    {
      id: 'system',
      label: 'System Default',
      icon: FiMonitor,
      description: 'Follow system preference',
      active: localStorage.getItem('darkMode') === null
    }
  ];

  const handleOptionSelect = (optionId) => {
    if (optionId === 'system') {
      localStorage.removeItem('darkMode');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    } else {
      setDarkMode(optionId === 'dark');
    }
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-sm"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)'
      }}
    >
      <h3 
        className="text-lg font-semibold mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Appearance
      </h3>
      
      <div className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              className={`w-full p-4 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
                option.active
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                option.active
                  ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 text-left">
                <div className={`font-medium ${
                  option.active
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {option.label}
                </div>
                <div className={`text-sm ${
                  option.active
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {option.description}
                </div>
              </div>
              
              {option.active && (
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Your preference will be saved and applied across all pages. 
          The system default option will automatically switch between light and dark mode based on your device settings.
        </p>
      </div>
    </div>
  );
};

export default DarkModeSettings; 