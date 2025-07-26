import React, { useState } from 'react';
import { FaBullhorn, FaMusic } from 'react-icons/fa';
import { motion } from 'framer-motion';
import BottomNav from '../components/homepage/BottomNav';
import Navbar from '../components/profile/NavBar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import PromotionDetails from '../components/promotion/PromotionDetails';
import ActivePromotions from '../components/promotion/ActivePromotions';
import { FaPlay, FaCheck } from 'react-icons/fa';
import PreviewModal from '../components/promotion/PreviewModal';
import { usePromotePost, useUserPosts } from '../../Hooks/search/useAllPost';


const PromotionPage = () => {
  const {
    beats,
    videos,
    audios,
    allPosts,
    loading,
    error,
    isEmpty,
    refetch
  } = useUserPosts();


  console.log(allPosts);
  

  // UI state
  const [selectedContent, setSelectedContent] = useState(null);
  const [duration, setDuration] = useState(7);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showLockedModal, setShowLockedModal] = useState(false);

  // Use the promotion hook
  const { 
    promotePost, 
    loading: promotionLoading, 
    error: promotionError,
    success: promotionSuccess,
    reset: resetPromotion
  } = usePromotePost();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const toggleContentSelection = (item) => {
    setSelectedContent(prev => prev?.id === item.id ? null : item);
    resetPromotion(); // Reset promotion state when changing selection
  };

  const handlePromote = async () => {
    if (!selectedContent) return;
    
    try {
      await promotePost(selectedContent.id, selectedContent.type);
      // On success, you might want to refetch the posts to update the promoted status
      refetch.all();
    } catch (err) {
      // Error is already handled by the hook
      console.error('Promotion failed:', err);
    }
  };

  if (loading.all) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2D8C72]"></div>
      </div>
    );
  }

  if (error.any) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex flex-col justify-center items-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-md">
          {/* Error display */}
        </div>
        <button 
          onClick={refetch.all}
          className="mt-4 px-6 py-2 rounded-lg bg-[#2D8C72] text-white hover:bg-[#1E6B5E]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 my-13 flex flex-col justify-center items-center">
        <div className="text-center max-w-md">
          <FaMusic className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No content to promote</h3>
          <p className="mt-2 text-gray-500">You haven't uploaded any beats, videos, or audios yet.</p>
          <button className="mt-6 px-6 py-2 rounded-lg bg-[#2D8C72] text-white hover:bg-[#1E6B5E]">
            Upload Content
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 my-13">
      <Navbar name="Promote Content" toggleSidebar={toggleSidebar} />
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
              <FaMusic /> Your Uploads ({allPosts.length})
            </h2>
            
            {allPosts.map(item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`rounded-xl shadow-sm overflow-hidden border ${
                  selectedContent?.id === item.id 
                    ? 'border-[#2D8C72] ring-1 ring-[#2D8C72]' 
                    : 'border-gray-200'
                }`}
                style={{ backgroundColor: 'var(--color-bg-primary)' }}
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
                      src={item.cover_photo || 'https://source.unsplash.com/random/300x300/?music'} 
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
                        <p 
                          className="text-sm capitalize"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {item.type} • {item.duration || '--:--'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleContentSelection(item)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedContent?.id === item.id
                            ? 'bg-[#2D8C72] text-white'
                            : 'border-2 border-gray-300'
                        }`}
                        disabled={promotionLoading}
                      >
                        {selectedContent?.id === item.id && <FaCheck className="text-xs" />}
                      </button>
                    </div>
                    
                    <div className="mt-3 flex justify-between items-center">
                      <span 
                        className="text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {item.plays_count?.toLocaleString() || '0'} plays
                      </span>
                      <span className="font-medium">
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
                isSelected={selectedContent?.id === currentItem.id}
                toggleContentSelection={() => toggleContentSelection(currentItem)}
                onClose={() => setShowLockedModal(false)}
              />
            )}
          </div>
          
          {/* Promotion Details */}
          <PromotionDetails 
            selectedContent={selectedContent}
            duration={duration}
            setDuration={setDuration}
            onPromote={handlePromote}
            promotionLoading={promotionLoading}
            promotionError={promotionError}
          />
        </div>
        
        {/* Active Promotions */}
        <ActivePromotions activePromotions={beats.filter(b => b.is_promoted)} />
      </div>
      
      <BottomNav activeTab="home" />
    </div>
  );
};

export default PromotionPage;