import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/homepage/Navbar';
import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import Feed from '../components/homepage/Feed';
import BottomNav from '../components/homepage/BottomNav';
import AudioFeed from '../components/homepage/AudioFeed';
import VideoFeed from '../components/homepage/VideoFeed';

import useProfile from '../../Hooks/useProfile';
import { useDarkMode } from '../contexts/DarkModeContext';
import AnnouncementPopup from '../components/AnnouncementPopup';

function Homepage({ details, profile }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announceTrigger, setAnnounceTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('audio');
  const { profile: authProfile, loading: authLoading } = useProfile();
  const { isDarkMode } = useDarkMode();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (location.state?.openAnnouncement) {
      setAnnounceTrigger(prev => prev + 1);
      // Clear the state so it doesn't trigger on refresh if that's desired, 
      // though typically navigation state clears on new navigation or is handled by the browser history.
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div
      className="min-h-screen relative flex flex-col"
      style={{ backgroundColor: isDarkMode ? '#ffffff' : '#000000' }}
    >
      <AnnouncementPopup trigger={announceTrigger} />
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
      <div className="flex-1"> {/* Use flex-1 to fill remaining space */}
        {/* Conditionally render AudioFeed or VideoFeed based on activeTab */}
        {activeTab === 'audio' ? <AudioFeed profile={profile} /> : <VideoFeed profile={profile} />}
      </div>

      {/* Bottom Navigation - fixed at bottom */}
      <BottomNav onHomeClick={() => setAnnounceTrigger(prev => prev + 1)} />
    </div>
  );
}

export default Homepage;