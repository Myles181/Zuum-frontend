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
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
            style={{ 
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)'
            }}
            onClick={e => e.stopPropagation()} // prevent backdrop click
          >
            {/* Drag handle indicator */}
            <div className="flex justify-center py-2">
              <div 
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: 'var(--color-border)' }}
              ></div>
            </div>

            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Share this track
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors"
                  style={{ 
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-secondary)'
                  }}
                  aria-label="Close share modal"
                >
                  <FaTimes size={18} />
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
                    <div 
                      className="w-14 h-14 flex items-center justify-center rounded-xl mb-2 transition-colors"
                      style={{ 
                        backgroundColor: 'var(--color-bg-secondary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-bg-tertiary)'
                        }
                      }}
                    >
                      {platform.icon}
                    </div>
                    <span 
                      className="text-xs font-medium"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {platform.name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Link section */}
              <div 
                className="rounded-xl p-4 mb-6"
                style={{ 
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <p 
                  className="text-sm mb-2"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Share link
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shareableLink}
                    readOnly
                    className="flex-1 px-4 py-2 text-sm truncate focus:outline-none rounded-l-lg"
                    style={{ 
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)'
                    }}
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-2 rounded-r-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'var(--color-primary-dark)'
                      }
                    }}
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Direct share section */}
              <div>
                <h4 
                  className="text-sm font-semibold mb-4"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Send directly to
                </h4>
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
                      <div 
                        className="w-12 h-12 rounded-full mb-2 overflow-hidden"
                        style={{ 
                          background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-primary-light))'
                        }}
                      >
                        <div 
                          className="w-full h-full flex items-center justify-center font-medium"
                          style={{ color: 'white' }}
                        >
                          U{user}
                        </div>
                      </div>
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        User {user}
                      </span>
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