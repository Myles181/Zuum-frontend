import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlay, FaLock } from 'react-icons/fa';

const PreviewModal = ({ item, selectedContent, toggleContentSelection, onClose }) => {
  // Dark mode styles - consistent with other components
  const darkModeStyles = {
    '--color-bg-primary': '#1a1a1a',
    '--color-bg-secondary': '#2d2d2d',
    '--color-text-primary': '#ffffff',
    '--color-text-secondary': '#9ca3af',
    '--color-primary': '#2D8C72',
    '--color-primary-light': '#34A085',
    '--color-text-on-primary': '#ffffff',
    '--color-border': '#374151'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      style={darkModeStyles}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="rounded-xl max-w-md w-full overflow-hidden"
        style={{ 
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img 
            src={item.coverImage} 
            alt={item.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-6">
            <div className="flex justify-end">
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <p className="text-white/80 capitalize">{item.type === 'beat' ? 'Beat' : 'Track'} • {item.duration}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaLock style={{ color: 'var(--color-primary)' }} />
              <span 
                className="font-medium"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Preview Only
              </span>
            </div>
            <span 
              className="text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {item.plays?.toLocaleString() || '0'} plays
            </span>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="px-8 py-3 rounded-full flex items-center gap-2 transition-colors"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-text-on-primary)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary-light)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
              }}
            >
              <FaPlay /> Play 30s Preview
            </button>
          </div>
          
          <div 
            className="mt-6 pt-4"
            style={{ 
              borderTop: '1px solid var(--color-border)'
            }}
          >
            <h3 
              className="font-medium mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Promotion Options
            </h3>
            <p 
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Promote this {item.type} to get more visibility and plays.
            </p>
            <button 
              onClick={() => {
                toggleContentSelection(item.id);
                onClose();
              }}
              className={`w-full py-2 rounded-lg transition-colors ${
                selectedContent.includes(item.id)
                  ? 'text-gray-700'
                  : 'text-white'
              }`}
              style={{
                backgroundColor: selectedContent.includes(item.id)
                  ? 'var(--color-bg-primary)'
                  : 'var(--color-primary)'
              }}
              onMouseEnter={(e) => {
                if (!selectedContent.includes(item.id)) {
                  e.target.style.backgroundColor = 'var(--color-primary-light)';
                } else {
                  e.target.style.backgroundColor = 'var(--color-border)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedContent.includes(item.id)) {
                  e.target.style.backgroundColor = 'var(--color-primary)';
                } else {
                  e.target.style.backgroundColor = 'var(--color-bg-primary)';
                }
              }}
            >
              {selectedContent.includes(item.id) ? 'Selected ✓' : 'Select for Promotion'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PreviewModal;