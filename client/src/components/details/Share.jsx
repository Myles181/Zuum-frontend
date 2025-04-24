import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaTelegram,
  FaLink,
  FaTimes
} from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, url, title, postId }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareableLink, setShareableLink] = useState(url);
  const text = encodeURIComponent("Check out this track");

  // Generate a proper shareable link
  useEffect(() => {
    if (postId) {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared-audio/${postId}`;
      setShareableLink(shareUrl);
    } else {
      setShareableLink(url);
    }
  }, [postId, url]);

  const socialPlatforms = [
    {
      name: "Twitter",
      icon: <FaTwitter className="text-[#1DA1F2]" size={20} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareableLink)}`
    },
    {
      name: "Facebook",
      icon: <FaFacebook className="text-[#1877F2]" size={20} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp className="text-[#25D366]" size={20} />,
      url: `https://wa.me/?text=${text}%20${encodeURIComponent(shareableLink)}`
    },
    {
      name: "Instagram",
      icon: <FaInstagram className="text-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045]" size={20} />
    },
    {
      name: "Telegram",
      icon: <FaTelegram className="text-[#0088CC]" size={20} />,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(title)}`
    },
  ];

  const handleShare = (platform) => {
    if (platform.url) {
      window.open(platform.url, "_blank", "noopener,noreferrer");
    } else {
      alert(`Share to ${platform.name} feature to be implemented`);
    }
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with subtle blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300
            }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={e => e.stopPropagation()} // prevent backdrop click
          >
            {/* Drag handle indicator */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Share this track</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close share modal"
                >
                  <FaTimes className="text-gray-500" size={18} />
                </button>
              </div>

              {/* Social Platforms Grid */}
              <div className="grid grid-cols-5 gap-4 mb-8">
                {socialPlatforms.map((platform) => (
                  <motion.button
                    key={platform.name}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(platform)}
                    className="flex flex-col items-center group"
                    aria-label={`Share to ${platform.name}`}
                  >
                    <div className="w-14 h-14 flex items-center justify-center bg-gray-50 rounded-xl mb-2 group-hover:bg-gray-100 transition-colors">
                      {platform.icon}
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{platform.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Link section */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Share link</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 bg-white border border-gray-200 rounded-l-lg px-4 py-2 text-sm text-gray-700 truncate focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-[#2D8C72] text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Direct share section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4">Send directly to</h4>
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                  {[1, 2, 3, 4, 5].map((user) => (
                    <motion.button
                      key={user}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center flex-shrink-0"
                      onClick={() => {
                        alert(`Sharing to user ${user} functionality to be implemented`);
                        onClose();
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mb-2 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-white font-medium">
                          U{user}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">User {user}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
