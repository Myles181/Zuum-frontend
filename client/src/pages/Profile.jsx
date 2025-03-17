import React, { useState } from 'react';

import Sidebar from '../components/homepage/Sidebar';
import Overlay from '../components/homepage/Overlay';
import ProfileSection from '../components/profile/ProfileSection';
import MusicSection from '../components/profile/MusicSection';
import BottomNav from '../components/homepage/BottomNav';
import Navbar from '../components/profile/NavBar';


const ArtistPage = () => {
 const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div >
      <Navbar toggleSidebar={toggleSidebar}
    name={"Profile"}
    />
         <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
         <Overlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <ProfileSection />
        <MusicSection />
        <BottomNav />
      </div>
 
  );
};

export default ArtistPage;