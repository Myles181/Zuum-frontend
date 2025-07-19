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
import useProfile from '../../Hooks/useProfile';

function Homepage({details, profile}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('audio');
  const { profile: authProfile, loading: authLoading } = useProfile();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(true); // Control popup visibility

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* Navbar - fixed at top */}
      <Navbar
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        handleTabClick={handleTabClick}
      />
      
      {/* Sidebar - slides in from left */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content area - flex to fill remaining space */}
      <div className="flex-1 pt-16"> {/* Use flex-1 to fill remaining space */}
        {/* Conditionally render AudioFeed or VideoFeed based on activeTab */}
        {activeTab === 'audio' ? <AudioFeed profile={profile}  /> : <VideoFeed profile={profile} />}
      </div>
      
      {/* Bottom Navigation - fixed at bottom */}
      <BottomNav />
      
      {/* Subscription Popup - only shown when showSubscriptionPopup is true */}
      {showSubscriptionPopup && (
        <SubscriptionPopup onClose={() => setShowSubscriptionPopup(false)} details={details}  />
      )}
    </div>
  );
}

export default Homepage;