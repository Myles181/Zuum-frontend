import React, { useState } from 'react';
import Navbar from '../components/homepage/Navbar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import Feed from '../components/homepage/Feed';
import BottomNav from '../components/homepage/BottomNav';
import AudioFeed from '../components/homepage/AudioFeed';
import VideoFeed from '../components/homepage/VideoFeed';

import { FiX, FiCheckCircle } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
import SubscriptionPopup from '../components/subscription/Popup';

function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('audio');
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(true); // Control popup visibility

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <Navbar
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Conditionally render AudioFeed or VideoFeed based on activeTab */}
      {activeTab === 'audio' ? <AudioFeed /> : <VideoFeed />}

      <BottomNav />
      
      {/* Subscription Popup - only shown when showSubscriptionPopup is true */}
      {showSubscriptionPopup && (
        <SubscriptionPopup onClose={() => setShowSubscriptionPopup(false)} />
      )}
    </div>
  );
}

export default Homepage;