import React, { useState } from 'react';
import { FaBullhorn, FaMusic, FaCalendarAlt, FaDollarSign, FaCheck, FaTimes, FaLock, FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../components/homepage/BottomNav';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';

const PromotionPage = () => {
  // Mock data
  const userContent = [
    {
      id: 1,
      title: "Neon Dreams",
      type: "beat",
      coverImage: "https://source.unsplash.com/random/300x300/?electronic",
      plays: 1243,
      duration: "2:45",
      price: 5000 // in Naira
    },
    {
      id: 2,
      title: "Midnight Groove",
      type: "audio",
      coverImage: "https://source.unsplash.com/random/300x300/?music",
      plays: 856,
      duration: "3:12",
      price: 3000 // in Naira
    },
    {
      id: 3,
      title: "Urban Flow",
      type: "beat",
      coverImage: "https://source.unsplash.com/random/300x300/?hiphop",
      plays: 2105,
      duration: "3:30",
      price: 4500 // in Naira
    }
  ];

  const activePromotions = [
    {
      id: 1,
      content: {
        title: "Neon Dreams",
        type: "beat",
        coverImage: "https://source.unsplash.com/random/300x300/?electronic"
      },
      startDate: "2023-06-15",
      endDate: "2023-06-22",
      status: "approved",
      price: 5000 // in Naira
    }
  ];

  // UI state
  const [selectedContent, setSelectedContent] = useState([]);
  const [duration, setDuration] = useState(7);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate price in Naira (₦5000 per item per week)
  const promoPrice = (selectedContent.length * 5000 * (duration / 7)).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  });

  const toggleContentSelection = (id) => {
    setSelectedContent(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const pricingTiers = [
    { days: 7, label: "1 Week" },
    { days: 14, label: "2 Weeks" },
    { days: 30, label: "1 Month" }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 p-4 my-13">
           <Navbar name="Your Beats" toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaBullhorn className="text-[#2D8C72]" /> Promote Your Content
          </h1>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Content Selection */}
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
          </div>
          
          {/* Promotion Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaBullhorn /> Promotion Details
            </h2>
            
            {/* Selected Content */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Selected ({selectedContent.length})</h3>
              {selectedContent.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {userContent
                    .filter(item => selectedContent.includes(item.id))
                    .map(item => (
                      <div key={item.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                        <img 
                          src={item.coverImage} 
                          alt={item.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <span className="truncate flex-1">{item.title}</span>
                        <button 
                          onClick={() => toggleContentSelection(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select items to promote</p>
              )}
            </div>
            
            {/* Duration */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt /> Duration
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {pricingTiers.map(tier => (
                  <button
                    key={tier.days}
                    onClick={() => setDuration(tier.days)}
                    className={`py-2 rounded text-sm ${
                      duration === tier.days
                        ? 'bg-[#2D8C72] text-white border border-[#2D8C72]'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <FaDollarSign /> Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>{selectedContent.length} × ₦5,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} days</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{promoPrice}</span>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              disabled={selectedContent.length === 0}
              className={`w-full py-3 rounded-lg font-medium ${
                selectedContent.length > 0
                  ? 'bg-[#2D8C72] hover:bg-[#257a63] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Request Promotion
            </button>
            
            <p className="text-xs text-gray-500 mt-3">
              Admin approval required. Processing time: 24-48 hours.
            </p>
          </div>
        </div>
        
        {/* Active Promotions */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
  <h2 className="text-xl font-semibold mb-6">Active Promotions</h2>

  {activePromotions.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {activePromotions.map(promo => (
        <div
          key={promo.id}
          className="flex flex-col md:flex-row items-start bg-gray-50 rounded-lg p-4"
        >
          <img
            src={promo.content.coverImage}
            alt={promo.content.title}
            className="w-full md:w-16 h-40 md:h-16 rounded object-cover flex-shrink-0"
          />
          <div className="mt-4 md:mt-0 md:ml-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{promo.content.title}</h3>
                <span
                  className={`
                    px-2 py-1 text-xs rounded-full 
                    ${promo.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}
                  `}
                >
                  {promo.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(promo.startDate).toLocaleDateString()} –{' '}
                {new Date(promo.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">
                ₦{promo.price.toLocaleString()}
              </span>
              <button className="text-[#2D8C72] hover:text-[#257a63] transition-colors">
                View Stats
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500">No active promotions</p>
  )}
</div>
</div>
      
      {/* Preview Modal */}
      <AnimatePresence>
        {showLockedModal && currentItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLockedModal(false)}
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
                  src={currentItem.coverImage} 
                  alt={currentItem.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-6">
                  <div className="flex justify-end">
                    <button 
                      onClick={() => setShowLockedModal(false)}
                      className="text-white hover:text-gray-200"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentItem.title}</h2>
                    <p className="text-white/80">{currentItem.type === 'beat' ? 'Beat' : 'Track'} • {currentItem.duration}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <FaLock className="text-[#2D8C72]" />
                    <span className="font-medium">Preview Only</span>
                  </div>
                  <span className="text-gray-500">{currentItem.plays.toLocaleString()} plays</span>
                </div>
                
                <div className="flex justify-center">
                  <button className="bg-[#2D8C72] hover:bg-[#257a63] text-white px-8 py-3 rounded-full flex items-center gap-2">
                    <FaPlay /> Play 30s Preview
                  </button>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Promotion Options</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Promote this {currentItem.type} to get more visibility and plays.
                  </p>
                  <button 
                    onClick={() => {
                      toggleContentSelection(currentItem.id);
                      setShowLockedModal(false);
                    }}
                    className={`w-full py-2 rounded-lg ${
                      selectedContent.includes(currentItem.id)
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-[#2D8C72] hover:bg-[#257a63] text-white'
                    }`}
                  >
                    {selectedContent.includes(currentItem.id) ? 'Selected ✓' : 'Select for Promotion'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav activeTab="home" />
    </div>
  );
};

export default PromotionPage;