import React, { useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaPlay, FaCheck } from 'react-icons/fa';
import PreviewModal from './PreviewModal';

const ContentSelection = ({ userContent, selectedContent, setSelectedContent }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

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

  const toggleContentSelection = (id) => {
    setSelectedContent(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div 
      className="md:col-span-2 space-y-4"
      style={darkModeStyles}
    >
      <h2 
        className="text-xl font-semibold flex items-center gap-2 mb-4"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <FaMusic style={{ color: 'var(--color-primary)' }} /> 
        Your Uploads
      </h2>
      
      {userContent.map(item => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.01 }}
          className={`rounded-xl shadow-sm overflow-hidden border transition-colors ${
            selectedContent.includes(item.id) 
              ? 'ring-1' 
              : ''
          }`}
          style={{ 
            backgroundColor: 'var(--color-bg-secondary)',
            borderColor: selectedContent.includes(item.id)
              ? 'var(--color-primary)'
              : 'var(--color-border)'
          }}
        >
          <div className="flex">
            <div 
              className="w-24 h-24 relative cursor-pointer"
              style={{ backgroundColor: 'var(--color-bg-primary)' }}
              onClick={() => {
                setCurrentItem(item);
                setShowLockedModal(true);
              }}
            >
              <img 
                src={item.coverImage} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              >
                <FaPlay className="text-white text-lg" />
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex justify-between">
                <div>
                  <h3 
                    className="font-medium"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-sm capitalize"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {item.type === 'beat' ? 'Beat' : 'Track'} • {item.duration}
                  </p>
                </div>
                <button
                  onClick={() => toggleContentSelection(item.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    selectedContent.includes(item.id)
                      ? 'text-white'
                      : 'border-2'
                  }`}
                  style={{
                    backgroundColor: selectedContent.includes(item.id)
                      ? 'var(--color-primary)'
                      : 'transparent',
                    borderColor: selectedContent.includes(item.id)
                      ? 'var(--color-primary)'
                      : 'var(--color-text-secondary)'
                  }}
                >
                  {selectedContent.includes(item.id) && <FaCheck className="text-xs" />}
                </button>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <span 
                  className="text-sm"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {item.plays?.toLocaleString() || '0'} plays
                </span>
                <span 
                  className="font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  ₦{item.price?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Preview Modal */}
      {showLockedModal && currentItem && (
        <PreviewModal 
          item={currentItem}
          selectedContent={selectedContent}
          toggleContentSelection={toggleContentSelection}
          onClose={() => setShowLockedModal(false)}
        />
      )}
    </div>
  );
};

export default ContentSelection;