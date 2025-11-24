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
      localStorage.setItem('darkMode', optionId === 'dark');
      setDarkMode(optionId === 'dark');
    }
  };

  return (
    <div 
      className="p-6 rounded-lg backdrop-blur-lg border"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <h3 
        className="text-lg font-semibold mb-4 text-white"
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
                  ? 'border-green-500 bg-green-500/20 backdrop-blur-sm'
                  : 'border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`p-2 rounded-lg ${
                option.active
                  ? 'bg-green-500/30 text-white'
                  : 'bg-white/10 text-white/80'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 text-left">
                <div className={`font-medium ${
                  option.active ? 'text-white' : 'text-white/90'
                }`}>
                  {option.label}
                </div>
                <div className={`text-sm ${
                  option.active ? 'text-white/80' : 'text-white/70'
                }`}>
                  {option.description}
                </div>
              </div>
              
              {option.active && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
      
      <div 
        className="mt-6 p-4 rounded-lg backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <p className="text-sm text-white/80">
          Your preference will be saved and applied across all pages. 
          The system default option will automatically switch between light and dark mode based on your device settings.
        </p>
      </div>
    </div>
  );
};

export default DarkModeSettings;