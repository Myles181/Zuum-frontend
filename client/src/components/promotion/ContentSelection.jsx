import React, { useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { FaPlay, FaCheck } from 'react-icons/fa';
import PreviewModal from './PreviewModal';

const ContentSelection = ({ userContent, selectedContent, setSelectedContent }) => {
  const [currentItem, setCurrentItem] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  const toggleContentSelection = (id) => {
    setSelectedContent(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="md:col-span-2 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <FaMusic /> Your Uploads
      </h2>
      
      {userContent.map(item => (
        <motion.div
          key={item.id}
          whileHover={{ scale: 1.01 }}
          className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
            selectedContent.includes(item.id) 
              ? 'border-[#2D8C72] ring-1 ring-[#2D8C72]' 
              : 'border-gray-200'
          }`}
        >
          <div className="flex">
            <div 
              className="w-24 h-24 bg-gray-100 relative cursor-pointer"
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
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <FaPlay className="text-white text-lg" />
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.type === 'beat' ? 'Beat' : 'Track'} • {item.duration}</p>
                </div>
                <button
                  onClick={() => toggleContentSelection(item.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    selectedContent.includes(item.id)
                      ? 'bg-[#2D8C72] text-white'
                      : 'border-2 border-gray-300'
                  }`}
                >
                  {selectedContent.includes(item.id) && <FaCheck className="text-xs" />}
                </button>
              </div>
              
              <div className="mt-3 flex justify-between items-center">
                <span className="text-sm text-gray-500">{item.plays.toLocaleString()} plays</span>
                <span className="font-medium">₦{item.price.toLocaleString()}</span>
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