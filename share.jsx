import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaTwitter, 
  FaFacebook, 
  FaInstagram, 
  FaWhatsapp, 
  FaTelegram, 
  FaLinkedin, 
  FaLink, 
  FaTimes 
} from "react-icons/fa";

const ShareModal = ({ isOpen, onClose, url, title }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const text = encodeURIComponent("Check out this track");
//   const url = `${window.location.origin}/posts/${postId}`;
  
  const socialPlatforms = [
    { name: "Twitter", icon: <FaTwitter className="text-blue-400" />, url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { name: "Facebook", icon: <FaFacebook className="text-blue-600" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { name: "WhatsApp", icon: <FaWhatsapp className="text-green-500" />, url: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}` },
    { name: "Instagram", icon: <FaInstagram className="text-pink-500" /> },
    { name: "Telegram", icon: <FaTelegram className="text-blue-500" />, url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` },
    // { name: "LinkedIn", icon: <FaLinkedin className="text-blue-700" />, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
  ];

  const handleShare = (platform) => {
    if (platform.url) {
      window.open(platform.url, "_blank");
    } else {
      // For platforms without direct sharing URLs (like Instagram)
      alert(`Share to ${platform.name} feature to be implemented based on their API requirements`);
    }
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-500 rounded-t-2xl bg-white shadow-xl max-h-[80vh] overflow-auto"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share</h3>
                <button 
                  onClick={onClose} 
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
              
              {/* Social Platforms */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {socialPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => handleShare(platform)}
                    className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-2">
                      {platform.icon}
                    </div>
                    <span className="text-xs text-gray-700">{platform.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Copy Link */}
              <div className="border-t pt-4">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                      <FaLink className="text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-800">Copy link</span>
                  </div>
                  <span className={`text-sm ${copySuccess ? 'text-green-500' : 'text-gray-500'}`}>
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>
              
              {/* Direct Message */}
              <div className="border-t mt-4 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Send via message</h4>
                <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                  {/* These would be your app users */}
                  {[1, 2, 3, 4, 5].map((user) => (
                    <button
                      key={user}
                      className="flex-shrink-0 flex flex-col items-center"
                      onClick={() => {
                        alert(`Sharing ${user} functionality to be implemented`);
                        onClose();
                      }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        {/* Replace with actual user images */}
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500" />
                      </div>
                      <span className="text-xs text-gray-700 mt-1">User {user}</span>
                    </button>
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




















// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   FaTwitter, 
//   FaFacebook, 
//   FaInstagram, 
//   FaWhatsapp, 
//   FaTelegram, 
//   FaLinkedin, 
//   FaLink, 
//   FaTimes,
//   FaShare
// } from "react-icons/fa";

// const ShareModal = ({ isOpen, onClose, url, title }) => {
//   const [copySuccess, setCopySuccess] = useState(false);
  
//   const socialPlatforms = [
//     { 
//       name: "Twitter", 
//       icon: <FaTwitter className="text-blue-400" />, 
//       action: () => handleGenericShare(title, url, "Twitter")
//     },
//     { 
//       name: "Facebook", 
//       icon: <FaFacebook className="text-blue-600" />, 
//       action: () => handleGenericShare(title, url, "Facebook") 
//     },
//     { 
//       name: "WhatsApp", 
//       icon: <FaWhatsapp className="text-green-500" />, 
//       action: () => handleGenericShare(title, url, "WhatsApp") 
//     },
//     { 
//       name: "Instagram", 
//       icon: <FaInstagram className="text-pink-500" />, 
//       action: () => handleGenericShare(title, url, "Instagram") 
//     },
//     { 
//       name: "Telegram", 
//       icon: <FaTelegram className="text-blue-500" />, 
//       action: () => handleGenericShare(title, url, "Telegram") 
//     },
//     { 
//       name: "LinkedIn", 
//       icon: <FaLinkedin className="text-blue-700" />, 
//       action: () => handleGenericShare(title, url, "LinkedIn") 
//     },
//   ];

//   // Generic share function that uses Web Share API when available
//   // or copies to clipboard with appropriate message when not
//   const handleGenericShare = (title, url, platform) => {
//     // Try native sharing first (works on mobile)
//     if (navigator.share) {
//       navigator.share({
//         title: title,
//         text: title,
//         url: url,
//       }).catch(() => {
//         copyToClipboard();
//         showShareInstructions(platform);
//       });
//     } else {
//       // Fallback for desktop or when navigator.share is unavailable
//       copyToClipboard();
//       showShareInstructions(platform);
//     }
//   };

//   const showShareInstructions = (platform) => {
//     // Show a message with instructions specific to the platform
//     const messages = {
//       "Twitter": "Link copied! Open Twitter and paste the link to share.",
//       "Facebook": "Link copied! Open Facebook and paste the link to share.",
//       "WhatsApp": "Link copied! Open WhatsApp and paste the link to share.",
//       "Instagram": "Link copied! Open Instagram and paste the link to share.",
//       "Telegram": "Link copied! Open Telegram and paste the link to share.",
//       "LinkedIn": "Link copied! Open LinkedIn and paste the link to share."
//     };
    
//     alert(messages[platform] || `Link copied! Open ${platform} to share.`);
//   };

//   const handleShare = (platform) => {
//     platform.action();
//     onClose();
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(url).then(() => {
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//     }).catch(err => {
//       // Fallback for browsers that don't support clipboard API
//       const textArea = document.createElement("textarea");
//       textArea.value = url;
//       document.body.appendChild(textArea);
//       textArea.focus();
//       textArea.select();
//       try {
//         document.execCommand('copy');
//         setCopySuccess(true);
//         setTimeout(() => setCopySuccess(false), 2000);
//       } catch (err) {
//         console.error('Failed to copy: ', err);
//       }
//       document.body.removeChild(textArea);
//     });
//   };

//   // Try to use the native share dialog if available (mainly mobile devices)
//   const useNativeShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: title,
//         text: title,
//         url: url,
//       }).catch(err => console.error("Error sharing:", err));
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 z-40"
//             onClick={onClose}
//           />
          
//           {/* Modal */}
//           <motion.div
//             initial={{ y: "100%" }}
//             animate={{ y: 0 }}
//             exit={{ y: "100%" }}
//             transition={{ type: "spring", damping: 25 }}
//             className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-xl max-h-[80vh] overflow-auto"
//           >
//             <div className="p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Share</h3>
//                 <div className="flex items-center">
//                   {navigator.share && (
//                     <button 
//                       onClick={useNativeShare} 
//                       className="flex items-center p-2 rounded-full hover:bg-gray-100 mr-2"
//                     >
//                       <FaShare className="text-blue-500 mr-1" />
//                       <span className="text-sm text-blue-500 font-medium">Share</span>
//                     </button>
//                   )}
//                   <button 
//                     onClick={onClose} 
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <FaTimes className="text-gray-500" />
//                   </button>
//                 </div>
//               </div>
              
//               {/* Social Platforms */}
//               <div className="grid grid-cols-4 gap-4 mb-6">
//                 {socialPlatforms.map((platform) => (
//                   <button
//                     key={platform.name}
//                     onClick={() => handleShare(platform)}
//                     className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-all"
//                   >
//                     <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full mb-2">
//                       {platform.icon}
//                     </div>
//                     <span className="text-xs text-gray-700">{platform.name}</span>
//                   </button>
//                 ))}
//               </div>
              
//               {/* Copy Link */}
//               <div className="border-t pt-4">
//                 <button
//                   onClick={copyToClipboard}
//                   className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 transition-all"
//                 >
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full mr-3">
//                       <FaLink className="text-gray-600" />
//                     </div>
//                     <span className="font-medium text-gray-800">Copy link</span>
//                   </div>
//                   <span className={`text-sm ${copySuccess ? 'text-green-500' : 'text-gray-500'}`}>
//                     {copySuccess ? 'Copied!' : 'Copy'}
//                   </span>
//                 </button>
//               </div>
              
//               {/* Direct Message */}
//               <div className="border-t mt-4 pt-4">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Send via message</h4>
//                 <div className="flex items-center space-x-3 overflow-x-auto pb-2">
//                   {/* These would be your app users */}
//                   {[1, 2, 3, 4, 5].map((user) => (
//                     <button
//                       key={user}
//                       className="flex-shrink-0 flex flex-col items-center"
//                       onClick={() => {
//                         alert(`Share with user ${user} functionality to be implemented`);
//                         onClose();
//                       }}
//                     >
//                       <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
//                         {/* Replace with actual user images */}
//                         <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500" />
//                       </div>
//                       <span className="text-xs text-gray-700 mt-1">User {user}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ShareModal;