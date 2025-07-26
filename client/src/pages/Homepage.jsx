import React, { useState } from 'react';
import Navbar from '../components/homepage/Navbar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import Feed from '../components/homepage/Feed';
import BottomNav from '../components/homepage/BottomNav';
import AudioFeed from '../components/homepage/AudioFeed';
import VideoFeed from '../components/homepage/VideoFeed';

import useProfile from '../../Hooks/useProfile';
import { useDarkMode } from '../contexts/DarkModeContext';

function Homepage({details, profile}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('audio');
  const { profile: authProfile, loading: authLoading } = useProfile();
  const { isDarkMode } = useDarkMode();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col"
      style={{ backgroundColor: isDarkMode ? '#ffffff' : '#000000' }}
    >
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
    </div>
  );
}

export default Homepage;