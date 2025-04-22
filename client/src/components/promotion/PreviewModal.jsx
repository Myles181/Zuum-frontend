import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlay, FaLock } from 'react-icons/fa';

const PreviewModal = ({ item, selectedContent, toggleContentSelection, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-xl max-w-md w-full overflow-hidden"
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
                className="text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{item.title}</h2>
              <p className="text-white/80">{item.type === 'beat' ? 'Beat' : 'Track'} • {item.duration}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FaLock className="text-[#2D8C72]" />
              <span className="font-medium">Preview Only</span>
            </div>
            <span className="text-gray-500">{item.plays.toLocaleString()} plays</span>
          </div>
          
          <div className="flex justify-center">
            <button className="bg-[#2D8C72] hover:bg-[#257a63] text-white px-8 py-3 rounded-full flex items-center gap-2">
              <FaPlay /> Play 30s Preview
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="font-medium mb-2">Promotion Options</h3>
            <p className="text-sm text-gray-600 mb-4">
              Promote this {item.type} to get more visibility and plays.
            </p>
            <button 
              onClick={() => {
                toggleContentSelection(item.id);
                onClose();
              }}
              className={`w-full py-2 rounded-lg ${
                selectedContent.includes(item.id)
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-[#2D8C72] hover:bg-[#257a63] text-white'
              }`}
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