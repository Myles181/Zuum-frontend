import React from 'react';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { Music, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StreamingPlatformsModal = ({ 
  platforms, 
  isOpen, 
  onClose 
}) => {
  const platformIcons = {
    spotify: <FaSpotify className="text-2xl text-[#1DB954]" />, 
    apple_music: <FaApple className="text-2xl text-[#FC3C44]" />, 
    youtube_music: <FaYoutube className="text-2xl text-[#FF0000]" />, 
    boomplay: <Music className="text-2xl text-[#2D8C72]" />, 
    audiomark: <Music2 className="text-2xl text-[#2D8C72]" />
  };

  const platformLabels = {
    spotify: "Spotify",
    apple_music: "Apple Music",
    youtube_music: "YouTube Music",
    boomplay: "Boomplay",
    audiomark: "Audiomark"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 "
            onClick={onClose}
          />
          
          {/* Modal container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl h-[70vh] overflow-hidden mb-10"
            onClick={e => e.stopPropagation()} // prevent backdrop click
          >
            {/* Drag handle indicator */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Streaming Platforms</h3>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-gray-500" size={18} />
                </button>
              </div>
               
              {/* Platforms List */}
              <div className="space-y-3">
                {Object.entries(platforms).map(([platform, url]) => (
                  <motion.div
                    key={platform}
                    whileTap={{ scale: url ? 0.98 : 1 }}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      url ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50/50'
                    } transition-colors`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 flex items-center justify-center">
                        {platformIcons[platform] || <Music size={20} />}
                      </div>
                      <span className="font-medium text-gray-900">
                        {platformLabels[platform] || platform}
                      </span>
                    </div>
                    
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-[#2D8C72]"
                      >
                        <FaCheckCircle />
                        <span className="text-sm font-medium">Available</span>
                      </a>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <FaTimesCircle />
                        <span className="text-sm">Not Available</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StreamingPlatformsModal;
